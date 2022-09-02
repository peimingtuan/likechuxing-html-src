import myAjax from '../../common/myAjax'
import getApiUrl from '../../common/getApiUrl'

const app = getApp()

Page({
  data:{
    code_text: '获取验证码',
    phone: '',
    code: '',
    count: 61,
    locationSucc:false,
    rules:[],
    city_array:[],
    step:1
  },

  onJump(){
    console.log('tap')
    my.navigateTo({
      url:'/page/coupon/list'
    })
  },

  getActivityRules() {
    let that = this
    myAjax.post(getApiUrl('/activity/attend-info'), {}, function (res) {
      if (res.status === 0) {
        let detail = res.data.coutent.map(item=>item.title)
        that.setData({
          rules: detail,
          city_array: res.data.city_array
        })
      } else {
        my.showToast({
          content: res.msg
        })
      }
    })
  },

  bindKeyInput: function (e) {
    if (e.detail.value.length === 11) {
      my.hideKeyboard()
    }
    this.setData({
      phone: e.detail.value
    })
  },

  bindKeyInput2: function (e) {
    if (e.detail.value.length === 4) {
      my.hideKeyboard()
    }
    this.setData({
      code: e.detail.value
    })
  },

  getCode: function () {
    if (this.data.code_text !== '获取验证码') {
      return
    }

    if (!/^1[3456789]\d{9}$/.test(this.data.phone)) {
      my.showToast({
        content: "请输入正确手机号"
      })
      return
    }

    let that = this
    myAjax.post(getApiUrl('/alipay-login/get-code'), {
      phone: this.data.phone,
      openid:app.globalData.open_id,
      auth_token:app.globalData.auth_token
    }, function (res) {
      if (res.status === 0) {
        that.setData({
          code_text: '发送成功',
          count: 60
        })
        that.countDown()
      } else if (res.msg === '验证码已发送,请注意查收') {
        my.showToast({
          content: res.msg
        })
        that.setData({
          code_text: '发送成功',
          count: 60
        })
        that.countDown()
      }else{
        my.showToast({
          content: res.msg
        })
      }
    })
  },

  submit() {
    if (this.data.count === 61) {
      my.showToast({
        content: "请先获取验证码"
      })
      return
    }

    if (!/^1[3456789]\d{9}$/.test(this.data.phone)) {
      my.showToast({
        content: "请输入正确手机号"
      })
      return
    }

    if (!/^\d{4}$/.test(this.data.code)) {
      my.showToast({
        content: "验证码格式不正确"
      })
      return
    }

    let that = this

    if(!this.data.city_array.includes(Number(app.globalData.city_id))){
      my.confirm({
        content:'当前位置不在活动范围内，确认继续？',
        success:function(result){
          if(result.confirm){
            that.attend()
          }
        }
      })
      return
    }

    this.attend()
  },

  attend() {
    let that = this
    my.showLoading({
      content: '领取中...'
    })
    myAjax.post(getApiUrl('/alipay-login/verify-code'), {
      phone:this.data.phone,
      code:this.data.code,
      openid:app.globalData.open_id,
      auth_token:app.globalData.auth_token,
      city_id:app.globalData.city_id,
      channel:app.globalData.city_id+'_'+app.globalData.channel
    }, function (res) {
      my.hideLoading({
        content:'领取中...'
      })
      if (res.status === 0) {
        app.globalData.uuid = res.data.uuid
        app.globalData.sign = res.data.sign
        
        if(!that.data.city_array.includes(Number(app.globalData.city_id))){
          that.setData({
            step:2
          })
        }else{
          my.redirectTo({
            url:'/page/coupon/list'
          })
        }
        
      } else {
        my.showToast({
          content: res.msg
        })
      }
    })
  },

  countDown() {
    let that = this
    if (that.data.count < 1) {
      that.setData({
        code_text: '获取验证码',
        count: 60
      })
    } else {
      setTimeout(function () {
        that.setData({
          code_text: that.data.count - 1 + 's',
          count: that.data.count - 1
        })
        that.countDown()
      }, 1000)
    }
  },
  onLoad(query) {
    this.getActivityRules()
    let that = this
    app.getLocation(function(){
      that.setData({
        locationSucc:true
      })
    })
    app.getOpenId()
    // 页面加载
    console.info(`Page onLoad with query: ${JSON.stringify(query)}`);
  },

  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: '我领了1张共享汽车的免费券，你也快来',
      desc: '遍布全城的共享汽车“立刻出行”限时首单免费，抓紧时间！',
      path: 'page/index/index',
      imageUrl:'https://activity.likechuxing.com/images/activity_inviteFriends3/mini_share2.jpg'
    };
  },
});

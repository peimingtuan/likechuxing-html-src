// pages/activity/invite.js
const app = getApp()
import myAjax from '../../js/myAjax.js'
import getApiUrl from '../../js/getApiUrl.js'
import getStateUrl from '../../js/getStaticUrl.js'
import env from '../../js/env.js'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    login_text:'登录中...',
    code_text:'获取验证码',
    uuid:'',
    sign:'',
    soldOut: true,
    act_time: [1526486400, 1527782400],// 5.17_0:0-5.31_24:0
    phone: '',
    code:'',
    count:61,
    city_array:{},

    step: 0,
    new_user:1,
    rules:[]
  },

  toLicense:function(){
    wx.redirectTo({
      url: '/pages/user/license'
    })
  },

  countDown(){
    let that = this
    console.log('succ',that.data.count)
    if(that.data.count < 1){
      that.setData({
        code_text: '获取验证码',
        count: 60
      })
    }else{
      setTimeout(function () {
        that.setData({
          code_text: that.data.count - 1 + 's',
          count: that.data.count - 1
        })
        that.countDown()
      }, 1000)
    }
  },

  getCode:function(){
    if(this.data.code_text!=='获取验证码'){
      return
    }

    if (!/^1[3456789]\d{9}$/.test(this.data.phone)) {
      wx.showToast({
        title: "请输入正确手机号",
        icon: 'none'
      })
      return
    }

    let that = this
    myAjax.post(getApiUrl('/login/get-code'), {
      phone:this.data.phone
    }, function (res) {
      if(res.status === 0){
        console.log('succ')
        that.setData({
          code_text:'发送成功',
          count:60
        })
        that.countDown()
      }else{
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },

  submit() {
    if(this.data.count === 61){
      wx.showToast({
        title: "请先获取验证码",
        icon: 'none'
      })
      return
    }

    if (!/^1[3456789]\d{9}$/.test(this.data.phone)) {
      wx.showToast({
        title: "请输入正确手机号",
        icon: 'none'
      })
      return
    }

    if (!/^\d{4}$/.test(this.data.code)) {
      wx.showToast({
        title: "验证码格式不正确",
        icon: 'none'
      })
      return
    }

    let that = this
    if (this.data.soldOut) {
      wx.showModal({
        title: '',
        content: '明天注册才能取得话费哦，确定要现在注册吗？',
        confirmText:'确定',
        success:res=>{
          if(res.confirm){
            that.attend()
          }
        }
      })
      return
    }

    if (!this.data.city_array.hasOwnProperty(Number(app.globalData.city_id))) {
      wx.showModal({
        title: '',
        content: '您所处城市未在活动范围内哦，要继续注册吗？',
        confirmText: '继续',
        success: res => {
          if (res.confirm) {
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
    myAjax.post(getApiUrl('/activity/attend'), {
      activity_id: 1,
      channel: 'summer_program',
      open_id: app.globalData.open_id,
      openid_type:2,
      phone_no: this.data.phone,
      code:this.data.code,
      city_id:app.globalData.city_id,
      user_lat: app.globalData.lat,
      user_lng:app.globalData.lng
    }, function (res) {
      if (res.status === 0) {
        if (res.data.new_user) {
          // 新用户
          that.setData({
            step: 2,
            new_user: res.data.new_user
          })
          if(!res.data.new_attend){
            // 新用户第二次进来了
            wx.showToast({
              title: '已经参加活动，无需重复参加',
              icon: 'none'
            })
          }
          app.saveData({
            cel:that.data.phone,
            uuid:res.data.uuid,
            sign:res.data.sign
          })
        }else{
          // 老用户不参加
          wx.showToast({
            title: '已注册用户无法参与该活动，请打开APP了解更多活动信息。',
            icon: 'none'
          })
        }         
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },

  bindKeyInput: function (e) {
    if (e.detail.value.length === 11) {
      wx.hideKeyboard()
    }
    this.setData({
      phone: e.detail.value
    })
  },

  bindKeyInput2: function (e) {
    if (e.detail.value.length === 4) {
      wx.hideKeyboard()
    }
    this.setData({
      code: e.detail.value
    })
  },

  getActivityRules() {
    let that = this
    myAjax.post(getApiUrl('/activity/attend-info'), {
      activity_id: 1
    }, function (res) {
      if (res.status === 0) {
        that.setData({
          rules:res.data.detail,
          soldOut: Boolean(res.data.alert_des),
          city_array:res.data.city_array
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },

  sendOpenId() {
    let that = this

    myAjax.post(getApiUrl('/activity/has-attend'), {
      open_id: app.globalData.open_id,
      openid_type: 2,
      activity_id: 1
    }, function (res) {
      if (res.status === 0) {
        if (res.data.attend_status === 1) {
          // 参加过
          app.saveData({
            uuid: res.data.uuid,
            sign: res.data.sign
          })
          that.setData({
            step: 2,
            phone: res.data.phone_no
          })
          wx.showToast({
            title: '已经参加活动，无需重复参加',
            icon: 'none'
          })
          /*
          if (res.data.uuid && res.data.sign) {
            // 注册了=传过照片
            app.saveData({
              uuid: res.data.uuid,
              sign: res.data.sign
            },function(){
              wx.redirectTo({
              url: '/pages/user/licenseInfo',
            })
            })
          } else {
            // 注册了，还没传照片
            that.setData({
              step: 2,
              phone: res.data.phone_no
            })
            wx.showToast({
              title: '已经参加活动，无需重复参加',
              icon: 'none'
            })
          }
          */
        } else {
          // 没参加过
          that.setData({
            step: 1
          })
        }
      }else{
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },

  clear: function () {
    if (env === 'dev') {
      app.clearData()
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this

    if(this.data.step>0){
      return
    }

    setTimeout(function(){
      that.setData({
        login_text:'活动太火爆了，先让服务器喘口气，请稍后再试试~'
      })
    },3000)

    this.getActivityRules()

    let localData = app.getData()
    if (localData && localData.open_id){
      if(localData.step === 4){
        wx.redirectTo({
          url: '/pages/user/licenseInfo',
        })
      }else{
        this.sendOpenId()
      }
    
    }else{
      app.getOpenId(()=>this.sendOpenId())
      app.getCityId()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    return {
      title: '点击领取10元话费',
      path: 'pages/activity/invite',
      imageUrl: imgData.share,
      success: function () {
      }
    }
  }
})
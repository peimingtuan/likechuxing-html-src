// pages/activity/invite.js
const app = getApp()
import myAjax from '../../js/myAjax.js'
import getApiUrl from '../../js/getApiUrl.js'
import getStateUrl from '../../js/getStaticUrl.js'
import env from '../../js/env.js'
import shareAppMessage from '../../js/shareAppMessage.js'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    login_text: '登录中...',
    code_text: '获取验证码',
    uuid: '',
    sign: '',
    allow_city:false,
    soldOut: true,
    act_time: [1526486400, 1527782400],// 5.17_0:0-5.31_24:0
    phone: '',
    code: '',
    count: 61,
    city_array: {},
    step: 0,
    new_user: 0,
    rules: [],
    time_start:0,
    show_code:false,
    content:[]
  },

  toLicense: function () {

    myAjax.post(getApiUrl('/user/information'), {
      uuid: app.globalData.uuid,
      sign: app.globalData.sign,
      auth: 0
    }, function (res) {
      if (Number(res.data.license.status) >= 2) {
        wx.redirectTo({
          url: '/pages/user/license'
        })
      } else {
        wx.redirectTo({
          url: '/pages/user/licenseInfo?status=' + res.data.license.status
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

  getCode: function () {
    if (this.data.code_text !== '获取验证码') {
      return
    }

    if (!/^1[3456789]\d{9}$/.test(this.data.phone)) {
      wx.showToast({
        title: "请输入正确手机号",
        icon: 'none'
      })
      return
    }

    this.setData({
      show_code:true
    })
    let that = this
    myAjax.post(getApiUrl('/login/get-code'), {
      phone: this.data.phone
    }, function (res) {
      if (res.status === 0) {
        that.setData({
          code_text: '发送成功',
          count: 60
        })
        that.countDown()
      } else if (res.msg === '验证码已发送,请注意查收') {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
        that.setData({
          code_text: '发送成功',
          count: 60
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
    if(!this.data.show_code){
      this.getCode()
      return
    }

    if (this.data.count === 61) {
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
        content: '明天注册才能领话费哦，点击“继续”可完成注册并查看其他奖励',
        confirmText: '继续',
        success: res => {
          if (res.confirm) {
            that.checkCity()
          }
        }
      })
      return
    }

    this.checkCity()
  },
  checkCity(){
    let that = this
    if (!this.data.city_array.hasOwnProperty(Number(app.globalData.city_id))) {
      wx.showModal({
        title: '',
        content: '您所处城市未在活动范围内哦，无法获得话费，要继续注册吗？',
        confirmText: '继续',
        success: res => {
          if (res.confirm) {
            that.checkTimeStart()
          }
        }
      })
      return
    } else {
      this.setData({
        allow_city: true
      })
      this.checkTimeStart()
    }

    
  },
  checkTimeStart(){
    if (this.data.time_start) {
      this.attend()
    } else {
      wx.showModal({
        title: '当前活动尚未开始',
        content: '',
        showCancel:false,
        confirmText:'知道了'
      })
    }
  },

  attend() {
    let that = this
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    myAjax.post(getApiUrl('/activity/attend'), {
      activity_id: 2,
      channel: app.globalData.city_id+'_8870',
      phone_no: this.data.phone,
      code: this.data.code,
      city_id: app.globalData.city_id,
      user_lat: app.globalData.lat,
      user_lng: app.globalData.lng,
      open_id:app.globalData.open_id
    }, function (res) {
      wx.hideLoading()
      if (res.status === 0) {
        app.saveData({
          uuid: res.data.uuid,
          sign: res.data.sign
        })
        if (res.data.new_user) {
          // 新用户
          that.setData({
            step: 2,
            new_user: res.data.new_user
          })
          if (!res.data.new_attend) {
            // 新用户第二次进来了
            wx.showToast({
              title: '已经参加活动，无需重复参加',
              icon: 'none'
            })
          }
          app.saveData({
            cel: that.data.phone,
          })
        } else {
          // 老用户
          myAjax.post(getApiUrl('/user/information'), {
            uuid: res.data.uuid,
            sign: res.data.sign,
            auth: 0
          }, function (res2) {
            console.log()
            if (Number(res2.data.license.status) >= 2) {
              that.setData({
                step: 2,
                new_user: res.data.new_user
              })
            } else {
              wx.redirectTo({
                url: '/pages/user/licenseInfo?status=' + res2.data.license.status
              })
            }
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
      activity_id: 2,
      city_id:app.globalData.city_id
    }, function (res) {
      if (res.status === 0) {
        that.setData({
          rules: res.data.detail,
          soldOut: Boolean(res.data.alert_des),
          city_array: res.data.city_array,
          step:1,
          time_start:res.data.time_start,
          content:res.data.coutent[0]
        })
        console.log(that.data)
      } else {
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

    if (this.data.step > 0) {
      return
    }

    setTimeout(function () {
      that.setData({
        login_text: '活动太火爆了，先让服务器喘口气，请稍后再试试~'
      })
      if(that.data.rules.length === 0){
        that.getActivityRules()
      }
    }, 3000)

    
    app.getCityId(function(){
      that.getActivityRules()
    })

    app.getOpenId()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage:shareAppMessage
})
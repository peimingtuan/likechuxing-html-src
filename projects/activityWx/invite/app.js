//app.js
import myAjax from './js/myAjax.js'
import getApiUrl from './js/getApiUrl.js'

const LOCAL_DATA_KEY = 'LIKE_ACT_20180601'

App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    /*
    // 登录
    wx.login({
      success: res => {
        this.globalData.code = res.code
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    */
  },

  getOpenId:function(cb){
    if(this.globalData.open_id!== ''){
      cb(this.globalData.open_id)
    }else{
      let that = this
      wx.login({
        success: res => {
          myAjax.post(getApiUrl('/wx-js/open-id'), {
            from: 2,
            miniprogram_id: 1,// 立刻出行广州小程序账号
            miniprogram_code: res.code
          }, function (res) {
            if (res.status === 0) {
              that.saveData({
                open_id: res.data.open_id
              }, function () {
                typeof cb === 'function' && cb(res.data.open_id)
              })
            } else {
              wx.showToast({
                title: res.msg,
                icon: 'none'
              })
            }
          })
        }
      })
    }
  
  },

  getCityId:function(cb){
    let that = this
    wx.getLocation({
      type:'gcj02',
      success:function(res){
        console.log(res)
        myAjax.post(getApiUrl('/describe/get-cityid'),{
          user_lat: res.latitude,
          user_lng: res.longitude
        },function(res2){
          if(res2.status === 0){
            that.saveData({
              lat: res.latitude,
              lng: res.longitude,
              city_id:res2.data.city_id
            })
            typeof cb === 'function' && cb()
          }else{
            wx.showToast({
              title: res.msg,
              icon: 'none'
            })
          }
        })
      }
    })
  },

  saveData:function(data,cb){
    for (let key in data) {
      if (data[key]) {
        this.globalData[key] = data[key]
      }
    }

    wx.setStorage({
      key: LOCAL_DATA_KEY,
      data:this.globalData,
      success:typeof cb === 'function'?cb:function(){}
    })
  },

  getData:function(){
    let localData = wx.getStorageSync(LOCAL_DATA_KEY)
    if(typeof localData === 'object'){
      for (let key in localData) {
        if (localData[key]) {
          this.globalData[key] = localData[key]
        }
      }
      return this.globalData
    }else{
      return false
    }
  },

  clearData:function(){
    wx.clearStorage()
    wx.showToast({
      title: '微信端数据清除成功',
    })
  },

  globalData: {
    uuid:"",
    sign:"",

    code:"",
    lat:"",
    lng:"",
    city_id:"0",
    open_id:'',
    cel:'',
    step:0
  }
})
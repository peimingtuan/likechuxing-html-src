// pages/user/license.js
import getApiUrl from '../../js/getApiUrl.js'
import myAjax from '../../js/myAjax.js'
import imgData from '../../js/imgData.js'
const app = getApp()
import shareAppMessage from '../../js/shareAppMessage.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    uuid:'',
    sign:'',
    list: [
      {
        id:1,
        photo_default: imgData.license_1,
        photo_src: '',
        desc: ['驾驶证', '（正副本拍一起）']
      },
      {
        id:2,
        photo_default: imgData.license_2,
        photo_src: '',
        desc: ['身份证', '（正面照）']
      },
      {
        id:3,
        photo_default: imgData.license_3,
        photo_src: '',
        desc: ['手持身份证', '（不能挡脸）']
      },
    ],
    couldSubmit:false,
    alreadySubmit:false
  },

  takeSubmit:function(){
    if(!this.data.couldSubmit || this.data.alreadySubmit){
      return
    }

    this.setData({
      alreadySubmit:true
    })

    wx.showLoading({
      title: '上传中...',
      mask:true
    })
    this.upload(1)
    let that = this
  },

  upload:function(id){
    let that = this
    wx.uploadFile({
      url: getApiUrl('/license/submit'),
      filePath: this.data.list[id-1].photo_src,
      name: 'file' + id,
      formData: myAjax.getFullData({
        uuid: app.globalData.uuid,
        sign: app.globalData.sign,
        from: 4
      }),
      success: function (res2) {
        let like_res = JSON.parse(res2.data)
        if (like_res.status === 0) {
          if(id<3){
            that.upload(id+1)
          }else{
            that.uploadFinish()
          }
        
        } else {
          wx.hideLoading()
          wx.showToast({
            title: like_res.msg,
            icon: 'none'
          })
        }
      }
    })
  },

  uploadFinish:function(){
    wx.hideLoading()
    wx.showToast({
      title: '上传成功！',
    })
    app.saveData({
      step:4
    })
    setTimeout(function(){
      wx.redirectTo({
        url: '/pages/user/licenseInfo',
      })
    },1500)
  },

  chooseImage:function(e){
    let photo_id = e.target.dataset.id
    let that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {

        let _list = that.data.list
        _list[photo_id - 1].photo_src = res.tempFilePaths[0]
        that.setData({
          list: _list,
          couldSubmit: _list.every(item => item.photo_src !== '')
        })
      }
    })
  },

  onShareAppMessage: shareAppMessage,

  getLicenseStatus() {
    let that = this
    myAjax.post(getApiUrl('/user/information'), {
      uuid: app.globalData.uuid,
      sign: app.globalData.sign,
      auth: 0
    }, function (res) {
      if (res.status === 0) {
        if(Number(res.data.license.status)!==3 ){
          app.saveData({
            step:4
          })
          wx.redirectTo({
            url: '/pages/user/licenseInfo',
          })
        }
      } 
    })
  },

  updateUuid() {
    let that = this
    myAjax.post(getApiUrl('/activity/has-attend'), {
      open_id: app.globalData.open_id,
      openid_type: 2,
      activity_id: 1
    }, function (res) {
      if (res.status === 0) {
        if (res.data.uuid !== '') {
          app.saveData({
            uuid: res.data.uuid,
            sign: res.data.sign
          }, function () {
            that.getLicenseStatus()
          })
        }
      } 
    })
  },

  onLoad:function(){
    //this.updateUuid()
  }
})
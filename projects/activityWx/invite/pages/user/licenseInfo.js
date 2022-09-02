// pages/user/licenseInfo.js
import getApiUrl from '../../js/getApiUrl.js'
import myAjax from '../../js/myAjax.js'
import imgData from '../../js/imgData.js'
import env from '../../js/env.js'
import shareAppMessage from '../../js/shareAppMessage.js'
const app = getApp()

const STATUS = [
  {
    icon: imgData.license_status_0,
    title: '您为已认证用户',
    msg: '无法参与该活动'
  },
  {
    icon: imgData.license_status_1,
    title: '信息审核中',
    msg: '请耐心等待'
  },
  {
    icon: imgData.license_status_2,
    title: '认证未通过审核',
    msg: '请下载App查看未通过原因'
  }
]

Page({

  /**
   * 页面的初始数据
   */
  data: {
    icon: '',
    title:'请稍候...',
    msg:'正在努力查询认证结果'
  },

  getLicenseStatus(){
    let that = this
    let localData = app.getData()
    myAjax.post(getApiUrl('/user/information'), {
      uuid: localData.uuid,
      sign: localData.sign,
      auth: 0
    }, function (res) {
      if (res.status === 0) {
        app.saveData({
          step:4
        })
        that.setData(STATUS[res.data.license.status])
      }
    })
  },

  onShow: function () {
    if(this.options.hasOwnProperty('status')){
      this.setData(STATUS[this.options.status])
    }else{
      this.getLicenseStatus()
    }
    
  },

  clear:function(){
    if(env === 'dev'){
      app.clearData()
    }
  },

  onShareAppMessage: shareAppMessage
})
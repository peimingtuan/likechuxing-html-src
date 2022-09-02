/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/11/14-5:10 PM
 Description:
 Param:
 Return:
 *************************************************/
import appArguments from '../../../../other_modules/app-arguments'
import myAjax from '../../../../other_modules/like-request/withAxiosV2'
import {getApiUrl} from '../../../../other_modules/url-constructor'
import {getRealActivityId} from "../../../../other_modules/like-function/util_like";

class WxShare {
  constructor(share) {
    this.defaultShare = {
      title: '立刻出行', // 分享标题
      desc: '喜欢你就，立刻出发', // 分享描述
      link: 'http://h5test.likechuxing.com', // 分享链接
      imgUrl: 'https://h5test.likechuxing.com/images/activity_spread/logo.png', // 分享图标
      type: 'link', // 分享类型,music、video或link，不填默认为link
      dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
      success: function () {
      },
      cancel: function () {
      }
    }
    this.wx = window.wx

    this.wx.ready(function () {
      this.shareTimeLine.call(this, share)
      this.shareAppMessage.call(this, share)
    }.bind(this))

    this.setConfig(config)
  }

  setConfig(sign) {
    this.wx.config({
      debug: false,
      appId: sign.appId,
      timestamp: sign.timestamp,
      nonceStr: sign.nonceStr,
      signature: sign.signature,
      jsApiList: [
        'checkJsApi',
        'onMenuShareTimeline',
        'onMenuShareAppMessage'
      ]
    })
  }

  shareTimeLine(share) {
    let shareOptions = Object.assign({}, this.defaultShare, share)
    this.wx.onMenuShareTimeline(shareOptions)
  }

  shareAppMessage(share) {
    let shareOptions = Object.assign({}, this.defaultShare, share)
    this.wx.onMenuShareAppMessage(shareOptions)
  }
}

let config = {}

const getTitle = function(){
  return myAjax.post(getApiUrl('/share/get-describe'),{
    type:1,
    activity_id:getRealActivityId(appArguments.id)
  }).then(res=>{
    config.share_title = res.data.title
    config.share_desc = res.data.des
    config.share_url = res.data.share_url
    config.share_icon = res.data.logo

    config.img_url = res.data.img_url
  })
}

const getSign = function(){
  return myAjax.post('https://api.likechuxing.com/wx-js/sign-package', {
    url: window.location.href.split('#')[0]
  }).then(res=>{
    config.appId = res.data.appId
    config.timestamp = res.data.timestamp
    config.nonceStr = res.data.nonceStr
    config.signature = res.data.signature
  })
}

Promise.all([getTitle(),getSign()]).then(()=>{
  let img = document.createElement('img')
  img.src = config.img_url
  document.querySelector('.like_activity_img').appendChild(img)

  new WxShare({
    title: config.share_title, // 分享标题
    desc: config.share_desc, // 分享描述
    link: config.share_url, // 分享链接
    imgUrl: config.share_icon, // 分享图标
    type: 'link', // 分享类型,music、video或link，不填默认为link
    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
    success: function () {},
    cancel: function () {}
  })
})

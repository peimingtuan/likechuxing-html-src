/**
 * Created by garvey on 2017/9/20.
 */
import getApiUrl from '../getApiUrl'
import myAjax from '../../component/myAjax/'

require('../polyfills')

export default class WxShare {
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
    if (!this.wx) {
      console.warn('未检测到window.wx')
      return
    }
    this.wx.ready(function () {
      this.shareTimeLine.call(this, share)
      this.shareAppMessage.call(this, share)
    }.bind(this))

    myAjax.post(getApiUrl('/wx-js/sign-package'), {
      url: window.location.href.split('#')[0]
    }, function (data) {
      if (data.status === 0) {
        this.ready = true
        this.setConfig(data.data)
      } else {
        console.warn('/wx-js/sign-package返回失败，详情见下行：')
        console.log(data)
      }
    }.bind(this))
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
        'onMenuShareAppMessage',
        'chooseImage',
        'getLocalImgData',
        'uploadImage'
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




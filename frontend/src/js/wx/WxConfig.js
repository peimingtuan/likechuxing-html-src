/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: WxConfig
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2017/12/8-下午2:20
 Description:
 Param:
 Return:
 *************************************************/
import getApiUrl from '../getApiUrl'
import myAjax from '../../component/myAjax'
require('../polyfills')

export default class WxConfig {
    constructor (opt) {
        this.wx = window.wx
        this.sign = null

        if (!this.wx) {
            console.warn('未检测到window.wx')
            return
        }

        myAjax.post(getApiUrl('/wx-js/sign-package'), {
            url: window.location.href.split('#')[0],
            uuid: opt.uuid,
            sign: opt.sign
        }, function (data) {
            if (data.status === 0) {
                this.sign = data.data
                this.setConfig()
            } else {
                console.warn('/wx-js/sign-package返回失败，详情见下行：')
                console.log(data)
            }
        }.bind(this))
    }

    setConfig () {
        if (!this.sign) {
            console.warn('wx.config失败，原因:未检测到sign参数')
        }
        this.wx.config({
            debug: false,
            appId: this.sign.appId,
            timestamp: this.sign.timestamp,
            nonceStr: this.sign.nonceStr,
            signature: this.sign.signature,
            jsApiList: [
                'checkJsApi',
                'chooseImage',
                'uploadImage',
                'getLocation',
                'getLocalImgData',
                'chooseWXPay',
                'onMenuShareTimeline',
                'onMenuShareAppMessage'
            ]
        })
    }
}


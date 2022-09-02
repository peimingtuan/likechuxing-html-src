/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: withJq
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2017/12/18-下午4:48
 Description:
 Param:
 Return:
 *************************************************/
/**
 * Created by garvey on 2017/9/11.
 */
import $ from 'jquery'
import getVerification from '../../../../js/getVerification'
import getApiUrl from '../../../../js/getApiUrl'
import {Alert} from "../component/LikeAlert";
import AppMutual from '../../../../component/AppMutual'

const appMutual = new AppMutual()
require('../../../../js/polyfills')

class Ajax {
  constructor() {
    this.time_offset = null
    this.server_time = 0
    this.list = []

    $.get(getApiUrl('/time/get'), function (res) {
      let now = Math.floor(new Date().getTime() / 1000)
      this.server_time = JSON.parse(res).data.timestamp
      this.time_offset = JSON.parse(res).data.timestamp - now
      this.list.forEach(item => {
        this.postNow(...item)
      })
      this.list.length = 0
    }.bind(this))
  }

  post(url, data, cb) {
    if (this.time_offset === null) {
      this.list.push([url, data, cb])
    } else {
      this.postNow(url, data, cb)
    }
  }

  postNow(url, _data, cb) {
    let data = Object.assign({}, _data)
    if (data.hasOwnProperty('user_channel')) {
      data.channel = data.user_channel || ''
      delete data.user_channel
    }
    data.user_version = 'h5_1000'
    data.activity_id = 8
    data.client_time = Math.floor(new Date().getTime() / 1000) + (this.time_offset || 0)
    data.verification = getVerification(data)
    $.post(url, data, function (res) {
      if (res.status === 6001) {
        if(sessionStorage.getItem('inLikeApp') === 'true'){
          new Alert({
            title: '请前往个人中心登录',
            confirmButtonCallback: function () {
              appMutual.jumpIndexAndCloseThisWebview()
            }
          })
        }else{
          new Alert({
            title: '登录信息已过期，请重新登录',
            confirmButtonCallback: function () {
              window.location.href = '/activity/millionGift_cs/share.html?channel=millionGiftCsWxShare'
            }
          })
        }
      }else{
        cb(res)
      }
    })
  }

  formPost(url, data) {
    // 增加登录信息
    let _data = Object.assign(data, {
      user_version: 'h5_1000',
      channel: 'h5',
      user_sys_version: window.navigator.userAgent,
      device_name: window.navigator.userAgent
    })
    // 增加本地时间
    _data.client_time = Math.floor(new Date().getTime() / 1000) + (this.time_offset || 0)
    // 签名
    _data.verification = getVerification(_data)
    // 生成表单
    let temp = document.createElement('form')
    temp.action = url
    temp.method = 'post'
    temp.style.display = 'none'
    for (let x in _data) {
      let opt = document.createElement('textarea')
      opt.name = x
      opt.value = data[x]
      temp.appendChild(opt)
    }
    document.body.appendChild(temp)
    temp.submit()
  }
}

export default new Ajax()
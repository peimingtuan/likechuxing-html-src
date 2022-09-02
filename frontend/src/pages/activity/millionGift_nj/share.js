/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/12-下午12:04
 Description:
 Param:
 Return:
 *************************************************/
require('./css/share.less')
require('./js/common')
import $ from 'jquery'

const whiteBox = require('./template/whiteBox2.pug')
import footerText from './template/footer/footer'
import {IsIos} from "../../../js/UserAgent";
import downloadUrl from '../../../component/downloadUrl'
import parseURL from '../../../js/parseURL'

const query = parseURL(window.location.href).query
import wxShare from './js/thisWxShare'

wxShare()
import Login from '../../../component/login'
import myAjax from './js/myAjax'
import getApiUrl from '../../../js/getApiUrl'
import {Alert, Toast} from "./component/LikeAlert/index";

if (query.hasOwnProperty('channel')) {
  let page = '/share/' + query.channel
  window._czc.push(["_trackPageview", page])
} else {
  window._czc.push(["_trackPageview", '/share/wxshare'])
}

let upper = `<p class="title fs17">请登录查看您的可提现金额</p>
<div class="login">
    <input id="phone" class="fs14" type="text" maxlength="11" placeholder="请输入手机号">
    <input id="code" class="fs14" type="text" maxlength="4" placeholder="请输入验证码">
    <button id="getCode" class="fs12">获取验证码</button>
</div>
<div class="btn_con upper">
    <button class="main_color_btn fs17" id="verify">点击登录</button>
</div>`

$('.header').after(whiteBox({
  upper
}))
footerText('立刻出行24小时客服电话：4006662333')
let login = new Login({
  phone: document.querySelector('#phone'),
  getCodeBtn: document.querySelector('#getCode'),
  code: document.querySelector('#code'),
  verifyBtn: document.querySelector('#verify'),
  getCode: function (phone, cb) {
    // send ajax request to get verifyCode,execute cb() when succeed
    myAjax.post(getApiUrl('/login/get-code'), {
      phone: phone
    }, function (res) {
      if (res.status == 0) {
        new Toast('发送成功')
        cb()
      } else {
        $('#getCode').removeClass('disabled')
        new Toast(res.msg)
      }
    })
  },
  verify: function (data) {
    data.channel =  query.hasOwnProperty('channel') ? query.channel : '74_millionGiftWxShare'
    myAjax.post(getApiUrl('/web/verify-code'), data, function (res) {
      if (res.status === 0) {
        //login.init()
        $('#getCode').addClass('disabled')
        window.location.href = 'index.html?uuid='+res.data.uuid+'&sign='+res.data.sign
      } else {
        new Toast(res.msg)
      }
    })
  }
})

$('#toDownload').click(function(){
  if (IsIos()) {
    window.location.href = downloadUrl.appleStore
  } else {
    window.location.href = downloadUrl.yingyongbao
  }
})

$('#toDetail').click(function () {
  window.location.href = 'explain.html'
})

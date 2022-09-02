/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey
 Version: 1.0.0
 Date: 2017/11/14-下午6:59
 Description:
 Demo:
 Others:
 *************************************************/

require('./css/index.less')

import Login from '../../../component/login'
import getActivityapiUrl from '../../../js/getActivityapiUrl'
import myAjax from '../../../component/myAjax'
import toast from '../../../component/toast'
import Format from '../../../js/function/format'
import parseURL from '../../../js/parseURL'
import $ from 'jquery'
import downloadBar from './component/downloadFooter'
import footer from './component/footer'
import downloadUrl from '../../../component/downloadUrl'
import {IsIos} from "../../../js/UserAgent";
import Umeng from '../../../component/umeng'
new Umeng(1273055684)

const default_box = require('./template/citys/default.pug')
const gz_box = require('./template/citys/guangzhou.pug')
const cd_box = require('./template/citys/chengdu.pug')
const wh_box = require('./template/citys/wuhan.pug')
const nj_box = require('./template/citys/nanjing.pug')
const cs_box = require('./template/citys/changsha.pug')

const query = parseURL(window.location.search).query
const channel = query.hasOwnProperty('channel') ? query.channel : '';

// 300元活动分渠道跳转--------------------start
const NEED_REDIRECT_LIST = [
  '169_1008',
  '169_1010',
  '202_1007',
  '202_1008',
  '202_1009',
  '202_1010',
  '202_1011',
  '202_1012',
  '202_1013',
  '202_1014',
  '202_1015',
  '202_1016'
]

if (NEED_REDIRECT_LIST.indexOf(channel) > -1) {
  window.location.replace('https://activity.likechuxing.com/activity/present/share.html?channel='+channel)
}
// 300元活动分渠道跳转--------------------end

(function loadHtml() {
  let box = default_box
  if (/(chengdu|235_)/.test(channel)) box = cd_box;
  if (/(guangzhou|foshan|197_|202_)/.test(channel)) box = gz_box;
  if (/(wuhan|169_)/.test(channel)) box = wh_box;
  if (/(changsha|183_)/.test(channel)) box = cs_box;
  if (/(nanjing|74_)/.test(channel)) box = nj_box

  $("body").append(
    downloadBar
  ).append(
    box()
  ).append(
    footer()
  )
})();
(function bindAction() {
  $('#download').on('click', function () {
    let phone_type = IsIos() ? 'ios' : 'android'
    window._czc.push(["_trackEvent", 'download', channel, phone_type]);
    if (phone_type === 'ios') {
      window.location.href = downloadUrl.appleStore
    } else {
      window.location.href = downloadUrl.yingyongbao
    }
  })
  $('#phone').on('input', function () {
    if ($(this).val().length === 11) {
      $('#getCode').removeClass('disabled')
    } else {
      $('#getCode').addClass('disabled')
    }
  })
  $('#code').on('input', function () {
    if ($(this).val().length === 4) {
      $('#verify').removeClass('disabled')
    } else {
      $('#verify').addClass('disabled')
    }
  })
  let login = new Login({
    phone: document.querySelector('#phone'),
    getCodeBtn: document.querySelector('#getCode'),
    code: document.querySelector('#code'),
    verifyBtn: document.querySelector('#verify'),
    getCode: function (phone, cb) {
      // send ajax request to get verifyCode,execute cb() when succeed
      myAjax.post(getActivityapiUrl('/login/get-code'), {
        phone: phone
      }, function (res) {
        if (res.status === 0) {
          toast('发送成功')
          cb()
        } else {
          $('#getCode').removeClass('disabled')
          toast(res.msg)
        }
      })
    },
    verify: function (data) {
      data.channel = query.hasOwnProperty('channel') ? query.channel : 'novemberAct'
      myAjax.post(getActivityapiUrl('/web/verify-code'), data, function (res) {
        if (res.status === 0) {
          login.init()
          $('#getCode').addClass('disabled')
          $('#verify').addClass('disabled')
          window.location.href = 'coupons.html?' + Format.map2url({
            uuid: res.data.uuid,
            sign: res.data.sign
          })
        } else {
          toast(res.msg)
        }
      })
    }
  })
})();



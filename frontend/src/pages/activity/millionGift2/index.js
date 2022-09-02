/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/14-上午10:35
 Description:
 Param:
 Return:
 *************************************************/

require('./css/index.less')
require('./js/common')
import $ from 'jquery'
import DownloadUrl from '../../../component/downloadUrl'
const whiteBox = require('./template/whiteBox.pug')
const moneyBox = require('./template/moneyBox.pug')
const activityExplain = require('./template/explain.pug')
import footerText from './template/footer/footer'
import myAjax from './js/myAjax'
import getApiUrl from '../../../js/getApiUrl'
import {Alert, Toast} from "./component/LikeAlert/index";
import AppMutual from '../../../component/AppMutual'
import {IsIos, IsWeiXin} from "../../../js/UserAgent";

const appMutual = new AppMutual()
import format from '../../../js/function/format'
import parseURL from '../../../js/parseURL'
import wxShare from './js/thisWxShare'
if(IsWeiXin()){
  wxShare()
}
import Loading from '../../../component/loading'
import MillionGiftData from './js/MillionGiftData'
let millionGiftData = new MillionGiftData();
sessionStorage.setItem('inLikeApp', millionGiftData.isInApp())
console.log(millionGiftData.isInApp())
let user = millionGiftData.getUser()
if(user){
  init()
}

function init(){
  let loading = new Loading()
  let user = millionGiftData.getUser()
  myAjax.post(getApiUrl('/cash/info'), {
    uuid: user.uuid,
    sign: user.sign,
    transfer_type: IsWeiXin() ? '3':'1'
  }, function (res) {
    loading.destroy()
    if (res.status === 0) {
      millionGiftData.save({
        money: res.data.money,
        transfer_type: res.data.transfer_type,
        last_realname: res.data.realname || false,
        last_account: res.data.account || false,
        last_bankCode: res.data.bank_code || false
      })
      loadBox(res.data)
    } else if (res.status === 6001) {
      new Alert({
        title: '请前往个人中心登录',
        confirmButtonCallback: function () {
          appMutual.jumpIndexAndCloseThisWebview()
        }
      })
    } else {
      new Alert({
        title: res.msg+'\n请重试',
        confirmButtonCallback: function () {
          appMutual.jumpIndexAndCloseThisWebview()
        }
      })
    }
  })
}

function loadBox(data) {
  let money = data.money === 0 ? '0' : format.money(data.money)
  $('.box').append(whiteBox({
    upper: moneyBox({
      money: money
    })
  }))
  const cash = $('#cash')
  if (Number(money) === 0) {
    cash.addClass('disabled')
  } else {
    cash.click(function () {
      if(millionGiftData.isWxPayTransferType() || millionGiftData.hasLastAccount()){
        window.location.href = 'confirmAccount.html'
      }else{
        window.location.href = 'editAccount.html'
      }
    })
  }
  let details = $('.details')
  let query = parseURL(window.location.href).query
  if(!query.user_version){
    details.append('<button class="download_btn fs15">下载「立刻出行」APP</button>')
  }
  details.append(activityExplain())
  footerText()

  $('.download_btn').click(function(){
    if(IsIos()){
      window.location.href = DownloadUrl.appleStore
    }else{
      window.location.href = DownloadUrl.yingyongbao
    }
  })

  $('#toHistory').click(function () {
    window.location.href = 'history.html'
  })
}


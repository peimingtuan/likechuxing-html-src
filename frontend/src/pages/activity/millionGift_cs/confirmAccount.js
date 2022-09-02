import API from "../../../../../projects/order/src/common/apiAddress";

/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: confirmAccount
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/14-下午1:57
 Description:
 Param:
 Return:
 *************************************************/
require('./css/confirmAccount.less')
require('./js/common')
import $ from 'jquery'
import getEnv from '../../../js/env'
import parseURL from '../../../js/parseURL'
const whiteBox = require('./template/whiteBox.pug')
import footerText from './template/footer/footer'
import format from '../../../js/function/format'
import myAjax from './js/myAjax'
import getApiUrl from '../../../js/getApiUrl'
import {Alert, Toast} from "./component/LikeAlert/index";
import Loading from '../../../component/loading'
import Desensitized from '../../../js/function/Desensitized'
import MillionGiftData from './js/MillionGiftData'
import {IsWeiXin} from "../../../js/UserAgent";

let millionGiftData = new MillionGiftData();
let user = millionGiftData.getUser()
const BANK_LIST = require('./js/data/wxBankList')

let money = millionGiftData.state.money
let account = millionGiftData.state.account || millionGiftData.state.last_account, account_mask = ''
let realname = millionGiftData.state.realname || millionGiftData.state.last_realname, realname_mask = ''

if (account.length > 1) {
  if (/@/.test(account)) {
    account_mask = Desensitized.email(account)
  } else if (/^\d{15,16}$/.test(account)) {
    account_mask = Desensitized.bankAccount(account)

  } else {
    account_mask = Desensitized.mobilePhone(account)
  }
}
if (realname.length > 0) {
  realname_mask = Desensitized.chineseName2(realname)
}
let upper = `<div class="cashBox">
    <p class="tips fs14">本次可提取</p>
    <p class="fs14 money"><span class="fs42">${format.money(money)}</span>元</p>
    <p class="fs14 account">姓名：${realname_mask}
        <button class="edit_btn fs12">编辑</button>
    </p>
    <p class="fs14 account">提现支付宝：${account_mask}</p>
</div>`

if(millionGiftData.isWxPayTransferType()){
  /*let bankCode = millionGiftData.state.bankCode || millionGiftData.state.last_bankCode,bank = BANK_LIST.find(item=>String(item.id) === bankCode),bankName=''
  if(bank){
    bankName = bank.name
  }else{
    new Toast('开户行代码不合法')
  }*/

  upper = `<div class="cashBox">
    <p class="tips fs14">您账户中的</p>
    <p class="fs14 money"><span class="fs42">${format.money(money)}</span>元</p>
    <p class="tips fs14">即将提取至微信余额</p>
</div>`
}

$('.cash').append(whiteBox({
  upper: upper + '<div class="btn_con"><button id="transfer" class="main_color_btn fs16">确认提取</button></div>'
}))
if (!millionGiftData.state.account) {
  $('.edit_btn').remove()
} else {
  $('.edit_btn').click(function () {
    window.location.href = 'editAccount.html'
  })
}

$('#transfer').click(function () {
  let loading = new Loading()
  let data = {
    uuid: user.uuid,
    sign: user.sign
  }
  if(millionGiftData.state.transfer_type === '3'){
    if(millionGiftData.state.account){
      sendOpenid(millionGiftData.state.account)
    }else{
      let host = getEnv() === 'production' ? 'https://activity.likechuxing.com' : 'https://h5test.likechuxing.com'
      data.cb_url= host+'/activity/millionGift_cs/getOpenId.php'
      myAjax.formPost(getApiUrl('wx-js/open-id'), data)
    }
  }else{
    data.realname = realname
    data.account = account
    data.transfer_type = millionGiftData.state.transfer_type
    if(!millionGiftData.isAliPayTransferType()){
      data.bank_code = millionGiftData.state.bankCode
    }
    myAjax.post(getApiUrl('cash/transfer'), data, function (res) {
      loading.destroy()
      if (res.status === 0) {
        new Alert({
          title:'提现成功，点击确定返回首页',
          confirmButtonCallback:function(){
            window.location.href = 'index.html?uuid='+millionGiftData.state.uuid+'&sign='+millionGiftData.state.sign+'&user_version=ios_2013'
          }
        })
      } else {
        new Toast(res.msg)
      }
    })
  }
})

footerText()

let query = parseURL(window.location.href).query
if(query.hasOwnProperty('open_id')){
  sendOpenid(query.open_id)
}

function sendOpenid(open_id){
  let loading = new Loading()
  let data = {
    uuid: user.uuid,
    sign: user.sign,
    transfer_type: millionGiftData.state.transfer_type,
    open_id: open_id
  }
  myAjax.post(getApiUrl('cash/transfer'), data, function (res) {
    loading.destroy()
    if (res.status === 0) {
      new Alert({
        title:'提现成功，点击确定返回首页',
        confirmButtonCallback:function(){
          window.location.href = 'index.html?uuid='+millionGiftData.state.uuid+'&sign='+millionGiftData.state.sign+'&user_version=ios_2013'
        }
      })
    } else {
      new Toast(res.msg)
    }
  })
}
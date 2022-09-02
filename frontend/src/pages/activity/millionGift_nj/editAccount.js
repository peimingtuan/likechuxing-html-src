/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: editAccount
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/14-下午1:58
 Description:
 Param:
 Return:
 *************************************************/

require('./css/editAccount.less')
require('./js/common')
import $ from 'jquery'

const whiteBox = require('./template/whiteBox.pug')
import {Alert, Toast} from "./component/LikeAlert/index";
import footerText from './template/footer/footer'
import MillionGiftData from './js/MillionGiftData'

let millionGiftData = new MillionGiftData();
import {IsWeiXin} from "../../../js/UserAgent";

let upper_aliPay = `<div class="editBox fs14">
    <div class="tip">
        <p>* 支付宝账号的姓名</p>
        <p>需要与登录立刻出行账号的姓名一致</p>
    </div>
    <div class="input_con">
       <p class="fs14">请填写您的姓名</p>
       <input id="realname" class="fs14" type="text"/>
    </div>
    <div class="input_con">
       <p class="fs14">请填写您的支付宝账号</p>
       <input id="account" class="fs14" type="text" />
    </div>
    <div class="btn_con">
        <button class="main_color_btn fs16">下一步</button>
    </div>
</div>`

let upper_bank = `<div class="editBox">
    <div class="tip">
        <p>* 支付宝账号的姓名</p>
        <p>需要与登录立刻出行账号的姓名一致</p>
    </div>
    <div class="input_con">
       <p class="fs14">*请输入您开户人姓名</p>
       <input id="realname" class="fs14" type="text" />
    </div>
    <div class="input_con">
       <p class="fs14">*请输入您本人的银行账号用于收款</p>
       <input id="account" class="fs14" type="text"/>
    </div>
    
    <div class="input_con">
       <p class="fs14">*请选择开户总行</p>
       <select id="bankCode">
        <option value="0">请选择</option>` + require('./js/data/wxBankList').map(item => '<option value="' + item.id + '">' + item.name + '</option>') + `</select>
    </div>
    <div class="btn_con">
        <button class="main_color_btn fs16">下一步</button>
    </div>
</div>`

let upper = IsWeiXin() ? upper_bank : upper_aliPay
$('.edit').append(whiteBox({
  upper: upper
}))
footerText()
if (millionGiftData.isEditAgain()) {
  $('#account').val(millionGiftData.state.account)
  $('#realname').val(millionGiftData.state.realname)
  $('#bankCode').val(millionGiftData.state.bankCode)
}

$('.main_color_btn').click(function () {
  if(checkInput()){
    window.location.href = 'confirmAccount.html'
  }
})

function checkInput() {
  let account_val = $('#account').val().replace(/(^\s*)|(\s*$)/g, ""),
    realname_val = $('#realname').val().replace(/(^\s*)|(\s*$)/g, ""),
    bankCode = $('#bankCode').val()
  if (account_val === '') {
    new Toast('请输入账号')
    return false
  }
  if (realname_val === '') {
    new Toast('请输入姓名')
    return false
  }
  if(!millionGiftData.isAliPayTransferType()){
    if (bankCode === '0') {
      new Toast('请输入选择开户行')
      return false
    }
    if (!/^\d{15,16}$/.test(account_val)) {
      new Toast('请检查账号是否输入正确')
      return false
    }
  }

  millionGiftData.save({
    account: account_val,
    realname: realname_val,
    bankCode: bankCode
  })
  return true
}


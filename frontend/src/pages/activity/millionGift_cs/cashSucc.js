/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: cashSucc
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/14-下午1:59
 Description:
 Param:
 Return:
 *************************************************/
require('./css/cashSucc.less')
require('./js/common')
import $ from 'jquery'

const whiteBox = require('./template/whiteBox.pug')
import footerText from './template/footer/footer'
import format from '../../../js/function/format'
import Desensitized from '../../../js/function/Desensitized'
import MillionGiftData from './js/MillionGiftData'

let millionGiftData = new MillionGiftData();

let money = millionGiftData.state.money
let account = millionGiftData.state.account || millionGiftData.state.last_account, account_mask = ''

if (account.length > 1) {
  if (/@/.test(account)) {
    account_mask = Desensitized.email(account)
  } else if (/^\d{15,16}$/.test(account)) {
    account_mask = Desensitized.bankAccount(account)
  } else {
    account_mask = Desensitized.mobilePhone(account)
  }
}
let upper_alipay = `<div class="succBox">
    <div class="title red fs16">提交成功</div>
    <div class="text">
        <p>您在立刻出行赚的</p>
        <p class="money"><span class="red fs42">${format.money(money)}</span>元</p>
        <p class="account">已存入支付宝账号</p>
        <p class="account red fs16">${account_mask}</p>
        <p class="account">请注意查收</p>
        <p class="glad">开立刻出行，分百万现金！</p>
        <p class="count"><span id="count">5</span>秒后回到首页</p>
    </div>
</div>`
let upper_wxpay = `<div class="succBox">
    <div class="title red fs16">提交成功</div>
    <div class="text">
        <p>您在立刻出行赚的</p>
        <p class="money"><span class="red fs42">${format.money(money)}</span>元</p>
        <p class="account">已打入微信余额</p>
        <p class="account">请注意查收</p>
        <p class="glad">开立刻出行，分百万现金！</p>
        <p class="count"><span id="count">5</span>秒后回到首页</p>
    </div>
</div>`

let upper = millionGiftData.isAliPayTransferType() ? upper_alipay : upper_wxpay

$('.succ').append(whiteBox({
  upper: upper
}))
$('.code_con').addClass('white')
footerText()
count(5)
function count(num){
  if(num===0){
    window.location.href = 'index.html?uuid='+millionGiftData.state.uuid+'&sign='+millionGiftData.state.sign
  }else{
    $('#count').text(num)
    setTimeout(function(){
      count(--num)
    },1000)
  }
}
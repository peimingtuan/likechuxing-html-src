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
const code = require('./template/code.pug')
import footerText from './template/footer'
import format from '../../../js/function/format'
import Desensitized from '../../../js/function/Desensitized'

$('body').css("background",'url('+require('./images/bg.png')+') no-repeat top').css('background-size','100% auto')

let money = window.sessionStorage.getItem("money")
let account = window.sessionStorage.getItem("account"),account_mask = ''
if(account.length > 1 ){
    if(/@/.test(account)){
        account_mask = Desensitized.email(account)
    }else{
        account_mask = Desensitized.mobilePhone(account)
    }
}
let upper = `<div class="succBox">
    <div class="title red fs16">提交成功</div>
    <div class="text">
        <p>您在立刻出行赚的</p>
        <p class="money"><span class="red fs42">${format.money(money)}</span>元</p>
        <p class="account">已存入支付宝账号</p>
        <p class="account red fs16">${account_mask}</p>
        <p class="account">请注意查收</p>
        <p class="glad">开立刻出行，分百万现金！</p>
    </div>
</div>`

$('.succ').append(whiteBox({
    upper:upper
}))
$('.text').after(code())
$('.code_con').addClass('white')

footerText()
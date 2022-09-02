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
import footerText from './template/footer'

$('body').css("background",'url('+require('./images/bg.png')+') no-repeat top').css('background-size','100% auto')

let account = window.sessionStorage.getItem('account')
let realname = window.sessionStorage.getItem('realname')

let upper = `<div class="editBox">
    <div class="input_con">
       <p class="fs14">*请输入您本人的支付宝账号用于收款</p>
       <input id="account" class="fs14" type="text"/>
    </div>
    <div class="input_con">
       <p class="fs14">*请输入您支付宝账号中认证的姓名</p>
       <input id="realname" class="fs14" type="text" />
    </div>
    <p class="fs12">请确认您输入的姓名与立刻出行账号中的姓名一致，以保证奖金可以顺利汇入您的账户中</p>
    <div class="btn_con">
        <a class="main_color_btn">下一步</a>
    </div>
</div>`

$('.edit').append(whiteBox({
    upper:upper
}))
$('#account').val(account)
$('#realname').val(realname)


$('.main_color_btn').click(function(){
    let account_val = $('#account').val().replace(/(^\s*)|(\s*$)/g, ""),
        realname_val = $('#realname').val().replace(/(^\s*)|(\s*$)/g, "")
    if(account_val == ''){
        new Toast('请输入支付宝账号')
        return
    }
    if(realname_val == ''){
        new Toast('请输入姓名')
        return
    }
    window.sessionStorage.setItem("account",account_val)
    window.sessionStorage.setItem("realname",realname_val)
    window.sessionStorage.setItem('edit', 1)
    window.location.href = 'confirmAccount.html'
})

footerText()
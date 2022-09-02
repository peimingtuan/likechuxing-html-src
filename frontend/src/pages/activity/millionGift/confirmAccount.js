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
const whiteBox = require('./template/whiteBox.pug')
import footerText from './template/footer'
import format from '../../../js/function/format'
import myAjax from '../../../component/myAjax/withJq'
import getApiUrl from '../../../js/getApiUrl'
import {Alert, Toast} from "./component/LikeAlert/index";
import getUser from './js/getUser'
const user = getUser()
import Loading from '../../../component/loading'
import Desensitized from '../../../js/function/Desensitized'

$('body').css("background",'url('+require('./images/bg.png')+') no-repeat top').css('background-size','100% auto')

let money = window.sessionStorage.getItem("money")
let account = window.sessionStorage.getItem("account"),account_mask = ''
let realname = window.sessionStorage.getItem("realname"),realname_mask = ''
if(account.length > 1 ){
    if(/@/.test(account)){
        account_mask = Desensitized.email(account)
    }else{
        account_mask = Desensitized.mobilePhone(account)
    }
}
if(realname.length > 0){
    realname_mask = Desensitized.chineseName2(realname)
}
let upper = `<div class="cashBox">
    <p class="tips fs12">本次提现金额</p>
    <p class="fs12 money"><span class="fs42">${format.money(money)}</span>元</p>
    <p class="fs14 account">提现支付宝账号：${account_mask}</p>
    <p class="fs14 account">姓名：${realname_mask}
        <a class="edit_btn fs12">编辑</a>
    </p>
</div>`

$('.cash').append(whiteBox({
    upper:upper,
    nether:'<div class="btn_con"><a id="transfer" class="main_color_btn">立刻提现</a></div>'
}))
if(window.sessionStorage.getItem('edit') == 0){
    $('.edit_btn').remove()
}else{
    $('.edit_btn').click(function(){
        window.location.href = 'editAccount.html'
    })
}

$('#transfer').click(function(){
    let loading = new Loading()
    myAjax.post(getApiUrl('cash/transfer'), {
        uuid:user.uuid,
        sign:user.sign,
        realname,
        account
    }, function(res){
        loading.destroy()
        if(res.status === 0){
            window.location.href = 'cashSucc.html'
        }else{
            new Toast(res.msg)
        }
    })
})

footerText()
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
const whiteBox = require('./template/whiteBox.pug')
const moneyBox = require('./template/moneyBox.pug')
const activityExplain =require('./template/explain.pug')
const winner = require('./template/winner.pug')
const code = require('./template/code.pug')
import footerText from './template/footer'
import myAjax from '../../../component/myAjax/withJq'
import getApiUrl from '../../../js/getApiUrl'
import {Alert, Toast} from "./component/LikeAlert/index";
import AppMutual from '../../../component/AppMutual'
const appMutual = new AppMutual()
import format from '../../../js/function/format'
import getUser from './js/getUser'
const user = getUser()
import Loading from '../../../component/loading'

if(!user){
    new Alert({
        title: '请前往个人中心登录',
        confirmButtonCallback: function(){
            appMutual.jumpIndexAndCloseThisWebview()
        }
    })
}else{
    let loading = new Loading()
    myAjax.post(getApiUrl('/cash/info'), {
        uuid:user.uuid,
        sign:user.sign
    }, function(res){
        loading.destroy()
        if(res.status === 0){
            loadBox(res.data)
            window.sessionStorage.setItem('money', res.data.money)
            window.sessionStorage.setItem('realname', res.data.realname)
            window.sessionStorage.setItem('account', res.data.account)
            if(res.data.realname!='' && res.data.account!=''){
                window.sessionStorage.setItem('edit', 0)
            }else{
                window.sessionStorage.setItem('edit', 1)
            }
        }else if(res.status === 6001){
            new Alert({
                title: '请前往个人中心登录',
                confirmButtonCallback: function(){
                    appMutual.jumpIndexAndCloseThisWebview()
                }
            })
        }else{
            new Alert({
                title: res.msg,
                confirmButtonCallback: function(){
                    appMutual.jumpIndexAndCloseThisWebview()
                }
            })
        }
    })
}

function loadBox(data) {
    let money = data.money === 0 ? '0' : format.money(data.money)
    $('.box').append(whiteBox({
        upper:moneyBox({
            money:money,
            is_win: data.has_privilege
        }),
        nether:'<div class="link_con"><span id="toHistory" class="link fs14">提现记录</span><span id="toList" class="link fs14">百万英雄榜</span></div>'
    }))
    const cash = $('#cash')
    if(money == 0){
        $('.tip').show()
        cash.addClass('disabled')
    }else{
        cash.click(function(){
            if(data.realname){
                window.location.href = 'confirmAccount.html'
            }else{
                window.location.href = 'editAccount.html'
            }

        })
    }
    $('.gift_box').after(code())
    $('.details').append(activityExplain())
    footerText()

    $('.qa').click(function(){
        $('body').append(winner())
        $('.winner_con .mask,.winner_con .close').click(function(){
            $('.winner_con').remove()
        })
        $('.winner_con').on('touchmove', function(e){
            e.stopPropagation()
            e.preventDefault()
        })
    })

    $('#toList').click(function(){
        window.location.href = 'list.html'
    })

    $('#toHistory').click(function(){
        window.location.href = 'history.html?money='+data.money
    })


}


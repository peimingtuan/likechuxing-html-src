/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: history
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/14-下午1:54
 Description:
 Param:
 Return:
 *************************************************/
 require('./css/history.less')
require('./js/common')
import $ from 'jquery'
const whiteBox = require('./template/whiteBox.pug')
const moneyBox = require('./template/moneyBox.pug')
import footerText from './template/footer'
import myAjax from '../../../component/myAjax/withJq'
import getApiUrl from '../../../js/getApiUrl'
import {Alert, Toast} from "./component/LikeAlert/index";
import AppMutual from '../../../component/AppMutual'
const appMutual = new AppMutual()
import getUser from './js/getUser'
const user = getUser()
import parseUrl from '../../../js/parseURL'
import format from '../../../js/function/format'
const historyBox = require('./template/historyBox.pug')

$('body').css("background",'url('+require('./images/bg.png')+') no-repeat top').css('background-size','100% auto')

if(!user){
    new Alert({
        title: '登录信息已过期',
        confirmButtonCallback: appMutual.jumpIndexAndCloseThisWebview
    })
}else{
    myAjax.post(getApiUrl('cash/log'), {
        uuid:user.uuid,
        sign:user.sign
    }, function(res){
        if(res.status === 0){
            loadBox(res.data)
        }else if(res.status === 6001){
            new Alert({
                title: '登录信息已过期',
                confirmButtonCallback: appMutual.jumpIndexAndCloseThisWebview
            })
        }else{
            new Alert({
                title: res.msg,
                confirmButtonCallback: appMutual.jumpIndexAndCloseThisWebview
            })
        }
    })
}

function loadBox(data){
    let nether = `<div class="emptyHistory">
    <p class="fs13">快去开车，赚取更多的奖励吧！</p>
    <div class="key"></div>
</div>`

    if(data.length > 0){
        nether = historyBox({
            list:data.map(item=>{
                return {
                    time:format.time(item.time, 'YYYY.MM.DD HH:mm'),
                    remain:item.remain_value,
                    desc:item.type_des,
                    change: (item.sign_type === '0' ? '+' : '-')+" "+item.change_value,
                    sign_type: item.sign_type
                }
            })
        })
    }

    const query = parseUrl(window.location.href).query
    $('.history').append(whiteBox({
        upper:moneyBox({
            money:format.money(query.money),
            is_win: false
        }),
        nether
    }))

    let cash = $('#cash')
    if(query.money == 0){
        cash.addClass('disabled')
    }else{
        cash.click(function(){
            if(window.sessionStorage.getItem('realname')){
                window.location.href = 'confirmAccount.html'
            }else{
                window.location.href = 'editAccount.html'
            }
        })
    }

    footerText()
}






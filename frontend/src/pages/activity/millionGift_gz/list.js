/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: list
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/14-下午1:44
 Description:
 Param:
 Return:
 *************************************************/
 require('./css/list.less')
require('./js/common')
import $ from 'jquery'
const whiteBox = require('./template/whiteBox.pug')
import myAjax from '../../../component/myAjax/withJq'
import getApiUrl from '../../../js/getApiUrl'
import {Alert, Toast} from "./component/LikeAlert/index";
import AppMutual from '../../../component/AppMutual'
const appMutual = new AppMutual()
import footerText from './template/footer'
import getUser from './js/getUser'
const user = getUser()
import Loading from '../../../component/loading'

$('body').css("background",'url('+require('./images/bg.png')+') no-repeat top').css('background-size','100% auto')

if(!user){
    new Alert({
        title: '登录信息已过期',
        confirmButtonCallback: appMutual.jumpIndexAndCloseThisWebview
    })
}else{
    let queryData = {
        uuid:user.uuid,
        sign:user.sign,
        city_id:197,
        offset:0,
        limit:50
    }

    let loading = new Loading()
    myAjax.post(getApiUrl('cash/awards-list'), queryData, function(res){
        loading.destroy()
        if(res.status === 0 && res.data.length > 0){
            $('.list').append(res.data.map(item=>{
                return "<li class='item'>"+item.phone_no+"<span class='red'>获得"+item.change_value+"</span>现金奖励！"+"</li>"
            }).join(''))
            let top = 0
            let step = $('.item').height() + 1
            let height = $('.list').height()
            setInterval(function(){
                top-=step;
                $('.list').css('transform',"translateY("+top+"px)")
                if(top < -height){
                    setTimeout(function(){
                        $('.list').removeClass('animated')
                        top = 0
                        setTimeout(function(){
                            $('.list').css('transform',"translateY("+0+"px)")
                        },100)
                        setTimeout(function(){
                            $('.list').addClass('animated')
                        },300)
                    },400)
                }
            },1000)
        }else{
            $('.list').append(empty)
        }
    })
    $('.list_con').append(whiteBox({
        upper:"<ul class='list animated'></ul><ul class='list animated'></ul>"
    }))
    footerText()
}
let empty = '<li class="empty">尚无英雄上榜，快来占领高地</li>'

function loadBox(data){


}


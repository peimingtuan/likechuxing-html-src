/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: support
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/19-下午5:30
 Description:
 Param:
 Return:
 *************************************************/
require('./css/support.less')
require('./js/common')
import $ from 'jquery'
import myAjax from '../../../component/myAjax/withJq'
import getApiUrl from '../../../js/getActivityapiUrl'
import Unique from './js/Unique'
import {IsIos} from "../../../js/UserAgent";
import downloadUrl from '../../../component/downloadUrl'
import Desensitized from '../../../js/function/Desensitized'
import {Alert, Toast} from "./component/LikeAlert/index";
import whiteBox from './template/whiteBox.pug'
import wxShare from './js/thisWxShare2'

wxShare()

const unique = new Unique()
let local = unique.getLocal()
if (local) {
    let user = Desensitized.mobilePhone(local.phone)
    $('.user').text(user)
    let coupon_value = local.is_new ? '50' : '10'
    const upper = `<div class="upper_in fs12">
    <p id="msg">您已登录账号：<span class="red">${user}</span>，可领取优惠券：</p>
    <div class="coupon"><span class="value fs34">${coupon_value}</span></div>
    <button id="get" class="fs16">点击领取</button>
    <button id="download" class="fs16">下载APP</button>
    </div>`

    $('.banner').after(whiteBox({
        upper
    }))

    setCss()
    addTo(local.num)

    $('#close').click(function(){
        $('.Mask').hide()
    })

    $('#get').click(function () {
        window._czc.push(["_trackEvent",'button','getCode']);
        countDown()
        $('.Mask').show()
        myAjax.post(getApiUrl('/login/get-code'), {
            phone: local.phone
        }, function (res) {
            if (res.status === 0) {
                $('.Box').show()
            } else {
                new Toast(res.msg)
            }
        })
    })

    $('#getCode').click(function () {
        countDown()
        myAjax.post(getApiUrl('/login/get-code'), {
            phone: local.phone
        }, function (res) {
            if (res.status === 0) {
                new Toast('发送成功')
            } else {
                new Toast(res.msg)
            }
        })
    })

    $('#verify').click(function () {
        window._czc.push(["_trackEvent",'button','getCoupon']);
        let code = $('#code').val()
        if (/^\d{4}$/.test(code)) {
            myAjax.post(getApiUrl('/web/verify-code'), {
                channel: 'millionGift_coupon',
                phone: local.phone,
                code: code
            }, function (res) {
                if (res.status == 0) {
                    $('.Mask').hide()
                    $('#get').hide()
                    $('#download').show()
                    $('#msg').html('优惠券已放入您的账号<span class="user red"> '+user+' </span>中')
                } else {
                    new Toast(res.msg)
                }
            })
        } else {
            new Toast('验证码格式不正确')
        }

    })

    $('#download').click(function(){
        window._czc.push(["_trackEvent",'button','download']);
        if(IsIos()){
            window.location.href = downloadUrl.appleStore
        }else{
            window.location.href = downloadUrl.yingyongbao
        }
    })
}

function setCss() {
    let w_h = window.innerHeight
    let h = $('body').height()
    if (w_h > h) {
        $('.footer').css('margin-top', w_h - h)
    }
}

function addTo(num) {
    let step = Math.ceil(num / 50)
    if (step % 5 === 0) {
        step -= 2
    }
    if (step % 2 === 0) {
        step -= 1
    }
    let num_now = 0
    add()

    function add() {
        $('#num').text(num_now)
        num_now += step;
        if (num_now <= num) {
            setTimeout(add, 20)
        } else {
            $('#num').text(num)
        }
    }
}

function countDown(){
    $('#count').show()
    $('#getCode').hide()
    let num = 60
    change()
    function change(){
        $('#count').text(num + 's')
        num--;
        if(num<0){
            $('#count').hide()
            $('#getCode').show()
        }else{
            setTimeout(change,1000)
        }
    }

}




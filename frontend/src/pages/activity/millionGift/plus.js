/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: plus
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/19-下午3:57
 Description:
 Param:
 Return:
 *************************************************/
require('./css/plus.less')
require('./js/common')
import $ from 'jquery'
import Unique from './js/Unique'
import myAjax from '../../../component/myAjax/withJq'
import getApiUrl from '../../../js/getActivityapiUrl'
import {Alert, Toast} from "./component/LikeAlert/index";
import Regular from '../../../js/Regular'
import wxShare from './js/thisWxShare2'

wxShare()
import whiteBox from './template/whiteBox.pug'

const upper = `<div class="upper_in fs17">
    <p>每增加<span class="red fs22">1</span>万人支持</p>
    <p>分百万活动将延长<span class="red fs22">1</span>天！</p>
</div>`

const nether = `<div class="nether_in">
    <input type="text" class="fs16" maxlength="11" id="phone" placeholder="输入手机号立刻支持" />
    <button id="ding" class="fs16">我要延长活动</button>
</div>`

$('.banner').after(whiteBox({
    upper,
    nether
}))

setCss()

function setCss() {
    let w_h = window.innerHeight
    let h = $('body').height()
    if(w_h > h){
        $('.footer').css('margin-top',w_h-h)
    }
}

function addTo(num){
    let step = Math.ceil(num/50)
    if(step%5 === 0){
        step-=2
    }
    if(step%2 === 0){
        step-=1
    }
    let num_now = 0
    add()

    function add(){
        $('#num').text(num_now)
        num_now+=step;
        if(num_now<=num){
            setTimeout(add,20)
        }else{
            $('#num').text(num)
        }
    }
}

//请求总数
myAjax.post(getApiUrl('/cash-extension/info'), {}, function (res) {
    if (res.status === 0) {
        if (res.data.num) {
            $('#day').text(Math.floor(res.data.num / 10000))
            addTo(res.data.num % 10000)
        }
    } else {
        new Toast(res.msg)
    }
})

const unique = new Unique()

$('#ding').click(function () {
    new Alert({
        title: '本活动已结束',
        msg: '更多活动信息请到“立刻出行”APP中查看',
        confirmButtonText: '知道了'
    })
    return


    if (unique.checkLocal(myAjax.server_time)) {
        new Alert({
            title: '您今天已经支持过啦',
            msg: '每天只有一次机会，请明日再来',
            confirmButtonText: '知道了'
        })
        return
    }

    let phone = $('#phone').val()
    if (phone === '') {
        new Toast('请输入手机号')
        return
    }
    if (!Regular.phone.test(phone)) {
        new Toast('请输入11位中国大陆手机号')
        return
    }

    let uuid = unique.str
    if (unique.getLocal()) {
        uuid = unique.getLocal().str
    }

    window._czc.push(["_trackEvent",'button','support']);
    myAjax.post(getApiUrl('cash-extension/favorite'), {
        phone_no: phone,
        uuid: uuid
    }, function (res) {
        if (res.status === 0) {
            console.log(res)
            unique.saveLocal(myAjax.server_time, phone, res.data.num, res.data.is_new, uuid)
            window.location.href = 'support.html'
        } else {
            new Alert({
                title: '您今天已经支持过啦',
                msg: '每天只有一次机会，请明日再来',
                confirmButtonText: '知道了'
            })
        }
    })

})

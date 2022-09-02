/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index.js
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/11-下午6:23
 Description:
 Param:
 Return:
 *************************************************/
require('./css/index.css')
import $ from 'jquery'
require('../../../component/rem')
import toast from '../../../component/toast'
import myAjax from '../../../component/myAjax/withJq.js'
import getApiUrl from './js/getApiUrl'
import Loading from '../../../component/loading'
var loading = new Loading()//加载loading
//姓名验证
let reg_name = /^[\u4e00-\u9fa5]{2,8}$/;
//手机号验证
let tel = /^1[3456789]\d{9}$/;
var vCodeFlag = true;
var vCodeTimer = 60;

//获取验证码
function codeTimer() {
    if (vCodeTimer < 0) {
        $(".get-code").text("获取验证码");
        vCodeFlag = true;
        vCodeTimer = 60;
    } else {
        $(".get-code").text(vCodeTimer);
        vCodeTimer = vCodeTimer - 1;
        setTimeout(function () {
            codeTimer();
        }, 1000)
    }
}
//获取验证码
$(".get-code").on("click", function () {
    if (vCodeFlag) {
        if (!tel.test($("#phone").val())) {
            if ($("#phone").val() == '') {
                toast("请输入手机号")
            } else {
                toast("请输入正确的手机号")
                $("#phone").val('');
            }
            return false;
        }
        myAjax.post(getApiUrl('/activity/service/get-code'), {
            phone: $("#phone").val(),
            pro_id: $("#pro_id").val()
        }, function (data) {
            if (data.status == '0') {
                toast("发送成功");
                vCodeFlag = false;
                codeTimer();
            } else {
                toast(data.msg)
            }
        });
    }
});
//点击立刻登录
$(".dark_btn").on("click", function () {
    if (!tel.test($("#phone").val())) {
        if ($("#phone").val() == '') {
            toast("请输入手机号")
        } else {
            toast("请输入正确的手机号")
            $("#phone").val('');
        }
        return false;
    } else if ($(".vcode").val() == '') {
        toast("验证码不能为空");
        return false;
    }
    myAjax.post(getApiUrl('/activity/service/login'), {
        phone: $("#phone").val(),
        code: $(".vcode").val(),
        pro_id: $("#pro_id").val()
    }, function (data) {
        if (data.status == '0') {
            localStorage.setItem("uuid", data.data.uuid);//存储uuid
            localStorage.setItem("sign",data.data.sign);//存储sign
            localStorage.setItem("pro_id",data.data.pro_id);//存储pro_id
            localStorage.setItem("mobile",$("#phone").val().substring(5,11));//存储手机号的后六位
            window.location.href="./statistics.html";
        } else {
            toast(data.msg)
        }
    })
});
//中转页面
if(localStorage.getItem("uuid")){
    loading.destroy()//清除loading
    window.location.href="./statistics.html";
}else{
    loading.destroy()//清除loading
    $("body").removeClass("none");
}
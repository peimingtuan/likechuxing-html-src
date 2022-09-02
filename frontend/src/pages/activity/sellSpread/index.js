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
import getApiUrl from '../../../js/getApiUrl'
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
        if (!reg_name.test($(".name").val())) {
            if ($(".name").val() == '') {
                toast("请输入姓名");
            } else {
                toast("输入的姓名必须是2~8位的汉字");
                $(".name").val('');
            }
            return false;
        }
        if (!tel.test($("#phone").val())) {
            if ($("#phone").val() == '') {
                toast("请输入手机号")
            } else {
                toast("请输入正确的手机号")
                $("#phone").val('');
            }
            return false;
        }
        myAjax.post(getApiUrl('/activity-house/get-code'), {
            phone: $("#phone").val()
        }, function (data) {
            console.log(myAjax)
            if (data.status == '0') {
                toast("发送成功");
            } else {
                toast(data.msg)
            }
        })
        vCodeFlag = false;
        codeTimer();
    }
});
//点击立刻注册
$(".dark_btn").on("click", function () {
    if (reg_name.test($(".name").val()) == false) {
        if ($(".name").val() == '') {
            toast("请输入姓名");
        } else {
            toast("输入的姓名必须是2~8位的汉字");
            $(".name").val('');
        }
        return false;
    } else if (!tel.test($("#phone").val())) {
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
    myAjax.post(getApiUrl('/activity-house/login'), {
        name: $(".name").val(),
        phone: $("#phone").val(),
        code: $(".vcode").val()
    }, function (data) {
        if (data.status == '0') {
            localStorage.setItem("uuid", data.data.uuid);//存储uuid
            localStorage.setItem("sign",data.data.sign);//存储sign
            localStorage.setItem("mobile",$("#phone").val().substring(5,11));//存储手机号的后六位
            window.location.href="./enteringinfo.html";
        } else {
            toast(data.msg)
        }
    })
});
//中转页面
if(localStorage.getItem("uuid")){
    loading.destroy()//清除loading
    window.location.href="./enteringinfo.html";
}else{
    loading.destroy()//清除loading
    $("body").removeClass("none");
}
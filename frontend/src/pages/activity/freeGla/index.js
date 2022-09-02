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
import getAppArguments from '../../../js/getAppArguments'
import getApiUrl from '../../../js/getApiUrl'
import AppMutual from '../../../component/AppMutual'
import wxShare from './js/thisWxShare'
wxShare()
const appMutual = new AppMutual()
//初始化加载图片
$(".enter-success img").attr("src", require("./images/infosuccess.png"));
$(".info-left img").attr("src", require("./images/wx.png"));
$(".info-right img").attr("src", require("./images/pyq.png"));
let argument = window.location.href;
if(argument.indexOf("user_version") > 0){
    console.log(argument)
}else{
    $(".info_btn").remove();
    $(".enter-success").css("height","1.6rem");
}
//活动基本信息接口
myAjax.post(getApiUrl('/activity/attend-info'), {

}, function (data) {
    if (data.status == '0') {
        if(myAjax.server_time>data.data.end_time){
            toast("活动已结束，获奖用户将短信通知，感谢你的参与！");
            $(".dark_btn").removeClass("forbidden");
        }
    } else {
        toast(data.msg)
    }
})
//点击活动说明
$(".icon1").on("click", function () {
    if ($(this).hasClass("transform")) {
        $(this).css("transform", "rotate(180deg)")
        $(this).css("-webkit-transform", "rotate(180deg)")
        $(this).removeClass("transform")
        $(".show").removeClass("none");
    } else {
        $(this).css("transform", "rotate(0deg)")
        $(this).css("-webkit-transform", "rotate(0deg)")
        $(this).addClass("transform")
        $(".show").addClass("none");
    }
});
//点击立刻报名
$(".dark_btn").on("click", function () {
    let telverify = /^1[3456789]\d{9}$/;
    if($(this).hasClass("forbidden")){
        if (!telverify.test($("#phone").val())) {
            toast("请输入正确的手机号")
            $("#phone").val('');
        } else {
            myAjax.post(getApiUrl('activity/attend'), {
                phone_no: $("#phone").val()
            }, function (data) {
                if (data.status == '0') {
                    $(".login").addClass("none");//隐藏登录框
                    $(".activity-show").addClass("none");//隐藏活动说明
                    $(".enter-success").removeClass("none");//展示报名成功
                    if (data.data.new_user == '0') {//老用户
                        if (data.data.new_attend == '1') {//第一次来
                            $(".enter-success .p3").html("立刻分享得<span class='span2'>10元</span>话费");
                        } else if (data.data.new_attend == '0') {//第二次来
                            $(".enter-success .p3").html("立刻分享得<span class='span2'>10元</span>话费");//文案待定
                            toast("您已成功报名，无需重复提交")
                        }
                    } else if (data.data.new_user == '1') {//新用户
                        if (data.data.new_attend == '1') {//第一次来
                            $(".enter-success .p3").html("立刻分享得<span class='span1'>180元</span>新人用车大礼包和<span class='span2'>10元</span>话费");
                            $(".copyright").removeClass("none");
                        } else if (data.data.new_attend == '0') {//第二次来
                            $(".enter-success .p3").html("立刻分享得<span class='span1'>180元</span>新人用车大礼包和<span class='span2'>10元</span>话费");//文案待定
                            $(".copyright").removeClass("none");
                            toast("您已成功报名，无需重复提交")
                        }
                    }
                } else {
                    toast(data.msg)
                }
            })
        }
    }else{
        toast("活动已结束，获奖用户将短信通知，感谢你的参与！");
    }
});
//APP的分享
$(".info_btn").on("click", function () {
    $(".alert_window").removeClass("none");
});
$(".alert_window").on("click", function () {
    $(this).addClass("none");
});
//分享微信好友
$(".info-left").on("click", function () {
    event.stopPropagation();//阻止事件冒泡
    $(".alert_window").addClass("none");
    appshare()
    share('2')
});
//分享朋友圈
$(".info-right").on("click", function () {
    event.stopPropagation();//阻止事件冒泡
    $(".alert_window").addClass("none");
    appshare()
    share('1')
});

function share(destination) {
    let data = {
        share_type: '8',
        destination: destination
    }
    appMutual.shareWx(data)
}
//APP分享次数
function appshare(){
    myAjax.post(getApiUrl('activity/click-share-btn'), {
        phone_no: $("#phone").val(),
        source:'0'
    }, function (data) {
        if (data.status != '0') {
            toast(data.msg)
        }
    })
}
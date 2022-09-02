/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: changeHistory
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/9-下午4:58
 Description:
 Param:
 Return:
 *************************************************/
require('../css/oilerSingle/changeHistory.less')
import getApiUrl from '../js/getApiUrl'
import $ from 'jquery'
//import ddTalk from '../js/ddTalk'
//验证页面是否在钉钉浏览器打开
//ddTalk.verify(navigator.userAgent);
//获取参数
var _car_info;
var result = getQueryString("name");
if (result) {
    _car_info = result;
}
$(function () {
    $.post(getApiUrl("car/change-history"), {
        car_info: _car_info,
        mobile: sessionStorage.getItem("mobile"),
        PhoneInfo: sessionStorage.getItem("PhoneInfo") || ''
    }, function (result) {
        var data = result.data;
        var sHtml = "";
        $.each(data, function (i) {
            sHtml += '<li><p>' + data[i].type + '</p><p>操作人：' + data[i].name + '</p><p>状态：' + data[i].car_status + '</p><p>时间：' + data[i].time + '</p><p>备注：' + data[i].des + '</p></li>';
        });
        $('#historyBox').html(sHtml);
    })
})
//接收url参数
function getQueryString(name) {
    var reg = new RegExp('(?:(?:&|\\?)' + name + '=([^&]*))|(?:/' + name + '/([^/]*))', 'i');
    var r = window.location.href.match(reg);
    if (r != null)
        return decodeURI(r[1] || r[2]);
    return null;
}
dd.ready(function () {
    //返回
    dd.biz.navigation.setLeft({
        control: true,//是否控制点击事件，true 控制，false 不控制， 默认false
        text: '',//控制显示文本，空字符串表示显示默认文本
        onSuccess: function (result) {
            window.location.href = "../../manageOrderCardetail/index.html?type=1&plate_no=" + _car_info;
        },
        onFail: function (err) {
        }
    });
});
$(".bottom-btn-box button").on("click", function () {
    let userAgent = navigator.userAgent,
        isiOS = !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isiOS) {
        window.location.href = "../../manageOrderCardetail/index.html?type=1&plate_no=" + _car_info;
    } else {
        window.history.back()
    }
});
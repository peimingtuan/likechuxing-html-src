/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: drivingLicense
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/9-下午4:12
 Description:
 Param:
 Return:
 *************************************************/
require('../css/oilerSingle/drivingLicense.less')
import getApiUrl from '../js/getApiUrl'
import myAjax from '../common/myAjax/withJq.js'
import $ from 'jquery'
//import ddTalk from '../js/ddTalk'
//验证页面是否在钉钉浏览器打开
//ddTalk.verify(navigator.userAgent);
//点击图片放大效果
$('.img_con1 img').click(function () {
    $(this).toggleClass('min');
    $(this).toggleClass('max');
});

function checkImg(selecter, url) {
    if (/\/\/$/.test(url)) {
        $(selecter).attr('alt', '图片未上传')
    } else {
        $(selecter).attr("src", url);
        $(selecter).attr('alt', '图片404')
    }
}

$(function () {
    //获取参数
    var _car_info;
    var result = getQueryString("name");
    if (result) {
        _car_info = result;
    }
    $.post(getApiUrl("car/driving-license"), {
        car_info: _car_info,
        mobile: sessionStorage.getItem("mobile"),
        PhoneInfo: sessionStorage.getItem("PhoneInfo") || ''
    }, function (result) {
        var data = result.data;
        checkImg(".license_1", data.front_img)
        checkImg(".license_2", data.side_img)
    })
    //接收url参数
    function getQueryString(name) {
        var reg = new RegExp('(?:(?:&|\\?)' + name + '=([^&]*))|(?:/' + name + '/([^/]*))', 'i');
        var r = window.location.href.match(reg);
        if (r != null)
            return decodeURI(r[1] || r[2]);
        return null;
    }
})
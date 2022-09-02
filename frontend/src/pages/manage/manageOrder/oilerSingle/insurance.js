/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: insurance
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/9-下午4:14
 Description:
 Param:
 Return:
 *************************************************/
require('../css/oilerSingle/insurance.less')
import getApiUrl from '../js/getApiUrl'
import $ from 'jquery'
import Swiper from 'swiper'
require('swiper/dist/css/swiper.min.css')
import preview from '../../../../component/previewImg2'
//import ddTalk from '../js/ddTalk'
//验证页面是否在钉钉浏览器打开
//ddTalk.verify(navigator.userAgent);
function checkImg(selecter, url) {
    if (/\/\/$/.test(url)) {
        $(selecter).attr('alt', '图片未上传').removeClass('min')
    } else {
        $(selecter).attr("src", url).attr('alt', '图片404');
    }
}

//初始化swiper
var mySwiper = new Swiper('.swiper-container', {
    pagination: '.swiper-pagination',
    paginationClickable: true,
});
$(function () {
    //获取参数
    var _car_info = getQueryString("name");

    $.post(getApiUrl("car/insurance"), {
        car_info: _car_info,
        mobile: sessionStorage.getItem("mobile"),
        PhoneInfo: sessionStorage.getItem("PhoneInfo") || ''
    }, function (result) {
        var data = result.data;
        $(".times").text(data.this_expire);
        checkImg(".one", data.this_force);
        checkImg(".two", data.this_trade);
        $(".timeing").text(data.next_expire);
        checkImg(".oneer", data.next_force);
        checkImg(".twoer", data.next_trade);

        $('.min').on('click', function () {
            let src = this.src
            if (src !== '' && src !== 'https://imagestest.likechuxing.com//' && src !== 'https://images.likechuxing.com//') {
                preview({
                    url: src
                })
            }
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

})
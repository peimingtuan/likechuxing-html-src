/**
 * Created by Administrator on 2017/12/27.
 */
require('../css/public.css')
require('../css/schedulingJob/searchnetwork2.css')
import $ from 'jquery'
import FoundationTools from '../js/functionAjax'
import getApiUrl from '../js/getApiUrl'
import {Confirm,Toast} from '../common/LikeAlert/index'
import {waterMark} from '../../../../component/waterMark'
import ddTalk from '../js/ddTalk'
//验证页面是否在钉钉浏览器打开
ddTalk.verify(navigator.userAgent);
//接收url参数
var type = FoundationTools.getUrlParam('type');
//网点历史搜索记录
var paramsearch = {
    mobile: sessionStorage.getItem("mobile")
}
$('.searchnetwork-list').height($(window).height() - $(".searchTop").height());
waterMark({watermark_txt: sessionStorage.getItem('userName') + '-' + sessionStorage.getItem('mobile')});
$.post(getApiUrl('/work-order/branch-search-history'), paramsearch, function (result) {
    if (result.status == '0') {
        let str = '<li>历史搜索记录</li>';
        if (result.data.length != 0) {
            for (var i = 0; i < result.data.length; i++) {
                if (result.data[i].status_name == '' || result.data[i].status_name == null) {
                    str += '<li class="record">' + result.data[i].contents + '<br/><span class="span1">' + result.data[i].address + '</span><input type="hidden" value="' + result.data[i].contents + '" class="name" /><input type="hidden" value="' + result.data[i].branch_id + '" class="branch_id"/><input type="hidden" value="' + result.data[i].lng + '" class="lng" /><input type="hidden" value="' + result.data[i].lat + '" class="lat" /></li>';
                } else {
                    str += '<li class="winding">' + result.data[i].contents + '<br/><span class="span1">' + result.data[i].address + '</span><input type="hidden" value="' + result.data[i].contents + '" class="name" /><input type="hidden" value="' + result.data[i].branch_id + '" class="branch_id"/><input type="hidden" value="' + result.data[i].lng + '" class="lng" /><input type="hidden" value="' + result.data[i].lat + '" class="lat" /><span class="span2">已下线</span></li>';
                }
            }
            $(".searchnetwork-list").html(str);
        }
    } else {
        new Toast(result.msg)
    }
});
//模糊查询
var searching = true;
$(".search-car").on("input", function () {
    let value = $(this).val();
    let param = {
        mobile: sessionStorage.getItem("mobile"),
        province_name: sessionStorage.getItem('ddprovince'),//省
        city_name: sessionStorage.getItem('ddcity'),//市
        PhoneInfo: sessionStorage.getItem("PhoneInfo") || '',
        branch_name: value
    }
    let fellow = /^[\u4e00-\u9fa5]+$/;
    if (value.length > 1 && fellow.test(value) && searching == true) {
        searching = false;
        $.post(getApiUrl('/work-order/search'), param, function (data) {
            var result = data,
                status = result.status,
                msg = result.msg,
                data = result.data;
            var str = '';
            for (var i = 0; i < data.length; i++) {
                str += '<li class="record">' + data[i].name + '<input type="hidden" value="' + data[i].name + '" class="name" /><input type="hidden" value="' + data[i].branch_id + '" class="branch_id" /><input type="hidden" value="' + data[i].lng + '" class="lng" /><input type="hidden" value="' + data[i].lat + '" class="lat" /></li>';
            }
            setTimeout(function () {
                searching = true;
            }, 500)
            $(".searchnetwork-list").html(str);
        });
    }
})
//搜索结果跳转页面
$(".search-btn").on("click", function () {
    if ($(".search-car").val() == '') {
        new Toast('搜索结果不能为空')
    } else {
        let param = {
            mobile: sessionStorage.getItem("mobile"),
            province_name: sessionStorage.getItem('ddprovince'),//省
            city_name: sessionStorage.getItem('ddcity'),//市
            PhoneInfo: sessionStorage.getItem("PhoneInfo") || '',
            branch_name: $('.search-car').val()
        }
        $.post(getApiUrl('/work-order/search'), param, function (data) {
            var result = data,
                status = result.status,
                msg = result.msg,
                data = result.data;
            if (data.length == 0) {
                new Toast("当前城市没有该网点")
            } else {
                if (data.length == 1) {
                    if (type == 'troublepage') {
                        window.location.href = "./carwoundpicture2.html?name=" + data[0].name + "&branch_id=" + data[0].branch_id + "&lng=" + data[0].lng + "&lat=" + data[0].lat + "&type=troublepage";
                    } else if (type == 'chargepage') {
                        window.location.href = "./carwoundpicture2.html?name=" + data[0].name + "&branch_id=" + data[0].branch_id + "&lng=" + data[0].lng + "&lat=" + data[0].lat + "&type=chargepage";
                    } else {
                        window.location.href = "./carwoundpicture2.html?name=" + data[0].name + "&branch_id=" + data[0].branch_id + "&lng=" + data[0].lng + "&lat=" + data[0].lat;
                    }
                } else {
                    let str = '';
                    for (var i = 0; i < data.length; i++) {
                        str += '<li class="record">' + data[i].name + '<input type="hidden" value="' + data[i].name + '" class="name" /><input type="hidden" value="' + data[i].branch_id + '" class="branch_id" /><input type="hidden" value="' + data[i].lng + '" class="lng" /><input type="hidden" value="' + data[i].lat + '" class="lat" /></li>';
                    }
                    $(".searchnetwork-list").html(str);
                    new Toast("有多条查询结果，请选择下面的其中一条")
                }
            }
        });
    }
});
//点击搜索列表跳转页面
$(".searchnetwork-list").on('click', 'li', function () {
    //精准搜索
    let param = {
        mobile: sessionStorage.getItem("mobile"),
        province_name: sessionStorage.getItem('ddprovince'),//省
        city_name: sessionStorage.getItem('ddcity'),//市
        PhoneInfo: sessionStorage.getItem("PhoneInfo") || '',
        branch_id: $(this).find('.branch_id').val(),
        lng: $(this).find('.lng').val(),
        lat: $(this).find('.lat').val()
    }
    if ($(this).hasClass("winding")) {
        new Toast("该网点已下线")
    } else if ($(this).hasClass("record")) {
        $.post(getApiUrl('/work-order/search'), param, function (data) {
            let result = data,
                status = result.status,
                msg = result.msg;
            if (status == '0') {
                if (type == 'troublepage') {
                    window.location.href = "./carwoundpicture2.html?lng=" + param.lng + "&lat=" + param.lat + "&branch_id=" + param.branch_id + "&type=troublepage";
                } else if (type == 'chargepage') {
                    window.location.href = "./carwoundpicture2.html?lng=" + param.lng + "&lat=" + param.lat + "&branch_id=" + param.branch_id + "&type=chargepage";
                } else {
                    window.location.href = "./carwoundpicture2.html?lng=" + param.lng + "&lat=" + param.lat + "&branch_id=" + param.branch_id;
                }
            } else {
                new Toast(msg)
            }
        });
    }
})
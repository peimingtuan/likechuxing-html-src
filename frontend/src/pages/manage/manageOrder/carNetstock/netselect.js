/**
 * Created by Administrator on 2017/12/27.
 */
require('../css/public.css')
require('../css/carNetstock/netselect.css')
import $ from 'jquery'
import FoundationTools from '../js/functionAjax'
import getApiUrl from '../js/getApiUrl'
import {Confirm,Toast} from '../common/LikeAlert/index'
import waterMark from '../../../../../other_modules/like-manageOrder/waterMark'
import ddTalk from '../js/ddTalk'
//验证页面是否在钉钉浏览器打开
//ddTalk.verify(navigator.userAgent);
//接收url参数
sessionStorage.removeItem('biz_types');
sessionStorage.removeItem('propertys');
sessionStorage.removeItem('car_nums');
var type = FoundationTools.getUrlParam('type');//区别页面来源，2是来自于调度列表搜索，3来自广州限行列表的搜索,4来自车辆库存地图,5来自车辆更改网点
//网点历史搜索记录
if (localStorage.getItem("netrecord" + sessionStorage.getItem('userName'))) {
    let netrecord = JSON.parse(localStorage.getItem("netrecord" + sessionStorage.getItem('userName')));
    let recordItem = '';
    if (netrecord.length != '0') {
        for (var i = 0; i < netrecord.length; i++) {
            let classname = '';
            if (type == '3a' || type == '3b') {
                if (netrecord[i].lng == '') {
                    classname = 'none';
                }
            }
            recordItem += "<span class='" + classname + "'>" + netrecord[i].name + "<input type='hidden' value='" + netrecord[i].name + "' class='name' /><input class='branch_id' type='hidden' value='" + netrecord[i].id + "' /><input class='lng' type='hidden' value='" + netrecord[i].lng + "' /><input class='lat' type='hidden' value='" + netrecord[i].lat + "' /><input class='biz_type' type='hidden' value='" + netrecord[i].biz_type + "' /></span>";
        }
        $(".searchnetHistory").html(recordItem);
    } else {
        $(".net-content").addClass("none");
    }
}
$('.searchnetwork-list').height($(window).height() - $(".searchnetTop").height());
waterMark({watermark_txt: sessionStorage.getItem('userName') + '-' + sessionStorage.getItem('mobile')});
//模糊查询
var searching = true;
$(".search-net").on("input", function () {
    let value = $(this).val();
    let param = {
        mobile: sessionStorage.getItem("mobile"),
        city_id: sessionStorage.getItem('city_id'),//权限城市id
        PhoneInfo: sessionStorage.getItem("PhoneInfo") || '',
        kw: value
    }
    if (value.length > 1 && searching == true) {
        searching = false;
        $.post(getApiUrl('/branch-car-stock/search'), param, function (data) {
            let result = data.data;
            let str = '';
            if (data.status == '0') {
                if (result != '') {
                    if (result.branch) {
                        for (var i = 0; i < result.branch.length; i++) {
                            str += '<li class="record">' + result.branch[i].name + '<input type="hidden" value="' + result.branch[i].name + '" class="name" /><input type="hidden" value="' + result.branch[i].id + '" class="branch_id" /><input class="lng" type="hidden" value="' + result.branch[i].lng + '" /><input class="lat" type="hidden" value="' + result.branch[i].lat + '" /><input class="biz_type" type="hidden" value="' + result.branch[i].biz_type + '" /></li>';
                        }
                    } else if (result.car) {
                        if (type == '3a' || type == '3b' || type == '4') {
                            $(".net-content").addClass("none");
                            $(".selectnetResult").removeClass("none");
                        } else {
                            for (var i = 0; i < result.car.length; i++) {
                                str += '<li class="record">' + result.car[i].plate_no + '<input type="hidden" class="branch_id"  value="' + result.car[i].id + '" /><input type="hidden" class="name"  value="' + result.car[i].plate_no + '" /><input class="lng" type="hidden" value="" /><input class="lat" type="hidden" value="" /><input class="biz_type" type="hidden" value="" /></li>';
                            }
                            $(".selectnetResult").addClass("none");
                        }
                    }
                    $(".net-content").addClass("none");
                } else {
                    $(".net-content").addClass("none");
                    $(".selectnetResult").removeClass("none");
                }
            } else {
                new Toast(data.msg);
            }
            setTimeout(function () {
                searching = true;
            }, 500)
            $(".searchnetwork-list").html(str);
        });
    } else {
        $(".net-content").removeClass("none");
        $(".selectnetResult").addClass("none");
        $(".searchnetwork-list").html('');
    }
});

//历史记录直接搜索
$('.searchnetHistory').on('click', 'span', function () {
    historyrecord($(this).find(".branch_id").val(), $(this).find(".name").val(), $(this).find(".lng").val(), $(this).find(".lat").val(), $(this).find(".biz_type").val());
});

//点击搜索列表跳转页面
$(".searchnetwork-list").on('click', 'li', function () {
    historyrecord($(this).find(".branch_id").val(), $(this).find(".name").val(), $(this).find(".lng").val(), $(this).find(".lat").val(), $(this).find(".biz_type").val());
});

//json数组去重
function UniquePay(paylist) {
    var payArr = [paylist[0]];
    for (var i = 1; i < paylist.length; i++) {
        var payItem = paylist[i];
        var repeat = false;
        for (var j = 0; j < payArr.length; j++) {
            if (payItem.id == payArr[j].id) {
                repeat = true;
                break;
            }
        }
        if (!repeat) {
            payArr.push(payItem);
        }
    }
    return payArr;
}

//缓存搜索记录
function historyrecord(branch_id, name, lng, lat, biz_type) {
    if (localStorage.getItem("netrecord" + sessionStorage.getItem('userName'))) {
        let netrecord = JSON.parse(localStorage.getItem("netrecord" + sessionStorage.getItem('userName')));
        if (netrecord.length < 10) {
            netrecord.unshift({id: branch_id, name: name, lng: lng, lat: lat, biz_type: biz_type});
            localStorage.setItem("netrecord" + sessionStorage.getItem('userName'), JSON.stringify(UniquePay(netrecord)));
        } else {
            netrecord = netrecord.slice(0, 9);
            netrecord.unshift({id: branch_id, name: name, lng: lng, lat: lat, biz_type: biz_type});
            localStorage.setItem("netrecord" + sessionStorage.getItem('userName'), JSON.stringify(UniquePay(netrecord)));
        }
    } else {
        localStorage.setItem("netrecord" + sessionStorage.getItem('userName'), JSON.stringify([{
            id: branch_id,
            name: name,
            lng: lng,
            lat: lat,
            biz_type: biz_type
        }]));
    }
    if (type == '2') {
        location.href = "../dispatch/selectdispatch.html?branch_id=" + branch_id;
    } else if (type == '3a' || type == '3b') {
        location.href = "../destineCar/netdestinedetail.html?branch_id=" + branch_id + "&address=" + name + "&lng=" + lng + "&lat=" + lat + "&biz_type=" + biz_type;
    } else if (type == '4') {
        location.href = "./dispatchmap.html?branch_id=" + branch_id + "&lng=" + lng + "&lat=" + lat;
    } else if (type == '5') {
        location.href = "../oilerSingle/carwoundpicture.html?branch_id=" + branch_id + "&lng=" + lng + "&lat=" + lat + "&type=1";
    } else {
        if (lng) {
            location.href = "./selectdetail.html?branch_id=" + branch_id;
        } else {
            location.href = "./selectdetail.html?branch_id=" + branch_id + "&type=1";
        }
    }
}

//清除icon按钮展示
$(".search-net").on("input", function () {
    if ($(this).val().length > 0) {
        $(".clear-icon2").removeClass("none");
    } else {
        $(".clear-icon2").addClass("none");
    }
});

//清空input框的数据
$(".clear-icon2").on("click", function () {
    $(this).parent().find("input").val('');
    $(this).addClass("none");
    $(".net-content").removeClass("none");
    $(".selectnetResult").addClass("none");
    $(".searchnetwork-list").html('');
});

//取消跳转页面
$(".cancel-btn").on("click", function () {
    if (type == '2') {
        location.href = "../dispatch/controllist.html";
    } else if (type == '3a') {
        location.href = "../destineCar/destinelist.html";
    } else if (type == '3b') {
        location.href = "../destineCar/adjustablelist.html";
    } else if (type == '4') {
        location.href = "./dispatchmap.html";
    } else if (type == '5') {
        location.href = "../oilerSingle/networkname.html?type=1";
    } else {
        location.href = "./carstocklist.html";
    }
});

//删除本地缓存
$(".delete-icon").on("click", function () {
    localStorage.removeItem("netrecord" + sessionStorage.getItem('userName'));
    $(".searchnetHistory").html('');
});
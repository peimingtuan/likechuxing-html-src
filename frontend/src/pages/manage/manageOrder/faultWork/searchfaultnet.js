/**
 * Created by Administrator on 2017/12/27.
 */
require('../css/public.css')
require('../css/faultWork/searchfaultnet.css')
import $ from 'jquery'
import FoundationTools from '../js/functionAjax'
import getApiUrl from '../js/getApiUrl'
import {Confirm,Toast} from '../common/LikeAlert/index'
import waterMark from '../../../../../other_modules/like-manageOrder/waterMark'
import ddTalk from '../js/ddTalk'
//验证页面是否在钉钉浏览器打开
//ddTalk.verify(navigator.userAgent);
//网点历史搜索记录
if (localStorage.getItem("faultnetrecord")) {
    let netrecord = JSON.parse(localStorage.getItem("faultnetrecord"));
    let recordItem = '';
    if (netrecord.length != '0') {
        for (var i = 0; i < netrecord.length; i++) {
            recordItem += "<span>" + netrecord[i].name + "<input type='hidden' value='" + netrecord[i].name + "' class='name' /><input class='branch_id' type='hidden' value='" + netrecord[i].id + "' /><input class='lng' type='hidden' value='" + netrecord[i].lng + "' /><input class='lat' type='hidden' value='" + netrecord[i].lat + "' /><input class='biz_type' type='hidden' value='" + netrecord[i].biz_type + "' /></span>";
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
    if (localStorage.getItem("faultnetrecord")) {
        let netrecord = JSON.parse(localStorage.getItem("faultnetrecord"));
        if (netrecord.length < 10) {
            netrecord.unshift({id: branch_id, name: name, lng: lng, lat: lat, biz_type: biz_type});
            localStorage.setItem("faultnetrecord", JSON.stringify(UniquePay(netrecord)));
        } else {
            netrecord = netrecord.slice(0, 9);
            netrecord.unshift({id: branch_id, name: name, lng: lng, lat: lat, biz_type: biz_type});
            localStorage.setItem("faultnetrecord", JSON.stringify(UniquePay(netrecord)));
        }
    } else {
        localStorage.setItem("faultnetrecord", JSON.stringify([{
            id: branch_id,
            name: name,
            lng: lng,
            lat: lat,
            biz_type: biz_type
        }]));
    }
    window.location.href = "./searchfaultmap.html?branch_id=" + branch_id + "&name=" + name + "&lng=" + lng + "&lat=" + lat + "&biz_type=" + biz_type;
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
    window.location.href = "./searchfaultmap.html";
});

//删除本地缓存
$(".delete-icon").on("click", function () {
    localStorage.removeItem("faultnetrecord");
    $(".searchnetHistory").html('');
});
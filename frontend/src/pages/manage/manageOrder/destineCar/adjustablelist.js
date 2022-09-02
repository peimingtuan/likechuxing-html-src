/**
 * Created by Administrator on 2018/7/17.
 */
require('../css/public.css')
require('../css/destineCar/adjustablelist.css')
import $ from 'jquery'
import FoundationTools from '../js/functionAjax'
import getApiUrl from '../js/getApiUrl'
import myAjax from '../common/myAjax/withJq.js'
import {Confirm,Toast} from '../common/LikeAlert/index'
import PullUpDown from '../../../../component/pullDonwRefresh/index'
import Loading from '../../../../component/loading'
import ddTalk from '../js/ddTalk'
//验证页面是否在钉钉浏览器打开
//ddTalk.verify(navigator.userAgent);
//获取钉钉授权
import ddConfigs from '../js/ddConfigs'
ddConfigs.config()
dd.error(function (error) {
    new Toast("钉钉授权失败，请关闭页面重新打开")
});
var loading = new Loading()//加载loading
//初始化加载图片
$(".netstockList li .img1").attr("src", require("../image/mapb.png"));//网点类型
$(".netstockList li .img2").attr("src", require("../image/carNetstock/daohang.png"));//导航
//初始化我的加油工单接口
var param = {
    mobile: sessionStorage.getItem('mobile'),
    page: 1, //页数
    lng: '',
    lat: '',
    limit: 10
};

//手动固定父元素的高，否则scroll不起作用
$('.adjustableList').height($(window).height() - $('.adjustable-content').height());
//导航
var driving;
AMap.plugin(["AMap.Driving"], function () {
    var drivingOption = {
        policy: AMap.DrivingPolicy.LEAST_TIME,
        map: ''
    };
    driving = new AMap.Driving(drivingOption); //构造驾车导航类
});
dd.ready(function () {
    //钉钉获取定位
    dd.device.geolocation.get({
        targetAccuracy: 200,
        coordinate: 1,
        withReGeocode: true,
        useCache: true, //默认是true，如果需要频繁获取地理位置，请设置false
        onSuccess: function (result) {
            //存储当前位置的经纬度
            sessionStorage.setItem('locationsLng', result.longitude);
            sessionStorage.setItem('locationsLat', result.latitude);
            param.lng = result.longitude;
            param.lat = result.latitude;
            show(param)
        },
        onFail: function (err) {
            new Toast("钉钉获取定位失败")
        }
    });
    //刷新页面
    $(".adjustableRefle").on("click", function () {
        let param = {
            mobile: sessionStorage.getItem('mobile'),
            page: 1, //页数
            lng: '',
            lat: '',
            limit: 10
        }
        $(".confirm-carstate .color").each(function () {//筛选条件
            if ($(this).find("input").val() == '') {
                return false;
            } else if ($(this).find("input").val() == '1') {
                param.is_local = '1';//粤A牌照
            } else if ($(this).find("input").val() == '3') {
                param.drive_day = '3';//可行驶天数
            } else {
                param.drive_day = '4';//可行驶天数
            }
        });
        //钉钉获取定位
        dd.device.geolocation.get({
            targetAccuracy: 200,
            coordinate: 1,
            withReGeocode: true,
            useCache: true, //默认是true，如果需要频繁获取地理位置，请设置false
            onSuccess: function (result) {
                //存储当前位置的经纬度
                sessionStorage.setItem('locationsLng', result.longitude);
                sessionStorage.setItem('locationsLat', result.latitude);
                param.lng = result.longitude;
                param.lat = result.latitude;
                show(param);
                new Toast("刷新成功")
            },
            onFail: function (err) {
                new Toast("钉钉获取定位失败")
            }
        });
    });
    //跳转导航页面
    $(".adjustableList").on("click", ".navigation-icon", function () {
        let lng = $(this).parent().find(".lng").val(),
            lat = $(this).parent().find(".lat").val();
        //钉钉获取定位
        dd.device.geolocation.get({
            targetAccuracy: 200,
            coordinate: 1,
            withReGeocode: false,
            useCache: true, //默认是true，如果需要频繁获取地理位置，请设置false
            onSuccess: function (data) {
                driving.search(
                    [data.longitude, data.latitude], [lng, lat],
                    function (status, result) {
                        driving.searchOnAMAP({
                            origin: result.origin,
                            destination: result.destination
                        });
                    });
            },
            onFail: function (err) {
                new Toast("钉钉获取定位失败")
            }
        });
    });
});
function show(param) {
    myAjax.post(getApiUrl('/limit-line/transfer-branch'), param, function (data) {
        if (data.status == '0') {
            loading.destroy()//清除loading
            let str = '';
            if (data.data.length == 0) {
                new Toast("暂无数据");
            } else {
                for (var i = 0; i < data.data.length; i++) {
                    let color_type = '';
                    if (data.data[i].is_hasa == '0') {
                        color_type = 'font2';
                    }
                    str += '<li class="netlist"><input type="hidden" value="' + data.data[i].id + '" class="net-Id"/><input type="hidden" value="' + data.data[i].lng + '" class="lng"/><input type="hidden" value="' + data.data[i].lat + '" class="lat"/><input type="hidden" value="' + data.data[i].biz_type + '" class="biz_type"/><input type="hidden" value="' + data.data[i].move_num + '" class="move_num"/><input type="hidden" value="' + data.data[i].address + '" class="address"/><span>' + data.data[i].name + '</span><br/><span class="netlocation">可调入：<font class="' + color_type + '">' + data.data[i].move_num + '</font>台</span>' +
                        '<br/>';
                    if (data.data[i].biz_type == '0') {//合作网点
                        str += '<span><img src="' + require("../image/mapb.png") + '" class="img1"/>' + data.data[i].address + '</span>';
                    } else if (data.data[i].biz_type == '1') {//非合作网点
                        str += '<span><img src="' + require("../image/map-B.png") + '" class="img1"/>' + data.data[i].address + '</span>';
                    }
                    str += '<span class="navigation-icon"><img src="' + require("../image/carNetstock/daohang.png") + '" class="img2"/>导航</span></li>';
                }
            }
            $(".adjustableList").html(str);
            //上拉，下拉获取数据
            var index = 0;
            let pullUpDown = new PullUpDown({
                listClassName: '',
                content: str,
                parent: document.querySelector('.adjustableList'),
                pullDownRefresh: function (cb) {
                    let that = this
                    setTimeout(function () {
                        let str = '';
                        param.page = 1;
                        index = 0;
                        myAjax.post(getApiUrl('/limit-line/transfer-branch'), param, function (data) {
                            if (data.data.length != 0) {
                                for (var i = 0; i < data.data.length; i++) {
                                    let color_type = '';
                                    if (data.data[i].is_hasa == '0') {
                                        color_type = 'font2';
                                    }
                                    str += '<li class="netlist"><input type="hidden" value="' + data.data[i].id + '" class="net-Id"/><input type="hidden" value="' + data.data[i].lng + '" class="lng"/><input type="hidden" value="' + data.data[i].lat + '" class="lat"/><input type="hidden" value="' + data.data[i].biz_type + '" class="biz_type"/><input type="hidden" value="' + data.data[i].move_num + '" class="move_num"/><input type="hidden" value="' + data.data[i].address + '" class="address"/><span>' + data.data[i].name + '</span><br/><span class="netlocation">可调入：<font class="' + color_type + '">' + data.data[i].move_num + '</font>台</span>' +
                                        '<br/>';
                                    if (data.data[i].biz_type == '0') {//合作网点
                                        str += '<span><img src="' + require("../image/mapb.png") + '" class="img1"/>' + data.data[i].address + '</span>';
                                    } else if (data.data[i].biz_type == '1') {//非合作网点
                                        str += '<span><img src="' + require("../image/map-B.png") + '" class="img1"/>' + data.data[i].address + '</span>';
                                    }
                                    str += '<span class="navigation-icon"><img src="' + require("../image/carNetstock/daohang.png") + '" class="img2"/>导航</span></li>';
                                }
                                that.changeContent(str);
                                cb(true)
                            } else {
                                new Toast("暂无数据");
                            }
                        });
                    }, 400)
                },
                pullUpLoad: function (cb) {
                    let that = this
                    setTimeout(function () {
                        let str = '';
                        index++;
                        param.page = index + 1;
                        myAjax.post(getApiUrl('/limit-line/transfer-branch'), param, function (data) {
                            if (data.data.length == 0) {
                                cb(false)
                            } else {
                                for (var i = 0; i < data.data.length; i++) {
                                    let color_type = '';
                                    if (data.data[i].is_hasa == '0') {
                                        color_type = 'font2';
                                    }
                                    str += '<li class="netlist"><input type="hidden" value="' + data.data[i].id + '" class="net-Id"/><input type="hidden" value="' + data.data[i].lng + '" class="lng"/><input type="hidden" value="' + data.data[i].lat + '" class="lat"/><input type="hidden" value="' + data.data[i].biz_type + '" class="biz_type"/><input type="hidden" value="' + data.data[i].move_num + '" class="move_num"/><input type="hidden" value="' + data.data[i].address + '" class="address"/><span>' + data.data[i].name + '</span><br/><span class="netlocation">可调入：<font class="' + color_type + '">' + data.data[i].move_num + '</font></span>' +
                                        '<br/>';
                                    if (data.data[i].biz_type == '0') {//合作网点
                                        str += '<span><img src="' + require("../image/mapb.png") + '" class="img1"/>' + data.data[i].address + '</span>';
                                    } else if (data.data[i].biz_type == '1') {//非合作网点
                                        str += '<span><img src="' + require("../image/map-B.png") + '" class="img1"/>' + data.data[i].address + '</span>';
                                    }
                                    str += '<span class="navigation-icon"><img src="' + require("../image/carNetstock/daohang.png") + '" class="img2"/>导航</span></li>';
                                }
                                that.appendContent(str);
                                cb(true)
                            }
                        });
                    }, 400)
                }
            })
        } else {
            new Toast(data.msg)
        }
    });
    //跳转当前网点可调入车辆库存页
    $(".adjustableList").on("click", ".netlocation", function () {
        //获取筛选条件
        let choicetype;
        $(".confirm-carstate .color").each(function () {//筛选条件
            if ($(this).find("input").val() == '') {
                choicetype = '0';
                return false;
            } else if ($(this).find("input").val() == '1') {
                choicetype = '1';//粤A牌照
                return false;
            } else if ($(this).find("input").val() == '3') {
                choicetype = '3';//可行驶天数
                return false;
            } else {
                choicetype = '4';//可行驶天数
                return false;
            }
        });
        window.location.href = "./netdestinedetail.html?branch_id=" + $(this).parent().find(".net-Id").val() + "&lng=" + $(this).parent().find(".lng").val() + "&lat=" + $(this).parent().find(".lat").val() + "&biz_type=" + $(this).parent().find(".biz_type").val() + "&current_counts=" + $(this).parent().find(".move_num").val() + "&address=" + $(this).parent().find(".address").val() + "&choicetype=" + choicetype;
    });
}
//跳转搜索页
$(".adjustableSelect").on("click", function () {
    location.href = "../carNetstock/netselect.html?type=3b";
});
//跳转查看地图页
$(".adjustable-content .div2 span").on("click", function () {
    let type;
    $(".confirm-carstate .color").each(function () {//筛选条件
        if ($(this).find("input").val() == '') {
            type = '0';
            return false;
        } else if ($(this).find("input").val() == '1') {
            type = '1';//粤A牌照
            return false;
        } else if ($(this).find("input").val() == '3') {
            type = '3';//可行驶天数
            return false;
        } else {
            type = '4';//可行驶天数
            return false;
        }
    });
    location.href = "./callincarmap.html?maptype=" + type;
});

//记录打开弹框前已筛选的值
var colorArray = [];
//打开筛选弹框
$(".adjustableFilter").on("click", function () {
    colorArray = [];
    $(".confirm-carstate span").each(function () {
        if ($(this).hasClass("color")) {
            colorArray.push($(this));
        }
    });
    $(".carstock_window2").removeClass("none");
});
//关闭筛选弹框
$(".close-carstock2").on("click", function () {
    $(".confirm-carstate span").removeClass("color");
    for (var i = 0; i < colorArray.length; i++) {
        colorArray[i].addClass("color");
    }
    $(".carstock_window2").addClass("none");
});

//点击确定按钮关闭弹框
$(".carstate-sure").on("click", function () {
    let param = {
        mobile: sessionStorage.getItem('mobile'),
        page: 1, //页数
        limit: '10',//每页显示条数
        lng: sessionStorage.getItem('locationsLng'),
        lat: sessionStorage.getItem('locationsLat')
    }
    $(".confirm-carstate .color").each(function () {//筛选条件
        if ($(this).find("input").val() == '') {
            return false;
        } else if ($(this).find("input").val() == '1') {
            param.is_local = '1';//粤A牌照
            return false;
        } else if ($(this).find("input").val() == '3') {
            param.drive_day = '3';//可行驶天数
            return false;
        } else {
            param.drive_day = '4';//可行驶天数
            return false;
        }
    });
    show(param);
    $(".carstock_window2").addClass("none");
});
//点击选项变换颜色
$(".state").on("click", function () {
    if ($(".confirm-carstate .color").length > 0) {
        if (!$(this).hasClass("color")) {
            $(".confirm-carstate .state").removeClass("color");
            $(this).addClass("color");
        }
    } else {
        $(this).addClass("color");
    }
    $(".allcarstate").removeClass("color");
});
//点击重置按钮
$(".carstate-reset").on("click", function () {
    $(".state").removeClass("color");
    $(".allcarstate").addClass("color");
});
//点击全部
$(".allcarstate").on("click", function () {
    $(".state").removeClass("color");
    $(this).addClass("color");
});
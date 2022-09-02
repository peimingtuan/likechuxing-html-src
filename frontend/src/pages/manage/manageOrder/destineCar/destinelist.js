/**
 * Created by Administrator on 2018/7/17.
 */
require('../css/public.css')
require('../css/destineCar/destinelist.css')
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
$(".sort_content img").attr("src", require("../image/carNetstock/duigou.png"));//排序对勾
$(".destine_bottom img").attr("src", require('../image/dispatch/close-btn.png'));//预订列表说明关闭按钮
//初始化我的加油工单接口
var param = {
    mobile: sessionStorage.getItem('mobile'),
    sort: '1',//排序类型
    page: 1, //页数
    lng: '',
    lat: '',
    limit: '10',//每页显示条数
};
$(".destine-content .p1").text(new Date().getMonth() + 1 + '月' + new Date().getDate() + '日预约情况');//当日情况
//手动固定父元素的高，否则scroll不起作用
$('.destineList').height($(window).height() - $('.destine-content').height() - $('.bottom-btn').height());
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
        withReGeocode: false,
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
    $(".destineRefle").on("click", function () {
        let param = {
            mobile: sessionStorage.getItem('mobile'),
            sort: '1',//排序类型
            page: 1, //页数
            lng: '',
            lat: '',
            limit: '10'//每页显示条数
        }
        $(".destine-content .p1").text(new Date().getMonth() + 1 + '月' + new Date().getDate() + '日预约情况');
        //钉钉获取定位
        dd.device.geolocation.get({
            targetAccuracy: 200,
            coordinate: 1,
            withReGeocode: false,
            useCache: true, //默认是true，如果需要频繁获取地理位置，请设置false
            onSuccess: function (result) {
                //存储当前位置的经纬度
                sessionStorage.setItem('locationsLng', result.longitude);
                sessionStorage.setItem('locationsLat', result.latitude);
                param.lng = result.longitude;
                param.lat = result.latitude;
                $(".confirm-carstate .color").each(function () {//是否已完成
                    if ($(this).find("input").val() == '') {
                        return false;
                    } else {
                        param.complete = $(this).find("input").val();
                    }
                });
                $(".confirm-carnetstate .color").each(function () {//网点类型
                    if ($(this).find("input").val() == '') {
                        return false;
                    } else {
                        param.biz_type = $(this).find("input").val();
                    }
                });
                //获取排序信息
                $(".sort-list li").each(function () {
                    if ($(this).hasClass("sort-color")) {
                        param.sort = $(this).find("input").val();
                    }
                });
                show(param);
                new Toast("刷新成功")
            },
            onFail: function (err) {
                new Toast("钉钉获取定位失败")
            }
        });
    });
    //跳转导航页面
    $(".destineList").on("click", ".navigation-icon", function () {
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
    myAjax.post(getApiUrl('/limit-line/booking-list'), param, function (data) {
        if (data.status == '0') {
            $(".destine-content .font1").text(data.data.branch_num);//预约网点数
            $(".destine-content .font2").text(data.data.car_num);//预约车辆数
            loading.destroy()//清除loading
            let str = '';
            if (data.data.list.length == 0) {
                new Toast("暂无数据")
            } else {
                for (var i = 0; i < data.data.list.length; i++) {
                    str += '<li><input type="hidden" value="' + data.data.list[i].branch_id + '" class="branch_id"/><input type="hidden" value="' + data.data.list[i].lng + '" class="lng"/><input type="hidden" value="' + data.data.list[i].lat + '" class="lat"/><input type="hidden" value="' + data.data.list[i].biz_type + '" class="biz_type"/><input type="hidden" value="' + data.data.list[i].current_counts + '" class="current_counts"/><input type="hidden" value="' + data.data.list[i].address + '" class="address"/><span>' + data.data.list[i].name + '</span><br/><span class="netlocation">当前车辆<font>' + data.data.list[i].current_counts + '</font>台</span>' +
                        '<span>用户预订：<font>' + data.data.list[i].booking_num + '</font>台</span><span>已完成：<font>' + data.data.list[i].complete_num + '</font>台</span><br/><span><input type="hidden" class="car_change" value="' + data.data.list[i].car_change + '" />待改状态：<font class="change-state">' + data.data.list[i].car_change + '</font>台</span><br/>';
                    if (data.data.list[i].biz_type == '0') {//合作网点
                        str += '<span><img src="' + require("../image/mapb.png") + '" class="img1"/>' + data.data.list[i].address + '</span>';
                    } else if (data.data.list[i].biz_type == '1') {//非合作网点
                        str += '<span><img src="' + require("../image/map-B.png") + '" class="img1"/>' + data.data.list[i].address + '</span>';
                    }
                    str += '<span class="navigation-icon"><img class="img2" src="' + require("../image/carNetstock/daohang.png") + '"/>导航</span></li>';
                }
            }
            $(".destineList").html(str);
            //上拉，下拉获取数据
            var index = 0;
            let pullUpDown = new PullUpDown({
                listClassName: '',
                content: str,
                parent: document.querySelector('.destineList'),
                pullDownRefresh: function (cb) {
                    let that = this
                    setTimeout(function () {
                        let str = '';
                        param.page = 1;
                        index = 0;
                        myAjax.post(getApiUrl('/limit-line/booking-list'), param, function (data) {
                            if (data.data.length != 0) {
                                for (var i = 0; i < data.data.list.length; i++) {
                                    str += '<li><input type="hidden" value="' + data.data.list[i].branch_id + '" class="branch_id"/><input type="hidden" value="' + data.data.list[i].lng + '" class="lng"/><input type="hidden" value="' + data.data.list[i].lat + '" class="lat"/><input type="hidden" value="' + data.data.list[i].biz_type + '" class="biz_type"/><input type="hidden" value="' + data.data.list[i].current_counts + '" class="current_counts"/><input type="hidden" value="' + data.data.list[i].address + '" class="address"/><span>' + data.data.list[i].name + '</span><br/><span class="netlocation">当前车辆<font>' + data.data.list[i].current_counts + '</font>台</span>' +
                                        '<span>用户预订：<font>' + data.data.list[i].booking_num + '</font>台</span><span>已完成：<font>' + data.data.list[i].complete_num + '</font>台</span><br/><span><input type="hidden" class="car_change" value="' + data.data.list[i].car_change + '" />待改状态：<font class="change-state">' + data.data.list[i].car_change + '</font>台</span><br/>';
                                    if (data.data.list[i].biz_type == '0') {//合作网点
                                        str += '<span><img src="' + require("../image/mapb.png") + '" class="img1"/>' + data.data.list[i].address + '</span>';
                                    } else if (data.data.list[i].biz_type == '1') {//非合作网点
                                        str += '<span><img src="' + require("../image/map-B.png") + '" class="img1"/>' + data.data.list[i].address + '</span>';
                                    }
                                    str += '<span class="navigation-icon"><img class="img2" src="' + require("../image/carNetstock/daohang.png") + '"/>导航</span></li>';
                                }
                                that.changeContent(str);
                                cb(true)
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
                        myAjax.post(getApiUrl('/limit-line/booking-list'), param, function (data) {
                            if (data.data.list.length == 0) {
                                cb(false)
                            } else {
                                for (var i = 0; i < data.data.list.length; i++) {
                                    str += '<li><input type="hidden" value="' + data.data.list[i].branch_id + '" class="branch_id"/><input type="hidden" value="' + data.data.list[i].lng + '" class="lng"/><input type="hidden" value="' + data.data.list[i].lat + '" class="lat"/><input type="hidden" value="' + data.data.list[i].biz_type + '" class="biz_type"/><input type="hidden" value="' + data.data.list[i].current_counts + '" class="current_counts"/><input type="hidden" value="' + data.data.list[i].address + '" class="address"/><span>' + data.data.list[i].name + '</span><br/><span class="netlocation">当前车辆<font>' + data.data.list[i].current_counts + '</font>台</span>' +
                                        '<span>用户预订：<font>' + data.data.list[i].booking_num + '</font>台</span><span>已完成：<font>' + data.data.list[i].complete_num + '</font>台</span><br/><span><input type="hidden" class="car_change" value="' + data.data.list[i].car_change + '" />待改状态：<font class="change-state">' + data.data.list[i].car_change + '</font>台</span><br/>';
                                    if (data.data.list[i].biz_type == '0') {//合作网点
                                        str += '<span><img src="' + require("../image/mapb.png") + '" class="img1"/>' + data.data.list[i].address + '</span>';
                                    } else if (data.data.list[i].biz_type == '1') {//非合作网点
                                        str += '<span><img src="' + require("../image/map-B.png") + '" class="img1"/>' + data.data.list[i].address + '</span>';
                                    }
                                    str += '<span class="navigation-icon"><img class="img2" src="' + require("../image/carNetstock/daohang.png") + '"/>导航</span></li>';
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
    //跳转当前网点车辆库存页
    $(".destineList").on("click", ".netlocation", function () {
        window.location.href = "./netdestinedetail.html?branch_id=" + $(this).parent().find(".branch_id").val() + "&lng=" + $(this).parent().find(".lng").val() + "&lat=" + $(this).parent().find(".lat").val() + "&biz_type=" + $(this).parent().find(".biz_type").val() + "&current_counts=" + $(this).parent().find(".current_counts").val() + "&address=" + $(this).parent().find(".address").val();
    });
    //跳转当前网点待改状态车辆库存页
    $(".destineList").on("click", ".change-state", function () {
        window.location.href = "./netdestinedetail.html?branch_id=" + $(this).parent().parent().find(".branch_id").val() + "&lng=" + $(this).parent().parent().find(".lng").val() + "&lat=" + $(this).parent().parent().find(".lat").val() + "&biz_type=" + $(this).parent().parent().find(".biz_type").val() + "&current_counts=" + $(this).parent().find(".car_change").val() + "&address=" + $(this).parent().parent().find(".address").val() + "&is_transfer=2";
    });
}
//跳转搜索页
$(".destineSelect").on("click", function () {
    location.href = "../carNetstock/netselect.html?type=3a";
});
//排序弹框
$(".destineSort").on("click", function () {
    $(".sort_window").removeClass("none");
});
//记录打开弹框前已筛选的值
var colorArray = [];
//打开筛选弹框
$(".destineFilter").on("click", function () {
    colorArray = [];
    $(".confirm-carstock span").each(function () {
        if ($(this).hasClass("color")) {
            colorArray.push($(this));
        }
    });
    $(".carstock_window").removeClass("none");
});
//关闭筛选弹框
$(".close-carstock").on("click", function () {
    $(".confirm-carstock span").removeClass("color");
    for (var i = 0; i < colorArray.length; i++) {
        colorArray[i].addClass("color");
    }
    $(".carstock_window").addClass("none");
});
//打开车辆预定列表说明弹框
$(".check-carshow").on("click", function () {
    $(".destine_window").removeClass("none");
});
//关闭车辆预定列表说明弹框
$(".destine_bottom img").on("click", function () {
    $(".destine_window").addClass("none");
});

//跳转查看地图网点页
$(".check-net").on("click", function () {
    window.location.href = "./destinemap.html";
});

//跳转可调入列表页
$(".check-netcar").on("click", function () {
    window.location.href = "./adjustablelist.html";
});

//点击确定按钮关闭弹框
$(".carstate-sure").on("click", function () {
    let param = {
        mobile: sessionStorage.getItem('mobile'),
        sort: '1',//排序类型
        page: 1, //页数
        limit: '10',//每页显示条数
        lng: sessionStorage.getItem('locationsLng'),
        lat: sessionStorage.getItem('locationsLat')
    }
    $(".confirm-carstate .color").each(function () {//是否已完成
        if ($(this).find("input").val() == '') {
            return false;
        } else {
            param.complete = $(this).find("input").val();
        }
    });
    $(".confirm-carnetstate .color").each(function () {//网点类型
        if ($(this).find("input").val() == '') {
            return false;
        } else {
            param.biz_type = $(this).find("input").val();
        }
    });
    //获取排序信息
    $(".sort-list li").each(function () {
        if ($(this).hasClass("sort-color")) {
            param.sort = $(this).find("input").val();
        }
    });
    show(param);
    $(".carstock_window").addClass("none");
})
//点击选项变换颜色
$(".state").on("click", function () {
    if ($(".confirm-carstate .color").length > 0) {
        if ($(this).hasClass("color")) {
            $(this).removeClass("color");
        } else {
            $(this).addClass("color");
        }
    } else {
        $(this).addClass("color");
    }
    $(".allcarstate").removeClass("color");
});
$(".nettype").on("click", function () {
    if ($(".confirm-carnetstate .color").length > 0) {
        if (!$(this).hasClass("color")) {
            $(".nettype").removeClass("color");
            $(this).addClass("color");
        }
    } else {
        $(this).addClass("color");
    }
    $(".allnettype").removeClass("color");
});
//点击重置按钮
$(".carstate-reset").on("click", function () {
    $(".nettype").removeClass("color");
    $(".allnettype").addClass("color");
    $(".state").removeClass("color");
    $(".allcarstate").addClass("color");
});
//点击全部
$(".allcarstate").on("click", function () {
    $(".state").removeClass("color");
    $(this).addClass("color");
});
$(".allnettype").on("click", function () {
    $(".nettype").removeClass("color");
    $(this).addClass("color");
});
//关闭排序弹框
$(".close-sort").on("click", function () {
    $(".sort_window").addClass("none");
});
//距离网点从近到远排序
$(".range-sort").on("click", function () {
    $(this).addClass("sort-color");
    $(this).find("img").removeClass("none");
    $(".num-sort").removeClass("sort-color");
    $(".num-sort img").addClass("none");
    $(".sort_window").addClass("none");
    let param = {
        mobile: sessionStorage.getItem('mobile'),
        sort: '1',//排序类型
        page: 1, //页数
        limit: '10',//每页显示条数
        lng: sessionStorage.getItem('locationsLng'),
        lat: sessionStorage.getItem('locationsLat')
    }
    $(".confirm-carstate .color").each(function () {//是否已完成
        if ($(this).find("input").val() == '') {
            return false;
        } else {
            param.complete = $(this).find("input").val();
        }
    });
    $(".confirm-carnetstate .color").each(function () {//网点类型
        if ($(this).find("input").val() == '') {
            return false;
        } else {
            param.biz_type = $(this).find("input").val();
        }
    });
    //获取排序信息
    param.sort = $(this).find("input").val();
    show(param);
});
//超车数量从大到小
$(".num-sort").on("click", function () {
    $(this).addClass("sort-color");
    $(this).find("img").removeClass("none");
    $(".range-sort").removeClass("sort-color");
    $(".range-sort img").addClass("none");
    $(".sort_window").addClass("none");
    let param = {
        mobile: sessionStorage.getItem('mobile'),
        sort: '1',//排序类型
        page: 1, //页数
        limit: '10',//每页显示条数
        lng: sessionStorage.getItem('locationsLng'),
        lat: sessionStorage.getItem('locationsLat')
    }
    $(".confirm-carstate .color").each(function () {//是否已完成
        if ($(this).find("input").val() == '') {
            return false;
        } else {
            param.complete = $(this).find("input").val();
        }
    });
    $(".confirm-carnetstate .color").each(function () {//网点类型
        if ($(this).find("input").val() == '') {
            return false;
        } else {
            param.biz_type = $(this).find("input").val();
        }
    });
    //获取排序信息
    param.sort = $(this).find("input").val();
    show(param);
});
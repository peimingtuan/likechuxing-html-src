/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: carLocation
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/9-下午4:13
 Description:
 Param:
 Return:
 *************************************************/
require('../css/public.css')
import $ from 'jquery'
import getApiUrl from '../js/getApiUrl'
import FoundationTools from '../js/functionAjax'
import myAjax from '../common/myAjax/withJq.js'
import {Confirm,Toast} from '../common/LikeAlert/index'
require('../css/oilerSingle/carLocation.less')
//import ddTalk from '../js/ddTalk'
import Loading from '../../../../component/loading'
//接收URL参数
var workstatus = FoundationTools.getUrlParam('workstatus');//已完成加油状态
if (workstatus == '3') {
    $(".btn-box").hide();
}
//验证页面是否在钉钉浏览器打开
//ddTalk.verify(navigator.userAgent);
var loading = new Loading()//加载loading
//获取钉钉授权
import ddConfigs from '../js/ddConfigs'
ddConfigs.config()
//调取钉钉接口
dd.error(function (error) {
    new Toast("钉钉授权验证失败，请关闭页面重新打开")
});
dd.ready(function () {
    if (workstatus == '3') {
        dd.biz.navigation.setLeft({
            control: true,//是否控制点击事件，true 控制，false 不控制， 默认false
            text: '',//控制显示文本，空字符串表示显示默认文本
            onSuccess: function (result) {
                window.history.back();
            },
            onFail: function (err) {
            }
        });
    }
    dd.device.geolocation.get({
        targetAccuracy: 200,
        coordinate: 1,
        withReGeocode: false,
        useCache: true, //默认是true，如果需要频繁获取地理位置，请设置false
        onSuccess: function (result) {
            //存储当前位置的经纬度
            sessionStorage.setItem('locationsLng', result.longitude);
            sessionStorage.setItem('locationsLat', result.latitude);
            //定位坐标转换
            const coordtransform = require('coordtransform')
            var item_point = coordtransform.gcj02tobd09(sessionStorage.getItem('locationsLng'), sessionStorage.getItem('locationsLat'));//当前为数组
            //展示页面
            //初始化加载图片
            $(".car_location img").attr("src", require("../image/mapfg.png"));
            $(".car_icon img").attr("src", require("../image/carlocation.png"));
            //选择定位弹框图片加载
            $(".qubelocation img").attr("src", require("../image/qubelocation2.png"));//车机icon
            $(".locationnet img").attr("src", require("../image/locationnet2.png"));//当前网点icon
            $(".coating img").attr("src", require("../image/coating2.png"));//涂强icon
            $(".coating_icon img").attr("src", require("../image/coating.png"));//涂强icon
            $(".btn-box").removeClass("none");
            $(".refurepage-icon").removeClass("none");
            $(".navigation").removeClass("none");
            $(".car_location").removeClass("none");
            $(".car_icon").removeClass("none");
            $(".coating_icon").removeClass("none");
            var _car_info;
            var _lng,
                _lat,//定义当前车辆位置的经纬度
                branch_lng,//定义当前网点位置的经纬度
                branch_lat,
                _lngjimi,//涂强的经纬度
                _latjimi;
            var result = getQueryString("name");
            if (result) {
                _car_info = result;
            }

            var point_icon = new BMap.Icon(require('../image/point_icon.png'), new BMap.Size(35, 40), {
                anchor: new BMap.Size(17, 40),
                imageSize: new BMap.Size(35, 40)
            });
            var point_iconcar = new BMap.Icon(require('../image/caricon.png'), new BMap.Size(35, 40), {
                anchor: new BMap.Size(17, 40),
                imageSize: new BMap.Size(35, 40)
            });
            var car_blue_icon = new BMap.Icon(require('../image/icon_car_blue.png'), new BMap.Size(36, 36), {
                anchor: new BMap.Size(18, 18),
                imageSize: new BMap.Size(36, 36)
            });//涂强图标
            show();
            function show() {
                $.post(getApiUrl("car/place"), {
                    car_info: _car_info,
                    mobile: sessionStorage.getItem("mobile") || FoundationTools.getCookie("mobile")
                }, function (result) {
                    loading.destroy()//清除loading
                    var _plate = result.data.plate;
                    _lng = result.data.lng;
                    _lat = result.data.lat;
                    branch_lng = result.data.branch_lng;
                    branch_lat = result.data.branch_lat;
                    if (result.data.jimi.length != 0) {
                        _lngjimi = result.data.jimi[0].lng,
                            _latjimi = result.data.jimi[0].lat;
                    } else {
                        _lngjimi = _lng,
                            _latjimi = _lat;
                    }
                    var gpsPoint = new BMap.Point(coordtransform.gcj02tobd09(_lng, _lat)[0], coordtransform.gcj02tobd09(_lng, _lat)[1]);
                    var points = [];
                    result.data.branch.forEach(function (item) {
                        points.push(new BMap.Point(item.lng, item.lat))
                    })
                    var points2 = []
                    result.data.jimi.forEach(function (item) {
                        points2.push(new BMap.Point(item.lng, item.lat))
                    })
                    // 百度地图API功能
                    var map = new BMap.Map("mapWarp");
                    map.centerAndZoom(gpsPoint, 13);
                    map.setCurrentCity("北京");
                    map.enableScrollWheelZoom(true);
                    var convertor = new BMap.Convertor();
                    var pointArr = [];
                    pointArr.push(new BMap.Point(_lng, _lat));
                    pointArr = pointArr.concat(points);
                    convertor.translate(pointArr, 3, 5, function (data) {
                        if (data.status === 0) {
                            data.points.forEach(function (item, index) {
                                var marker;
                                if (index < 1) {
                                    marker = new BMap.Marker(item, {
                                        icon: point_iconcar
                                    })
                                    marker.setZIndex(10)
                                } else {
                                    marker = new BMap.Marker(item, {
                                        icon: point_icon
                                    })
                                    var label = new BMap.Label(result.data.branch[index - 1].name, {
                                        offset: new BMap.Size(0, -20)
                                    })
                                    marker.setLabel(label)
                                }
                                map.addOverlay(marker)
                            })
                        }
                    });
                    if (points2.length > 0) {
                        convertor.translate(points2, 3, 5, function (data) {
                            if (data.status === 0) {
                                data.points.forEach(function (item) {
                                    var marker;
                                    marker = new BMap.Marker(item, {
                                        icon: car_blue_icon
                                    })
                                    map.addOverlay(marker)
                                })
                            }
                        })
                    }
                    //导航
                    var driving;
                    AMap.plugin(["AMap.Driving"], function () {
                        var drivingOption = {
                            policy: AMap.DrivingPolicy.LEAST_TIME,
                            map: ''
                        };
                        driving = new AMap.Driving(drivingOption); //构造驾车导航类

                    });
                    //根据起终点坐标规划驾车路线
                    function navigation(_lng, _lat) {
                        driving.search(
                            [sessionStorage.getItem('locationsLng'), sessionStorage.getItem('locationsLat')], [_lng, _lat],
                            function (status, result) {
                                driving.searchOnAMAP({
                                    origin: result.origin,
                                    destination: result.destination
                                });
                            });
                    };
                    //车机导航
                    $(".qubelocation").on("click", function () {
                        navigation(_lng, _lat)
                    });
                    //涂强导航
                    $(".coating").on("click", function () {
                        navigation(_lngjimi, _latjimi)
                    });
                    //当前网点导航
                    $(".locationnet").on("click", function () {
                        navigation(branch_lng, branch_lat)
                    });
                    //点击车辆当前位置图标
                    $(".car_icon").on("click", function () {
                        let gpsPoint = new BMap.Point(coordtransform.gcj02tobd09(_lng, _lat)[0], coordtransform.gcj02tobd09(_lng, _lat)[1]);
                        map.panTo(gpsPoint);
                    });
                    //点击定位图标
                    $(".car_location").on("click", function () {
                        let pointR = new BMap.Point(item_point[0], item_point[1]);
                        let mk = new BMap.Marker(pointR);
                        map.addOverlay(mk);
                        map.panTo(pointR);
                    });
                    //点击涂强定位图标
                    $(".coating_icon").on("click", function () {
                        let pointRjimi = new BMap.Point(coordtransform.gcj02tobd09(_lngjimi, _latjimi)[0], coordtransform.gcj02tobd09(_lngjimi, _latjimi)[1]);
                        map.panTo(pointRjimi);
                    });
                })
            }

            //接收url参数
            function getQueryString(name) {
                var reg = new RegExp('(?:(?:&|\\?)' + name + '=([^&]*))|(?:/' + name + '/([^/]*))', 'i');
                var r = window.location.href.match(reg);
                if (r != null)
                    return decodeURI(r[1] || r[2]);
                return null;
            }
        },
        onFail: function (err) {
            console.log(err);
        }
    });
});
//刷新页面
$(".refurepage-icon").on("click", function () {
    window.location.reload();
});
//打开导航定位弹框
$(".navigation").on("click", function () {
    $(".alert_window").removeClass("none");
});
//关闭弹框
$(".alert_window").on("click", function () {
    $(this).addClass("none");
});
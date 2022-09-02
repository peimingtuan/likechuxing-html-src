/**
 * Created by Administrator on 2018/5/28.
 */
require('../css/public.css')
require('../css/carNetstock/netlocation.css')
import $ from 'jquery'
import FoundationTools from '../js/functionAjax'
import getApiUrl from '../js/getApiUrl'
import {Confirm,Toast} from '../common/LikeAlert/index'
import ddTalk from '../js/ddTalk'
import Loading from '../../../../component/loading'
import ddConfigs from '../js/ddConfigs'
ddConfigs.config();//钉钉授权
//验证页面是否在钉钉浏览器打开
ddTalk.verify(navigator.userAgent);
var branch_id = FoundationTools.getUrlParam('branch_id');//网点id
var loading = new Loading()//加载loading
//初始化加载图片
$(".current_location img").attr("src", require("../image/mapfg.png"));//定位icon
$(".refure-page img").attr("src",require("../image/refre-icon.png"));//刷新
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
            var map = new AMap.Map('container-map', {
                resizeEnable: true,
                zoom: 13,
                center: [sessionStorage.getItem('locationsLng'), sessionStorage.getItem('locationsLat')]
            });
            var marker = new AMap.Marker({
                position: [sessionStorage.getItem('locationsLng'), sessionStorage.getItem('locationsLat')],//marker所在的位置
                offset: new AMap.Pixel(-12.5, -50),
                icon: new AMap.Icon({
                    size: new AMap.Size(25, 50),  //图标大小
                    image: require("../image/location.png"),
                    imageSize: new AMap.Size(25, 50)
                }),
                map: map//创建时直接赋予map属性
            });
            //初始化加载数据
            var param = {
                mobile: sessionStorage.getItem("mobile"),
                branch_id: branch_id,//网点id
                PhoneInfo: sessionStorage.getItem("PhoneInfo") || ''
            }
            $.post(getApiUrl('/branch-car-stock/branch-info'), param, function (data) {
                let str = '';
                if (data.status == '0') {
                    loading.destroy()//清除loading
                    if (data.data.biz_type == '0') {
                        str += '<div class="marker-route marker-marker-bus-from"><div class="div1"><span class="span1">' + data.data.current_counts + '</span><span class="span2">' + data.data.over_counts + '</span></div></div>';
                    } else {
                        str += '<div class="marker-route2 marker-marker-bus-from2"><div class="div1"><span class="span1">' + data.data.current_counts + '</span><span class="span2">' + data.data.over_counts + '</span></div></div>';
                    }
                    let marker = new AMap.Marker({
                        position: [data.data.lng, data.data.lat],//marker所在的位置
                        offset: new AMap.Pixel(-20.5, -48),
                        content: str,   //自定义点标记覆盖物内容
                        map: map//创建时直接赋予map属性
                    });
                    //地图移动到该网点
                    map.panTo([data.data.lng, data.data.lat]);
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
                    $(".navigation-net").on("click", function () {
                        driving.search(
                            [sessionStorage.getItem('locationsLng'), sessionStorage.getItem('locationsLat')], [data.data.lng, data.data.lat],
                            function (status, result) {
                                driving.searchOnAMAP({
                                    origin: result.origin,
                                    destination: result.destination
                                });
                            });
                    });
                    //定位
                    $(".current_location").on("click", function () {
                        map.panTo([sessionStorage.getItem('locationsLng'), sessionStorage.getItem('locationsLat')]);
                    });
                } else {
                    new Toast(data.msg);
                }
            });
        },
        onFail: function (err) {
            console.log(err);
        }
    });
});
//刷新页面
$(".refure-page").on("click", function () {
    window.location.reload();
});

//返回
$(".netlocation-bottom button").on("click", function () {
    window.history.back();
});
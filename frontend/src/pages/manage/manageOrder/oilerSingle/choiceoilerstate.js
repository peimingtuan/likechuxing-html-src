/**
 * Created by Administrator on 2017/12/26.
 */

require('../css/public.css')
require('../css/oilerSingle/choiceoilerstate.css')
import $ from 'jquery'
import FoundationTools from '../js/functionAjax'
import getApiUrl from '../js/getApiUrl'
import myAjax from '../common/myAjax/withJq.js'
import {Confirm,Toast} from '../common/LikeAlert/index'
import waterMark from '../../../../../other_modules/like-manageOrder/waterMark'
//import ddTalk from '../js/ddTalk'
import Loading from '../../../../component/loading'
//验证页面是否在钉钉浏览器打开
//ddTalk.verify(navigator.userAgent);
//初始化加载图片
$(".refure-operation img").attr("src", require("../image/refre-icon.png"));
var loading = new Loading()//加载loading
//获取钉钉授权
import ddConfigs from '../js/ddConfigs'
ddConfigs.config()
dd.error(function (error) {
    new Toast("钉钉授权验证失败，请关闭页面重新打开")
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
            //创建高德地图
            var map = new AMap.Map('container', {
                resizeEnable: true,
                zoom: 13,
                center: [sessionStorage.getItem('locationsLng'), sessionStorage.getItem('locationsLat')]
                //center: [116.405467, 39.907761]
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
            AMap.service('AMap.PlaceSearch', function () {//回调函数
                //实例化PlaceSearch
                placeSearch = new AMap.PlaceSearch();
            })

            var placeSearch = new AMap.PlaceSearch({ //构造地点查询类
                pageSize: 50,
                pageIndex: 1,
                map: map,
                city: ""//城市
            });
            placeSearch.searchNearBy("加油站", [sessionStorage.getItem('locationsLng'), sessionStorage.getItem('locationsLat')], 5000, function (status, result) {
                loading.destroy()//清除loading
                if (status === 'complete' && result.info === 'OK') {
                    console.log(result);
                }
                if (result.poiList.pois.length == '0') {
                    new Toast("附近五公里没有加油站")
                }
            });
            //marker点击事件
            AMap.event.addListener(placeSearch, "markerClick", function (e) {
                $(".netpoint").text(e.data.name);
                $(".editrefueling-bottom button").addClass("editrefueling-button");
                sessionStorage.setItem("oilerstationLat", e.data.location.lat);
                sessionStorage.setItem("oilerstationLng", e.data.location.lng);
                sessionStorage.setItem("address", e.data.address);
            });
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
            $(".editrefueling-top .navigation").on("click", function () {
                if ($(".editrefueling-top .netpoint").text() == '请在地图内选择加油站') {
                    new Toast("请先在地图内选择加油站")
                } else {
                    driving.search(
                        [sessionStorage.getItem('locationsLng'), sessionStorage.getItem('locationsLat')], [sessionStorage.getItem("oilerstationLng"), sessionStorage.getItem("oilerstationLat")],
                        function (status, result) {
                            driving.searchOnAMAP({
                                origin: result.origin,
                                destination: result.destination
                            });
                        });
                }
            });
            //提交
            $(".editrefueling-bottom button").on("click", function () {
                if ($(".netpoint").text() != '请在地图内选择加油站') {
                    FoundationTools.setCookie("oilername",$(".netpoint").text(),1);//存储选择的加油站
                    window.location.href = "./editrefueling.html?oilername=1";
                }
            });
        },
        onFail: function (err) {
            console.log(err);
        }
    });
});
//刷新页面
$(".refure-operation").on("click", function () {
    window.location.reload();
});
/**
 * Created by Administrator on 2018/1/7.
 */
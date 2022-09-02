/**
 * Created by Administrator on 2018/5/30.
 */
/**
 * Created by Administrator on 2018/5/28.
 */
/**
 * Created by Administrator on 2017/12/26.
 */
require('../css/public.css')
require('../css/destineCar/destinemap.css')
import $ from 'jquery'
import FoundationTools from '../js/functionAjax'
import getApiUrl from '../js/getApiUrl'
import {Confirm,Toast} from '../common/LikeAlert/index'
import ddTalk from '../js/ddTalk'
import Loading from '../../../../component/loading'
//验证页面是否在钉钉浏览器打开
ddTalk.verify(navigator.userAgent);
import ddConfigs from '../js/ddConfigs'
ddConfigs.config();//钉钉授权
//初始化加载图片
$(".current_location2 img").attr("src", require("../image/mapfg.png"));//定位icon
$(".refure-dispatchpage img").attr("src", require("../image/refre-icon.png"));//刷新
$(".navition-bottom .right img").attr("src", require('../image/dispatch/navition-icon.png'));
var loading = new Loading()//加载loading
dd.error(function (error) {
    new Toast("钉钉授权验证失败，请关闭页面重新打开")
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
            var map = new AMap.Map('dispatch-map', {
                resizeEnable: true,
                zoom: 13,
                center: [sessionStorage.getItem('locationsLng'), sessionStorage.getItem('locationsLat')]
            });

            //初始化加载数据
            var param = {
                mobile: sessionStorage.getItem("mobile"),
                lng: sessionStorage.getItem('locationsLng'),
                lat: sessionStorage.getItem('locationsLat'),
                PhoneInfo: sessionStorage.getItem("PhoneInfo") || ''
            }
            var Array = [],
                smallicon = [],//存放小图标
                bigicon = [];//存放大图标
            AMapUI.loadUI(['misc/PositionPicker'], function (PositionPicker) {
                var positionPicker = new PositionPicker({
                    position: [sessionStorage.getItem('locationsLng'), sessionStorage.getItem('locationsLat')],
                    mode: 'dragMap',//设定为拖拽地图模式，可选'dragMap'、'dragMarker'，默认为'dragMap'
                    iconStyle: {//自定义外观
                        url: require("../image/location.png"),//图片地址
                        size: [25, 50],  //要显示的点大小，将缩放图片
                        ancher: [12.5, 50],//锚点的位置，即被size缩放之后，图片的什么位置作为选中的位置
                    },
                    map: map
                });
                positionPicker.on('success', function (positionResult) {
                    param.lng = positionResult.position.lng;
                    param.lat = positionResult.position.lat;
                    netshow(param)
                });
                positionPicker.start();
            });

            function netshow(param) {
                $.post(getApiUrl('/limit-line/map-booking'), param, function (data) {
                    let result = data.data;
                    if (data.status == '0') {
                        // 使用clearMap方法删除所有覆盖物
                        map.clearMap();
                        Array = [];
                        smallicon = [];
                        bigicon = [];
                        loading.destroy()//清除loading
                        if (result.length != '0') {
                            $(".navition-bottom").addClass("none");
                            for (var i = 0; i < result.length; i++) {
                                let netpoint = [result[i].lng, result[i].lat];//当前网点位置信息
                                Array.push(netpoint);
                                addMarker(netpoint, result[i].biz_type, result[i].branch_id, result[i].name, result[i].address, result[i].booking_num, result[i].complete_num, result[i].car_change);//小图标
                                addMarkerbig(netpoint, result[i].biz_type, result[i].booking_num, result[i].complete_num, result[i].car_change);//大图标
                            }
                            //map.setFitView();
                        } else {
                            new Toast("附近五公里内没有停车网点");
                            $(".navition-bottom").addClass("none");
                        }
                    } else {
                        new Toast(data.msg);
                    }
                    // 编写自定义函数,创建小图标标注
                    function addMarker(netpoint, biz_type, net_id, branch_name, address, booking_num, complete_num, car_change) {
                        let classtype = '';
                        if (biz_type == '0') {//合作网点
                            classtype = 'marker-route2';
                        } else {//非合作网点
                            classtype = 'marker-route';
                        }
                        let marker = new AMap.Marker({
                            position: netpoint,
                            offset: new AMap.Pixel(-20.5, -48),
                            content: '<div class="' + classtype + ' marker-marker-bus-from"><div class="div1"><span class="span1">' + booking_num + '</span><span class="span2">' + complete_num + '</span><span class="span3">' + car_change + '</span></div></div>',   //自定义点标记覆盖物内容
                            map: map//创建时直接赋予map属性
                        });
                        smallicon.push(marker);//存放小图标
                        marker.on('touchend', function () {
                            for (let j = 0, len = smallicon.length; j < len; j++) {
                                smallicon[j].show();
                            }
                            let that = this;
                            that.hide();
                            let index = smallicon.indexOf(that);
                            for (let i = 0, len = smallicon.length; i < len; i++) {
                                bigicon[i].hide();
                            }
                            bigicon[index].show();
                            $(".navition-bottom .net").text(branch_name);
                            $(".navition-bottom .net_id").val(net_id);
                            $(".navition-bottom .biz_type").val(biz_type);
                            $(".navition-bottom .address").text(address);
                            $(".navition-bottom .lng").val(netpoint[0]);
                            $(".navition-bottom .lat").val(netpoint[1]);
                            $(".navition-bottom").removeClass("none");
                        });
                    }

                    // 编写自定义函数,创建大图标标注
                    function addMarkerbig(netpoint, biz_type, booking_num, complete_num, car_change) {
                        let classtype = '';
                        if (biz_type == '0') {//合作网点
                            classtype = 'bigmarker-route2';
                        } else {//非合作网点
                            classtype = 'bigmarker-route';
                        }
                        let marker2 = new AMap.Marker({
                            position: netpoint,
                            offset: new AMap.Pixel(-20.5, -48),
                            content: '<div class="' + classtype + ' marker-marker-bus-from"><div class="div1"><span class="span1">' + booking_num + '</span><span class="span2">' + complete_num + '</span><span class="span3">' + car_change + '</span></div></div>',   //自定义点标记覆盖物内容
                            map: map//创建时直接赋予map属性
                        });
                        bigicon.push(marker2);//存放大图标
                        marker2.hide();
                        marker2.on('click', function () {

                        });
                    }
                });
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
            $(".navition-icon").on("click", function () {
                driving.search(
                    [sessionStorage.getItem('locationsLng'), sessionStorage.getItem('locationsLat')], [$(this).parent().find(".lng").val(), $(this).parent().find(".lat").val()],
                    function (status, result) {
                        driving.searchOnAMAP({
                            origin: result.origin,
                            destination: result.destination
                        });
                    });
            });
            //定位
            $(".current_location2").on("click", function () {
                map.panTo([sessionStorage.getItem('locationsLng'), sessionStorage.getItem('locationsLat')]);
            });
            //跳转网点车辆详情页
            $(".navition-bottom .net").on("click", function () {
                location.href = "./netdestinedetail.html?branch_id=" + $(this).parent().find(".net_id").val() + "&lng=" + $(this).parent().siblings(".right").find(".lng").val() + "&lat=" + $(this).parent().siblings(".right").find(".lat").val() +"&biz_type="+$(this).parent().find(".biz_type").val()+"&address=" + $(this).parent().find(".address").text();
            });
        },
        onFail: function (err) {
            new Toast("获取当前定位失败")
        }
    });
});

//跳转搜索网点页面
$(".dispatch-search").on("click", function () {
    location.href = "../carNetstock/netselect.html?type=3a";
});

//刷新页面
$(".refure-dispatchpage").on("click", function () {
    window.location.reload();
});

//返回(暂时隐藏)
$(".netdispatch-bottom button").on("click", function () {
    window.history.back();
});
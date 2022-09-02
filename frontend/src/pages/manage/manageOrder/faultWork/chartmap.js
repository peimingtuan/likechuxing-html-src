require('../css/public.css')
require('../css/faultWork/chargemap.css')
import $ from 'jquery'
import FoundationTools from '../js/functionAjax'
import getApiUrl from '../js/getApiUrl'
import myAjax from '../common/myAjax/withJq.js'
import {Confirm,Toast} from '../common/LikeAlert/index'
import ddTalk from '../js/ddTalk'
import Loading from '../../../../component/loading'
//验证页面是否在钉钉浏览器打开
//ddTalk.verify(navigator.userAgent);
import ddConfigs from '../js/ddConfigs'
ddConfigs.config();//钉钉授权
//初始化加载图片
$(".current_location2 img").attr("src", require("../image/mapfg.png"));//定位icon
$(".refure-chartmap img").attr("src", require("../image/refre-icon.png"));//刷新
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
            var map = new AMap.Map('chartmap-map', {
                resizeEnable: true,
                zoom: 10,
                center: [sessionStorage.getItem('locationsLng'), sessionStorage.getItem('locationsLat')]
            });
            if (!isSupportCanvas()) {
                new Toast('热力图仅对支持canvas的浏览器适用,您所使用的浏览器不能使用热力图功能,请换个浏览器试试~')
            }

            var heatData = [],//存储热力图数据
                smallicon = [],//存放小图标
                bigicon = [];//存放大图标
            var heatmap;
            myAjax.post(getApiUrl('/vehicle-fault/heat-map'), {
                mobile: sessionStorage.getItem("mobile"),
                lng: sessionStorage.getItem('locationsLng'),
                lat: sessionStorage.getItem('locationsLat')
            }, function (data) {
                if (data.status == '0') {
                    loading.destroy()//清除loading
                    if (data.data.length == 0) {
                        new Toast("暂无网点信息");
                    } else {
                        for (var i = 0; i < data.data.length; i++) {
                            let json = {
                                lng: data.data[i].lng,
                                lat: data.data[i].lat,
                                count: data.data[i].num
                            }
                            heatData.push(json);
                            let netpoint = [data.data[i].lng, data.data[i].lat];//当前网点位置信息
                            addMarker(netpoint, data.data[i].num, data.data[i].biz_type)
                            addMarkerbig(netpoint, data.data[i].num, data.data[i].biz_type)
                        }
                        //console.log(heatData)
                        //console.log(heatmapData)
                        //详细的参数,可以查看heatmap.js的文档 http://www.patrick-wied.at/static/heatmapjs/docs.html
                        //参数说明如下:
                        /* visible 热力图是否显示,默认为true
                         * opacity 热力图的透明度,分别对应heatmap.js的minOpacity和maxOpacity
                         * radius 势力图的每个点的半径大小
                         * gradient  {JSON} 热力图的渐变区间 . gradient如下所示
                         *	{
                         .2:'rgb(0, 255, 255)',
                         .5:'rgb(0, 110, 255)',
                         .8:'rgb(100, 0, 255)'
                         }
                         其中 key 表示插值的位置, 0-1
                         value 为颜色值
                         */

                        map.plugin(["AMap.Heatmap"], function () {
                            //初始化heatmap对象
                            heatmap = new AMap.Heatmap(map, {
                                radius: 25, //给定半径
                                opacity: [0, 0.8],
                                gradient: {
                                    0.4: '#824dcf',//紫色
                                    0.5: '#384adb',//靓
                                    0.65: '#8ae3e5',//蓝
                                    0.7: '#83e284',//绿
                                    0.8: '#e3e079',//黄
                                    0.9: '#d98046',//橙
                                    1.0: '#d73a3b'//红
                                }
                            });
                            //设置数据集：该数据为故障车辆网点数据
                            heatmap.setDataSet({
                                //data: heatmapData,
                                data: heatData,
                                max: 100
                            });
                        });
                    }
                } else {
                    new Toast(data.msg)
                }
            });
            // 编写自定义函数,创建小图标标注
            function addMarker(netpoint, num, biz_type) {
                let classtype = '';
                if (biz_type == '0') {//合作网点
                    classtype = 'marker-route2';
                } else {//非合作网点
                    classtype = 'marker-route';
                }
                let marker = new AMap.Marker({
                    position: netpoint,
                    offset: new AMap.Pixel(-20.5, -48),
                    content: '<div class="' + classtype + ' marker-marker-bus-from"><div class="div1"><span class="span1">' + num + '</span></div></div>',   //自定义点标记覆盖物内容
                    map: map//创建时直接赋予map属性
                });
                marker.hide();
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
                });
            }

            // 编写自定义函数,创建大图标标注
            function addMarkerbig(netpoint, num, biz_type) {
                let classtype = '';
                if (biz_type == '0') {//合作网点
                    classtype = 'bigmarker-route2';
                } else {//非合作网点
                    classtype = 'bigmarker-route';
                }
                let marker2 = new AMap.Marker({
                    position: netpoint,
                    offset: new AMap.Pixel(-20.5, -48),
                    content: '<div class="' + classtype + ' marker-marker-bus-from"><div class="div1"><span class="span1">' + num + '</span></div></div>',   //自定义点标记覆盖物内容
                    map: map//创建时直接赋予map属性
                });
                bigicon.push(marker2);//存放大图标
                marker2.hide();
                marker2.on('click', function () {

                });
            }

            //判断浏览区是否支持canvas
            function isSupportCanvas() {
                var elem = document.createElement('canvas');
                return !!(elem.getContext && elem.getContext('2d'));
            }

            //显示地图层级与中心点信息
            function logMapinfo() {
                let zoom = map.getZoom(); //获取当前地图级别
                if (zoom < 13) {
                    heatmap.show();
                    for (let j = 0, len = smallicon.length; j < len; j++) {
                        smallicon[j].hide();
                    }
                    for (let i = 0, len = smallicon.length; i < len; i++) {
                        bigicon[i].hide();
                    }
                    $(".chartmap-top").show();
                } else {
                    heatmap.hide();
                    for (let j = 0, len = smallicon.length; j < len; j++) {
                        smallicon[j].show();
                    }
                    //for (let i = 0, len = smallicon.length; i < len; i++) {
                    //    bigicon[i].show();
                    //}
                    $(".chartmap-top").hide();
                }
            };

            //绑定地图移动与缩放事件
            map.on('zoomend', logMapinfo);
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

                });
                positionPicker.start();
            });

            //定位
            $(".current_location2").on("click", function () {
                map.panTo([sessionStorage.getItem('locationsLng'), sessionStorage.getItem('locationsLat')]);
            });
        },
        onFail: function (err) {
            new Toast("获取当前定位失败")
        }
    });
});

//刷新页面
$(".refure-chartmap").on("click", function () {
    window.location.reload();
});

/**
 * Created by Administrator on 2018/9/18.
 */

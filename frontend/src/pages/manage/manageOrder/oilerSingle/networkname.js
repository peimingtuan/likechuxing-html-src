/**
 * Created by Administrator on 2017/12/26.
 */
require('../css/public.css')
require('../css/oilerSingle/networkname.css')
import $ from 'jquery'
import FoundationTools from '../js/functionAjax'
import getApiUrl from '../js/getApiUrl'
import {Confirm,Toast} from '../common/LikeAlert/index'
//import ddTalk from '../js/ddTalk'
import Loading from '../../../../component/loading'
//验证页面是否在钉钉浏览器打开
//ddTalk.verify(navigator.userAgent);
//接收url参数
var type = FoundationTools.getUrlParam('type');//1来自车辆详情更改网点，其他来自加油工单结束选择网点
if (sessionStorage.getItem("deletework") == '0') {
    $(".networkname-toolcar").addClass("none");
    $(".networkname-oiler").addClass("none");
} else {
    $(".networkname-toolcar").removeClass("none");
    $(".networkname-oiler").removeClass("none");
}
//初始化加载图片
$(".refure-operation img").attr("src", require("../image/refre-icon.png"));
var loading = new Loading()//加载loading
//获取钉钉授权
import ddConfigs from '../js/ddConfigs'
ddConfigs.config()
dd.error(function (err) {
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
            //存储当前省市
            sessionStorage.setItem('ddprovince', result.province);//省
            sessionStorage.setItem('ddcity', result.city);//市
            //定位坐标转换
            const coordtransform = require('coordtransform')
            var item_point = coordtransform.gcj02tobd09(sessionStorage.getItem('locationsLng'), sessionStorage.getItem('locationsLat'));//当前为数组
            //初始化地图
            var map = new BMap.Map("container");    // 创建Map实例
            //map.centerAndZoom(new BMap.Point(116.305, 40.0505), 13);
            map.centerAndZoom(new BMap.Point(item_point[0], item_point[1]), 13);  // 初始化地图,设置中心点坐标和地图级别
            map.setCurrentCity("北京");          // 设置地图显示的城市 此项是必须设置的
            map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
            //初始化加载数据
            var param = {
                mobile: sessionStorage.getItem("mobile"),
                lng: sessionStorage.getItem('locationsLng'),
                lat: sessionStorage.getItem('locationsLat'),
                province_name: sessionStorage.getItem('ddprovince'),//省
                city_name: sessionStorage.getItem('ddcity'),//市
                PhoneInfo: sessionStorage.getItem("PhoneInfo") || ''
            }
            //var pointR = new BMap.Point(116.305, 40.0505);
            var pointR = new BMap.Point(item_point[0], item_point[1]);
            var mk = new BMap.Marker(pointR);
            map.addOverlay(mk);
            //获取已选择的加油站信息
            var paramoiler = {
                mobile: sessionStorage.getItem("mobile"),
                work_order_id: sessionStorage.getItem('id'), //工单id
                PhoneInfo: sessionStorage.getItem("PhoneInfo") || ''
            }
            var nozzleaddress='/work-order/select-branch';
            if(type=='1'){//1来自车辆详情更改网点，其他来自加油工单结束选择网点
                nozzleaddress='work-order/branch-info';
            }
            $.post(getApiUrl(nozzleaddress), param, function (data) {
                var result = data,
                    status = result.status,
                    msg = result.msg,
                    data = result.data,
                    Array = [],
                    smallicon = [],//存放小图标
                    bigicon = [],//存放大图标
                    img = '';
                if (status == '0') {
                    loading.destroy()//清除loading
                    if (data.length != '0') {
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].biz_type == '0') {
                                if (data[i].car_num < 10) {
                                    if (data[i].area == '1') {//广州限行区域内
                                        img = require('../image/trafficlike/' + data[i].car_num + '.png')
                                    } else {
                                        img = require('../image/like/' + data[i].car_num + '.png')
                                    }
                                } else {
                                    if (data[i].area == '1') {//广州限行区域内
                                        img = require('../image/trafficlike/10.png');
                                    } else {
                                        img = require('../image/like/10.png');
                                    }
                                }
                            } else {
                                if (data[i].car_num < 10) {
                                    if (data[i].area == '1') {//广州限行区域内
                                        img = require('../image/trafficlikereturn/' + data[i].car_num + '.png')
                                    } else {
                                        img = require('../image/likereturn/' + data[i].car_num + '.png')
                                    }
                                } else {
                                    if (data[i].area == '1') {//广州限行区域内
                                        img = require('../image/trafficlikereturn/10.png');
                                    } else {
                                        img = require('../image/likereturn/10.png');
                                    }
                                }
                            }
                            //创建like小图标
                            var myIcon = new BMap.Icon(img, new BMap.Size(41, 48), {
                                imageSize: new BMap.Size(41, 48),
                                anchor: new BMap.Size(20, 42),
                            });
                            //创建like大图标
                            var myIconbig = new BMap.Icon(img, new BMap.Size(50, 60), {
                                imageSize: new BMap.Size(50, 60),
                                anchor: new BMap.Size(20, 42),
                            });
                            var pointnavigation = [data[i].lng, data[i].lat];//当前网点位置信息
                            var point = new BMap.Point(coordtransform.gcj02tobd09(data[i].lng, data[i].lat)[0], coordtransform.gcj02tobd09(data[i].lng, data[i].lat)[1]);
                            Array.push(point);
                            addMarker(pointnavigation, point, data[i].branch_id, data[i].name, data[i].choice_floor);
                            addMarkerbig(point)
                        }
                        map.setViewport(Array);
                    } else {
                        new Toast("附近五公里内没有停车网点")
                    }
                } else {
                    new Toast(msg);
                }
                // 编写自定义函数,创建小图标标注
                function addMarker(pointnavigation, point, branch_id, name, choicefloor) {
                    var marker = new BMap.Marker(point, {icon: myIcon});// 创建标注
                    smallicon.push(marker);//存放小图标
                    map.addOverlay(marker);// 将标注添加到地图中
                    marker.addEventListener('click', function () {
                        $(".networkname-toolcar input").prop("checked", false);//工具车取消选中
                        //保存当前网点位置信息
                        sessionStorage.setItem("navigationlng", pointnavigation[0]);
                        sessionStorage.setItem("navigationlat", pointnavigation[1]);
                        let that = this;
                        sessionStorage.setItem('branch_id', branch_id);
                        sessionStorage.setItem('branch_types', 1);
                        sessionStorage.setItem('choicefloor', choicefloor.toString());
                        $(".netpoint").text(name);
                        $(".networkname-bottom button").addClass("networkname-button");
                        smallicon.forEach(function (item) {
                            item.show()
                        })
                        that.hide();
                        var index = smallicon.indexOf(that);
                        bigicon.forEach(function (item) {
                            item.hide()
                        })
                        bigicon[index].show();
                    })
                }

                // 编写自定义函数,创建大图标标注
                function addMarkerbig(point) {
                    var marker2 = new BMap.Marker(point, {icon: myIconbig});// 创建标注
                    bigicon.push(marker2);//存放大图标
                    map.addOverlay(marker2);// 将标注添加到地图中
                    marker2.hide()
                    marker2.addEventListener('click', function () {

                    })
                }

                //获取加油站信息
                $.post(getApiUrl('/work-order/display-gas'), paramoiler, function (data) {
                    var resultoiler = data;
                    if (resultoiler.status == '0') {
                        //接收参数
                        var name = resultoiler.data.name,//加油站名称
                            branch_id = resultoiler.data.id;//加油站网点id
                        var pointnavigation = [resultoiler.data.lng, resultoiler.data.lat];//当前加油站位置信息
                        var point = new BMap.Point(coordtransform.gcj02tobd09(resultoiler.data.lng, resultoiler.data.lat)[0], coordtransform.gcj02tobd09(resultoiler.data.lng, resultoiler.data.lat)[1]);//获取加油站经纬度
                        //创建加油站图标
                        var myIconoiler = new BMap.Icon(require('../image/bigicon.png'), new BMap.Size(41, 48), {
                            imageSize: new BMap.Size(41, 48),
                            anchor: new BMap.Size(20, 42),
                        });
                        var markeroiler = new BMap.Marker(point, {icon: myIconoiler});// 创建标注
                        map.addOverlay(markeroiler);// 将标注添加到地图中
                        markeroiler.hide();
                        $(".networkname-oiler input").on("click", function () {
                            if ($(this).is(':checked')) {
                                //保存当前加油站位置信息
                                sessionStorage.setItem("navigationlng", pointnavigation[0]);
                                sessionStorage.setItem("navigationlat", pointnavigation[1]);
                                $(".networkname-toolcar input").prop("checked", false);//工具车取消选中
                                markeroiler.show();
                                map.panTo(point);
                                //隐藏网点
                                smallicon.forEach(function (item) {
                                    item.hide()
                                });
                                bigicon.forEach(function (item) {
                                    item.hide()
                                });
                                sessionStorage.setItem('branch_id', branch_id);
                                sessionStorage.setItem('branch_types', 2);
                                $(".netpoint").text(name);
                                $(".networkname-bottom button").addClass("networkname-button");
                            } else {
                                markeroiler.hide();
                                map.panTo(pointR);
                                //显示网点
                                smallicon.forEach(function (item) {
                                    item.show()
                                });
                                $(".netpoint").text('请在地图内选择网点或搜索网点');
                                $(".networkname-bottom button").removeClass("networkname-button");
                            }
                        })
                        //工具车被选中
                        $(".networkname-toolcar input").on("click", function () {
                            $(".networkname-oiler input").prop("checked", false);
                            smallicon.forEach(function (item) {
                                item.show()
                            });
                            bigicon.forEach(function (item) {
                                item.hide()
                            });
                            markeroiler.hide();
                            map.panTo(pointR);
                            $(".netpoint").text('工具车');
                            $(".networkname-bottom button").addClass("networkname-button");
                        });
                    }
                });
            });
            //跳转搜索网点页面
            $(".networkname-top .icon").on("click", function () {
                if (type == 1) {
                    window.location.href = "../carNetstock/netselect.html?type=5";
                } else {
                    window.location.href = "./searchnetwork.html";
                }
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
            $(".networkname-top .navigation").on("click", function () {
                if ($(".networkname-top .netpoint").text() == '请在地图内选择网点或搜索网点' || $(".networkname-top .netpoint").text() == "工具车") {
                    new Toast("请先在地图内选择网点")
                } else {
                    driving.search(
                        [sessionStorage.getItem('locationsLng'), sessionStorage.getItem('locationsLat')], [sessionStorage.getItem("navigationlng"), sessionStorage.getItem("navigationlat")],
                        function (status, result) {
                            driving.searchOnAMAP({
                                origin: result.origin,
                                destination: result.destination
                            });
                        });
                }
            });
            //提交
            $(".networkname-bottom button").on("click", function () {
                if ($(this).hasClass("networkname-button")) {
                    if (sessionStorage.getItem("deletework") == '0') {
                        if (type == 1) {
                            window.location.href = "../commonFile/changenetstatus.html?name=" + $(".netpoint").text();
                        } else {
                            window.location.href = "./deletework.html?name=" + $(".netpoint").text();
                        }
                    } else {
                        window.location.href = "./endworklist.html?name=" + $(".netpoint").text();
                    }
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
/**
 * Created by Administrator on 2018/6/6.
 */
require('../css/public.css')
require('../css/faultWork/faultdetail2.css')
import $ from 'jquery'
import FoundationTools from '../js/functionAjax'
import getApiUrl from '../js/getApiUrl';
import myAjax from '../common/myAjax/withJq.js'
import {Confirm,Toast} from '../common/LikeAlert/index'
import Loading from '../../../../component/loading'
import waterMark from '../../../../../other_modules/like-manageOrder/waterMark'
waterMark({watermark_txt: sessionStorage.getItem('userName') + '-' + sessionStorage.getItem('mobile')});
//获取钉钉授权
import ddConfigs from '../js/ddConfigs'
ddConfigs.config()
//调取钉钉接口
dd.error(function (error) {
    new Toast("钉钉授权验证失败，请关闭页面重新打开")
});
var loading;
//初始加载图片
$(".faultdetail-content .location img").attr("src", require("../image/faultWork/location2.png"));
$(".faultdetail-content .daoh").attr("src", require("../image/faultWork/daohang.png"));
$(".open-show").attr("src", require("../image/faultWork/merge.png"));//更换自配件关闭
var netlng,netlat;
//获取故障工单详情
myAjax.post(getApiUrl('/vehicle-fault/order-detail'), {
    mobile: sessionStorage.getItem('mobile'),
    order_id: sessionStorage.getItem('order_id')//故障工单id
}, function (data) {
    if (data.status == '0') {
        netlng=data.data.branch_lng;
        netlat=data.data.branch_lat;//该网点的经纬度
        if(data.data.step==0){//0未开始
            $(".task").removeClass("none")
            $(".fault-flow .span4").text("待处理");
            $(".status_name").addClass("normal");
            $(".border-color").addClass("border-color2");
        }else if(data.data.step==1){//1处理的第一步
            $(".task2").removeClass("none")
        }
        //展示页面
        $(".body").removeClass("none");
        let strend = data.data.vin.substring(11, 17);
        $(".faultdetail-content .plate_no").html(data.data.plate_no + ' ' + '<font class="font1">(' + strend + ')</font>');//车牌号，Vin
        $(".faultdetail-content .trouble_id").text(data.data.car_status);//车辆状态
        $(".faultdetail-content .status_name").text(data.data.status_name);//状态
        $(".faultdetail-content .remain_km").text('约续航' + data.data.remain + '公里');//续航里程
        $(".faultdetail-content .brand_name").text(data.data.brand_name + ' ' + data.data.model_name);//车辆品牌
        if (data.data.biz_type == '0') {
            $(".faultdetail-content .mapb").attr("src", require('../image/mapb.png'));
        } else if (data.data.biz_type == '1') {
            $(".faultdetail-content .mapb").attr("src", require('../image/map-B.png'));
        } else if (data.data.biz_type == '2') {
            $(".faultdetail-content .mapb").attr("src", require('../image/mapoiler.png'));
        }
        $(".branch_addr").text(data.data.branch_name);//停车位置
        //新增上报故障类型，备注信息展示
        $(".troule-type").text('上报类型：' + data.data.up_type_name + '-' + data.data.up_cate_name);
        if(data.data.remark!=''){
            $(".trouble-remark").text('备注：' + data.data.remark);
        }

        //新增去往车辆当前位置
        $(".faultdetail-content .location").on("click",function(){
            location.href = "../oilerSingle/carLocation.html?name="+data.data.plate_no;
        });
        //更改网点
        $(".sub-edit-net").on("click",function(){
            window.location.href = "../commonFile/changenetstatus.html?plate_no=" + data.data.plate_no + "&branch_name=" + data.data.branch_name + "&floor=" + data.data.parking_floor + "&parking_no=" + data.data.parking_no + "&branch_id=" + data.data.branch_id+"&type=2";
        });
    } else {
        new Toast(data.msg)
    }
});


dd.ready(function () {
    //导航
    var driving;
    AMap.plugin(["AMap.Driving"], function () {
        var drivingOption = {
            policy: AMap.DrivingPolicy.LEAST_TIME,
            map: ''
        };
        driving = new AMap.Driving(drivingOption); //构造驾车导航类

    });
    $(".daoh1").on("click",function(){
        dd.device.geolocation.get({
            targetAccuracy: 200,
            coordinate: 1,
            withReGeocode: false,
            useCache: true, //默认是true，如果需要频繁获取地理位置，请设置false
            onSuccess: function (result) {
                //存储当前位置的经纬度
                sessionStorage.setItem('locationsLng', result.longitude);
                sessionStorage.setItem('locationsLat', result.latitude);
                driving.search(
                    [sessionStorage.getItem('locationsLng'), sessionStorage.getItem('locationsLat')], [netlng,netlat],
                    function (status, result) {
                        driving.searchOnAMAP({
                            origin: result.origin,
                            destination: result.destination
                        });
                    });
            },
            onFail: function (err) {
                new Toast("获取定位失败")
            }
        });
    });

    //开始去处理
    $(".task-top").on("click",function(){
        loading = new Loading()//加载loading
        dd.device.geolocation.get({
            targetAccuracy: 200,
            coordinate: 1,
            withReGeocode: false,
            useCache: true, //默认是true，如果需要频繁获取地理位置，请设置false
            onSuccess: function (result) {
                //存储当前位置的经纬度
                sessionStorage.setItem('locationsLng', result.longitude);
                sessionStorage.setItem('locationsLat', result.latitude);
                // 根据起终点经纬度规划驾车导航路线
                driving.search(new AMap.LngLat(sessionStorage.getItem('locationsLng'),sessionStorage.getItem('locationsLat')), new AMap.LngLat(netlng, netlat), function(status, result) {
                    if (status === 'complete') {
                        myAjax.post(getApiUrl('/vehicle-fault/operate'), {
                            mobile: sessionStorage.getItem('mobile'),
                            item_id:11,//开始去处理
                            order_id: sessionStorage.getItem('order_id'),//故障工单id
                            params:{
                                lng:sessionStorage.getItem('locationsLng'),
                                lat:sessionStorage.getItem('locationsLat'),
                                distance:result.routes[0].distance //驾车距离
                            }
                        }, function (data) {
                            loading.destroy()//清除loading
                            if (data.status == '0') {
                                window.location.reload();
                            }else{
                                new Toast(data.msg)
                            }
                        });
                    } else {
                        loading.destroy()//清除loading
                        new Toast("获取距离失败")
                    }
                });
            },
            onFail: function (err) {
                loading.destroy()//清除loading
                new Toast("获取定位失败")
            }
        });
    });

    //到达网点
    $(".task-top2").on("click",function(){
        loading = new Loading()//加载loading
        dd.device.geolocation.get({
            targetAccuracy: 200,
            coordinate: 1,
            withReGeocode: false,
            useCache: true, //默认是true，如果需要频繁获取地理位置，请设置false
            onSuccess: function (result) {
                //存储当前位置的经纬度
                sessionStorage.setItem('locationsLng', result.longitude);
                sessionStorage.setItem('locationsLat', result.latitude);
                showAjax(0)
                function showAjax(num){
                    myAjax.post(getApiUrl('/vehicle-fault/operate'), {
                        mobile: sessionStorage.getItem('mobile'),
                        item_id:12,//开始去处理
                        order_id: sessionStorage.getItem('order_id'),//故障工单id
                        params:{
                            lng:sessionStorage.getItem('locationsLng'),
                            lat:sessionStorage.getItem('locationsLat'),
                            force:num
                        }
                    }, function (data) {
                        loading.destroy()//清除loading
                        if (data.status == '0') {
                            window.location.href="./faultwork.html";
                        }else if(data.status == '10000') {
                            $(".editremark_window").removeClass("none")
                        }else{
                            new Toast(data.msg)
                        }
                    });
                }

                //继续提交
                $(".add-sunmit").on("click",function(){
                    $(".editremark_window").addClass("none")
                    loading = new Loading()//加载loading
                    showAjax(1)
                });
            },
            onFail: function (err) {
                loading.destroy()//清除loading
                new Toast("获取定位失败")
            }
        });
    });
    //取消
    $(".give-up-edit").on("click",function(){
        $(".editremark_window").addClass("none")
    });
});


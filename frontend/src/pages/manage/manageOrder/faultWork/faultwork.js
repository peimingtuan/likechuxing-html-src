/**
 * Created by Administrator on 2018/6/6.
 */
require('../css/public.css')
require('../css/faultWork/faultwork.css')
import $ from 'jquery'
import FoundationTools from '../js/functionAjax'
import getApiUrl from '../js/getApiUrl';
import myAjax from '../common/myAjax/withJq.js'
import {Confirm,Toast} from '../common/LikeAlert/index'
import waterMark from '../../../../../other_modules/like-manageOrder/waterMark'
waterMark({watermark_txt: sessionStorage.getItem('userName') + '-' + sessionStorage.getItem('mobile')});
//获取钉钉授权
import ddConfigs from '../js/ddConfigs'
ddConfigs.config()
//调取钉钉接口
dd.error(function (error) {
    new Toast("钉钉授权验证失败，请关闭页面重新打开")
});
//初始加载图片
$(".faultwork-content .location img").attr("src", require("../image/faultWork/location2.png"));
$(".faultwork-content .daoh").attr("src", require("../image/faultWork/daohang.png"));
$(".faultwork-bottom img").attr("src", require("../image/faultWork/true.png"));//是否在当前网点
var netlng,netlat;
//获取故障工单车辆详情
myAjax.post(getApiUrl('/vehicle-fault/order-detail'), {
    mobile: sessionStorage.getItem('mobile'),
    order_id: sessionStorage.getItem('order_id')//故障工单id
}, function (data) {
    if (data.status == '0') {
        netlng=data.data.branch_lng;
        netlat=data.data.branch_lat;//该网点的经纬度
        sessionStorage.setItem('car_id',data.data.car_id),//存储车辆id
        //展示页面
        $(".faultwork-content").removeClass("none");
        let strend = data.data.vin.substring(11, 17);
        $(".plate_no").html(data.data.plate_no + ' ' + '<font class="font1">(' + strend + ')</font>');//车牌号，Vin
        $(".trouble_id").text(data.data.car_status);//车辆状态
        $(".status_name").text(data.data.status_name);//工单状态
        $(".remain_km").text('约续航' + data.data.remain + '公里');//续航里程
        $(".brand_name").text(data.data.brand_name + ' ' + data.data.model_name);//车辆品牌
        if (data.data.biz_type == '0') {
            $(".faultwork-content .img1").attr("src", require('../image/mapb.png'));
        } else if (data.data.biz_type == '1') {
            $(".faultwork-content .img1").attr("src", require('../image/map-B.png'));
        } else if (data.data.biz_type == '2') {
            $(".faultwork-content .img1").attr("src", require('../image/mapoiler.png'));
        }
        $(".branch_addr").text(data.data.branch_name);//停车位置
        //新增上报故障类型，备注信息展示
        $(".troule-type").text('上报类型：' + data.data.up_type_name + '-' + data.data.up_cate_name);
        if(data.data.remark!=''){
            $(".trouble-remark").text('备注：' + data.data.remark);
        }

        //新增去往车辆当前位置
        $(".faultwork-content .location").on("click",function(){
            location.href = "../oilerSingle/carLocation.html?name="+data.data.plate_no;
        });
    } else {
        new Toast(data.msg)
    }
});

//是否在当前网点
$(".faultwork-bottom").on("click", ".content", function () {
    let btn = $(this);
    //车辆是否在网点
    $(".faultwork-bottom .content img").addClass("none");
    $(".faultwork-bottom .content").removeClass("bold");
    btn.find("img").removeClass("none");
    btn.addClass("bold");
    if (btn.find("input").val() == '2') {
        $(".virtual-net").removeClass("none");
    } else {
        $(".virtual-net").addClass("none");
        $(".virtualnet-list").addClass("none");
        $(".search-net").val('');
        $(".virtual-netid").val('');
    }
});

//确认
$(".faultwork-nextbtn button").on("click", function () {
    if ($(".faultwork-bottom .content").hasClass("bold")) {
        let param = {
                mobile: sessionStorage.getItem('mobile'),
                order_id: sessionStorage.getItem('order_id'),//故障工单id
                car_id:sessionStorage.getItem('car_id'),//车辆id
                branch_id: '0'
            },
            dotbranch;
        $(".faultwork-bottom .content").each(function () {
            if ($(this).hasClass("bold")) {
                if ($(this).find("input").val() == '2') {//是否在网点1在，2不在
                    if ($(".virtual-netid").val() == '') {
                        dotbranch = 1;
                    } else {
                        param.branch_id = $(".virtual-netid").val();
                    }
                }
                return false;
            }
        });
        if (dotbranch == '1') {
            if ($(".virtual-netid").val() == '') {
                new Toast("请选择车辆当前所在虚拟网点")
                return false;
            }
        }
        myAjax.post(getApiUrl('/vehicle-fault/correct-position'), param, function (data) {//车辆是否在当前网点
            if (data.status == '0') {
                location.href = "./faultdetail.html";
            } else {
                new Toast(data.msg)
            }
        });
    } else {
        new Toast("请勾选车辆是否在当前网点")
    }
});

var virtualarray = [];//存储虚拟网点
//获取所有虚拟网点
myAjax.post(getApiUrl('/vehicle-fault/virtual-branch'), {
    mobile: sessionStorage.getItem("mobile")
}, function (data) {
    if (data.status == '0') {
        virtualarray = data.data;
        let str = '';
        for (var i = 0; i < virtualarray.length; i++) {
            str += '<li><span>' + virtualarray[i].name + '</span><input class="branch_id" type="hidden" value="' + virtualarray[i].id + '"  /></li>';
        }
        $(".virtualnet-list").html(str);
    } else {
        new Toast(data.msg)
    }
});
//模糊查询
var searching = true;
$(".search-net").on("input", function () {
    let value = $(this).val();
    let fellow = /^[\u4e00-\u9fa5]+$/;
    let str = '';
    if (value.length > 0 && fellow.test(value) && searching == true) {
        searching = false;
        $(".virtualnet-list").removeClass("none");
        for (var i = 0; i < virtualarray.length; i++) {
            if (virtualarray[i].name.indexOf(value) != '-1' && virtualarray[i].name != '') {
                str += '<li><span>' + virtualarray[i].name + '</span><input class="branch_id" type="hidden" value="' + virtualarray[i].id + '"  /></li>';
            }
        }
        $(".virtualnet-list").html(str);
        setTimeout(function () {
            searching = true;
        }, 500)
    } else if (value.length == 0) {
        for (var i = 0; i < virtualarray.length; i++) {
            str += '<li><span>' + virtualarray[i].name + '</span><input class="branch_id" type="hidden" value="' + virtualarray[i].id + '"  /></li>';
        }
        $(".virtualnet-list").html(str);
    }
});
//获取当前虚拟网点
$(".virtualnet-list").on("click", "li", function () {
    $(".search-net").val($(this).find("span").text());
    $(".virtual-netid").val($(this).find("input").val());
});

$(".virtual-net .right").on("click", function () {
    $(".virtualnet-list").removeClass("none");
});

//新增故障工单创建人信息
//获取操作历史记录
myAjax.post(getApiUrl('/vehicle-fault/operate-history'), {
    mobile: sessionStorage.getItem('mobile'),
    order_id: sessionStorage.getItem('order_id')//故障工单id
}, function (data) {
    if (data.status == '0') {
        if(data.data.length!=0){
            let str = '<li><span class="span1">' + data.data[data.data.length-1].time + '</span><span class="span2">' + data.data[data.data.length-1].operate + '</span><br/><span class="span3">' + data.data[data.data.length-1].real_name + '</span>' +
                '<span class="span4">(' + data.data[data.data.length-1].user_name + ')</span></li>';
            $(".history-list").html(str);
        }
    } else {
        new Toast(data.msg);
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
});

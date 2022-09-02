/**
 * Created by Administrator on 2017/12/21.
 */
require('../css/public.css')
require('../css/schedulingJob/notfindcar.css')
import $ from 'jquery'
import FoundationTools from '../js/functionAjax'
import getApiUrl from '../js/getApiUrl';
import myAjax from '../common/myAjax/withJq.js'
import {Confirm,Toast} from '../common/LikeAlert/index'
import waterMark from '../../../../../other_modules/like-manageOrder/waterMark'
import ddTalk from '../js/ddTalk'
import Loading from '../../../../component/loading'
//ddTalk.verify(navigator.userAgent);
waterMark({watermark_txt: sessionStorage.getItem('userName') + '-' + sessionStorage.getItem('mobile')});
//获取钉钉授权
import ddConfigs from '../js/ddConfigs'
ddConfigs.config()
dd.error(function (err) {
    new Toast("钉钉授权验证失败，请关闭页面重新打开")
});
//初始化加载图片
$(".daoh").attr("src", require("../image/carNetstock/daohang.png"));
var begin_branch_lng,
    begin_branch_lat,
    end_branch_lng,
    end_branch_lat;//取车网点，还车网点经纬度
//初始化获取数据
var resultData = JSON.parse(sessionStorage.getItem("resultData2"));
if (resultData.biz_type == '0') {
    $(".mapb").attr("src", require('../image/mapb.png'));
} else if (resultData.biz_type == '1') {
    $(".mapb").attr("src", require('../image/map-B.png'));
} else if (resultData.biz_type == '2') {
    $(".mapb").attr("src", require('../image/mapoiler.png'));
}
//展示边框
$(".cardetail-content span").css("border","1px solid #e7e7e7");
begin_branch_lng=resultData.begin_branch_lng;
begin_branch_lat=resultData.begin_branch_lat;
//是否来自调度任务列表，有还车网点
if (resultData.end_branch_name) {
    if (resultData.end_branch_type == '0') {
        $(".mapb2").attr("src", require('../image/mapb.png'));
    } else if (resultData.end_branch_type == '1') {
        $(".mapb2").attr("src", require('../image/map-B.png'));
    } else if (resultData.end_branch_type == '2') {
        $(".mapb2").attr("src", require('../image/mapoiler.png'));
    }
    $(".branch_addr2").text(resultData.end_branch_name);
    end_branch_lng=resultData.end_branch_lng;
    end_branch_lat=resultData.end_branch_lat;
    $(".returnnet").removeClass("none");
}
//初始化加载数据
var strstart=resultData.vin.substring(0,11);
var strend=resultData.vin.substring(11,17);
$(".plate_no").html(resultData.plate_no + ' ' + '(<font class="font1">' + strstart + '</font>'+strend +')');
//车辆状态
$(".status_name").text(resultData.status_name);
//续航里程
$(".remain_km").text('约续航' + resultData.remain_km + '公里');
//车辆品牌
$(".brand_name").text(resultData.brand_name);
//车辆id
sessionStorage.setItem('car_id', resultData.car_id);
//停车位置
$(".branch_addr").text(resultData.branch_addr + resultData.begin_parking_floor + '层' + resultData.begin_parking_no + '车位');
//停车费用
if (resultData.park_fee == '') {
    $(".park_fee").text('');
} else {
    $(".park_fee").text('当前预计停车费' + resultData.park_fee + '元');
}
//跳转车辆当前位置，暂时隐藏
//$(".daoh").on("click", function () {
//    let plateNumber;
//    if (resultData.plate_no == '') {
//        plateNumber = strend;
//    } else {
//        plateNumber = resultData.plate_no;
//    }
//    window.location.href = "../oilerSingle/carLocation.html?name=" + plateNumber;
//});
//提交按钮点亮
$(".void_write").on("input",function(){
   if($(this).val().length>0){
       $(".carsingle-nextbtn button").addClass("submit-btn");
   }else{
       $(".carsingle-nextbtn button").removeClass("submit-btn");
   }
});

//上报故障类型
//请求故障类型配置数据
var arraymenu = [],//存储类型配置一级数据的id
    arraysecond = [],//存储类型配置的二级数据
    type_id = '',//一级分类
    type_name = '',
    cat_id = '';//二级分类
myAjax.post(getApiUrl('/vehicle-fault/fault-type'), {
    mobile: sessionStorage.getItem('mobile'),
    type: 2//运维上报故障类型
}, function (data) {
    if (data.status == '0') {
        let str = '';
        for (var i = 0; i < data.data.length; i++) {
            arraymenu.push(data.data[i].id);
            arraysecond.push(data.data[i].child);
            str += '<li><span>' + data.data[i].name + '</span><img class="none" src="' + require("../image/faultWork/duigou.png") + '"/><input type="hidden" value="' + data.data[i].id + '"/></li>';
        }
        $(".faulttype-list").html(str);
    } else {
        new Toast(data.msg)
    }
});
//打开弹框
$(".faultwork-top .content").on("click", function () {
    $(".fault-type").removeClass("none");
});
//一级菜单
$(".faulttype-list").on("click", "li", function () {
    $(".faulttype-list li span").removeClass("font-color");
    $(".faulttype-list li img").addClass("none");
    $(this).find("span").addClass("font-color");
    $(this).find("img").removeClass("none");
    $(".choice-type").text($(this).find("span").text());
    $(".choice-type").removeClass("none");
    type_id = $(this).find("input").val();//一级分类id
    type_name = $(this).find("span").text();
    //获取对应的二级菜单数据
    let index = arraymenu.indexOf($(this).find("input").val());
    let str = '';
    if (arraysecond[index].length == 0) {
        $(".faultwork-top .content").text(type_name);
        $(".faultwork-top .content").addClass("bold");
        $(".faultwork-nextbtn button").addClass("submit-btn");//按钮点亮
        //关闭弹框,数据还原
        $(".fault-type").addClass("none");
        $(".choice-type").text("");
        $(".choice-type").addClass("none");
        $(".faulttype-list li span").removeClass("font-color");
        $(".faulttype-list li img").addClass("none");
        $(".faultchoice-list li span").removeClass("font-color");
        $(".faultchoice-list li img").addClass("none");
        $(".faulttype-list").removeClass("none");
        $(".faultchoice-list").addClass("none");
    } else {
        for (var i = 0; i < arraysecond[index].length; i++) {
            str += '<li><span>' + arraysecond[index][i].name + '</span><img class="none" src="' + require("../image/faultWork/duigou.png") + '"/><input type="hidden" value="' + arraysecond[index][i].id + '"/></li>';
        }
        $(".faultchoice-list").html(str);
        //一级菜单隐藏，二级菜单显示
        $(".faulttype-list").addClass("none");
        $(".faultchoice-list").removeClass("none");
    }
});
//二级菜单
$(".faultchoice-list").on("click", "li", function () {
    $(".faultwork-top .content").text(type_name + "-" + $(this).find("span").text());
    $(".faultwork-top .content").addClass("bold");
    $(".faultwork-nextbtn button").addClass("submit-btn");//按钮点亮
    cat_id = $(this).find("input").val();//二级分类id
    //关闭弹框,数据还原
    $(".fault-type").addClass("none");
    $(".choice-type").text("");
    $(".choice-type").addClass("none");
    $(".faulttype-list li span").removeClass("font-color");
    $(".faulttype-list li img").addClass("none");
    $(".faultchoice-list li span").removeClass("font-color");
    $(".faultchoice-list li img").addClass("none");
    $(".faulttype-list").removeClass("none");
    $(".faultchoice-list").addClass("none");
});
//关闭弹框,数据还原
$(".close-btn").on("click", function () {
    $(".fault-type").addClass("none");
    $(".choice-type").text("");
    $(".choice-type").addClass("none");
    $(".faulttype-list li span").removeClass("font-color");
    $(".faulttype-list li img").addClass("none");
    $(".faultchoice-list li span").removeClass("font-color");
    $(".faultchoice-list li img").addClass("none");
    $(".faulttype-list").removeClass("none");
    $(".faultchoice-list").addClass("none");
});


//提交下一页
var clicktag = 0;
$(".carsingle-nextbtn button").on("click", function () {
    if($(this).hasClass("submit-btn")){
        if (!$(".faultwork-top .content ").hasClass("bold")) {
            new Toast("请选择上报故障类型");
            return false;
        }
        if (clicktag == 0) {
            clicktag = 1;
            //未找到车接口
            let resultData = JSON.parse(sessionStorage.getItem("resultData2"));
            let param = {
                mobile: sessionStorage.getItem('mobile'),
                car_id: resultData.car_id,//车辆id,
                city_id:resultData.city_id,//城市id,
                work_order_id:sessionStorage.getItem('id'),
                up_type_id: type_id,//上报故障类型
                up_cat_id: cat_id,//上报故障分类
                comment:$(".void_write").val(),//备注信息
                PhoneInfo:sessionStorage.getItem("PhoneInfo") || ''
            }
            $.ajax({
                type: "post",
                data: param,
                url: getApiUrl('/work-order/no-find-car'),
                beforeSend: function () {

                },
                success: function (data) {
                    var result = data;
                    if (result.status == '0') {
                        window.location.href = "../commonFile/jobend.html";
                    } else {
                        new Toast(result.msg);
                    }
                }
            });
        }
        setTimeout(function () {
            clicktag = 0;
        }, 5000);
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
dd.ready(function () {
    //取车网点导航
    $(".daoh1").on("click", function () {
        //钉钉获取定位
        dd.device.geolocation.get({
            targetAccuracy: 200,
            coordinate: 1,
            withReGeocode: false,
            useCache: true, //默认是true，如果需要频繁获取地理位置，请设置false
            onSuccess: function (data) {
                driving.search(
                    [data.longitude, data.latitude], [begin_branch_lng, begin_branch_lat],
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
    //还车网点导航
    $(".daoh2").on("click", function () {
        //钉钉获取定位
        dd.device.geolocation.get({
            targetAccuracy: 200,
            coordinate: 1,
            withReGeocode: false,
            useCache: true, //默认是true，如果需要频繁获取地理位置，请设置false
            onSuccess: function (data) {
                driving.search(
                    [data.longitude, data.latitude], [end_branch_lng, end_branch_lat],
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
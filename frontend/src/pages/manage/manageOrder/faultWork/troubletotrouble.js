/**
 * Created by Administrator on 2018/12/21.
 */
require('../css/public.css')
require('../css/faultWork/troubletotrouble.css')
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
$(".faultdetail-content .location img").attr("src", require("../image/faultWork/location2.png"));
$(".faultdetail-content .daoh").attr("src", require("../image/faultWork/daohang.png"));
//初始化获取数据
var netlng,netlat;
var resultData = JSON.parse(sessionStorage.getItem("resultData3")),
    strend = resultData.vin.substring(11, 17);
    netlng=resultData.branch_lng;
    netlat=resultData.branch_lat;//该网点的经纬度
$(".faultdetail-content .plate_no").html(resultData.plate_no + ' ' + '<font class="font1">(' + strend + ')</font>');//车牌号，Vin
$(".faultdetail-content .trouble_id").text(resultData.car_status);//车辆状态
$(".faultdetail-content .remain_km").text('约续航' + resultData.remain + '公里');//续航里程
$(".faultdetail-content .brand_name").text(resultData.brand_name + ' ' + resultData.model_name);//车辆品牌
if (resultData.biz_type == '0') {
    $(".faultdetail-content .mapb").attr("src", require('../image/mapb.png'));
} else if (resultData.biz_type == '1') {
    $(".faultdetail-content .mapb").attr("src", require('../image/map-B.png'));
} else if (resultData.biz_type == '2') {
    $(".faultdetail-content .mapb").attr("src", require('../image/mapoiler.png'));
}
$(".branch_addr").text(resultData.branch_name);//停车位置
if(resultData.remark!=''){
    $(".trouble-remark").text('备注：' + resultData.remark);
}

//新增去往车辆当前位置
$(".faultdetail-content .location").on("click",function(){
    location.href = "../oilerSingle/carLocation.html?name="+resultData.plate_no;
});

//提交按钮点亮
$(".void_write").on("input", function () {
    if ($(this).val().length > 0) {
        $(".newbuilt-nextbtn button").addClass("submit-btn");
    } else {
        $(".newbuilt-nextbtn button").removeClass("submit-btn");
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
$(".faultwork-top").on("click", function () {
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
        $(".faultwork-top .span2").text(type_name);
        $(".faultwork-top .span2").addClass("addbold");
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
    $(".faultwork-top .span2").text(type_name + "-" + $(this).find("span").text());
    $(".faultwork-top .span2").addClass("addbold");
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

//优化新增逻辑
$(".choice-type").on("click",function(){
    $(this).addClass("none");
    $(".faultchoice-list").addClass("none");//二级隐藏
    $(".faulttype-list li span").removeClass("font-color");
    $(".faulttype-list li img").addClass("none");
    $(".faulttype-list").removeClass("none");//一级显示
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

//提交下一页
var clicktag = 0;
$(".newbuilt-nextbtn button").on("click", function () {
    if ($(this).hasClass("submit-btn")) {
        if (!$(".faultwork-top .span2").hasClass("addbold")) {
            new Toast("请选择上报故障类型");
            return false;
        }
        if (clicktag == 0) {
            clicktag = 1;
            let param = {
                mobile: sessionStorage.getItem('mobile'),
                order_id: sessionStorage.getItem('order_id'),//工单id
                up_type_id: type_id,//上报故障类型
                up_cat_id: cat_id,//上报故障分类
                item_id:14,
                remark: $(".void_write").val()//备注信息
            }
            myAjax.post(getApiUrl('/vehicle-fault/operate'), param, function (data) {
                if (data.status == '0') {
                    location.href = "./faultend.html";
                } else {
                    new Toast(data.msg)
                }
            });
            setTimeout(function () {
                clicktag = 0;
            }, 5000)
        }
    }
});
/**
 * Created by Administrator on 2017/12/21.
 */
//require('../../../../component/vconsole')
require('../css/public.css')
require('../css/faultWork/newbuiltfault.css')
import $ from 'jquery'
import FoundationTools from '../js/functionAjax'
import getApiUrl from '../js/getApiUrl';
import myAjax from '../common/myAjax/withJq.js'
import {Confirm,Toast} from '../common/LikeAlert/index'
import waterMark from '../../../../../other_modules/like-manageOrder/waterMark'
import ddTalk from '../js/ddTalk'
//验证页面是否在钉钉浏览器打开
//ddTalk.verify(navigator.userAgent);
waterMark({watermark_txt: sessionStorage.getItem('userName') + '-' + sessionStorage.getItem('mobile')});
//获取钉钉授权
import ddConfigs from '../js/ddConfigs'
ddConfigs.config()
dd.error(function (err) {
    new Toast("钉钉授权验证失败，请关闭页面重新打开")
});
var order_id = FoundationTools.getUrlParam('order_id');
var warn_id = FoundationTools.getUrlParam('warn_id');//预警工单
var office_id = FoundationTools.getUrlParam('office_id');//办公用车
var maintain_id = FoundationTools.getUrlParam('maintain_id');// 保养工单
//初始化加载图片
$(".daoh").attr("src", require("../image/carNetstock/daohang.png"));
$(".newbuilt-content .location img").attr("src", require("../image/faultWork/location2.png"));
var begin_branch_lng,
    begin_branch_lat,
    end_branch_lng,
    end_branch_lat;//取车网点，还车网点经纬度
//初始化获取数据
var resultData = JSON.parse(sessionStorage.getItem("resultData"));
if (resultData.status == '2') {//租赁中的车辆
    $(".carstatus").css("line-height", "1rem");
    $(".carstatus").text('当前车辆为"租赁中"状态，提交后不改变当前车辆状态');
}
//展示页面
$("body").removeClass("none");
if (resultData.biz_type == '0') {
    $(".newbuilt-content .mapb").attr("src", require("../image/mapb.png"));//网点类型
} else if (resultData.biz_type == '1') {
    $(".newbuilt-content .mapb").attr("src", require("../image/map-B.png"));//网点类型
} else if (resultData.biz_type == '2') {
    $(".newbuilt-content .mapb").attr("src", require("../image/mapoiler.png"));//网点类型
}
begin_branch_lng=resultData.begin_branch_lng||resultData.lng;
begin_branch_lat=resultData.begin_branch_lat||resultData.lat;
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
var strstart = resultData.vin.substring(0, 11);
var strend = resultData.vin.substring(11, 17);
var plateNumber;
if (resultData.plate_no == '') {
    plateNumber = strend;
} else {
    plateNumber = resultData.plate_no;
}
$(".plate_no").html(resultData.plate_no + ' ' + '<font class="font1">(' + strend + ')</font>');
//车辆状态
$(".status_name").text(resultData.status_name);
//续航里程
var km = resultData.remain_km||resultData.remain;
$(".remain_km").text('约续航' + km + '公里');
//车机类型
if(resultData.car_factory){
    $(".carqube").text(resultData.car_factory);
}
//车辆品牌
$(".brand_name").text(resultData.brand_name);
//车辆id
sessionStorage.setItem('car_id', resultData.car_id);
//停车网点名称
$(".branch_addr").text(resultData.branch_addr||resultData.branch_name);
//车辆状态的备注信息
if (resultData.last_desc != '') {
    $(".newbuilt-content .bottom .span2").text(resultData.last_desc);
    $(".newbuilt-content .bottom").removeClass("none");
}
//跳转车辆当前位置，暂时隐藏
$(".newbuilt-content .location").on("click", function () {
    window.location.href = "../oilerSingle/carLocation.html?name=" + resultData.plate_no;
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
            //创建故障工单接口  如果有order_id,为维修转过来的工单，否则为之前正常转故障工单
            let param,apiUrl;
            if(order_id){
            	param = {
	                mobile: sessionStorage.getItem('mobile'),
	                order_id: order_id,
	                item_id:'10',
	                up_type_id: type_id,//上报故障类型
	                up_cat_id: cat_id,//上报故障分类
	                params:{
	                	remark: $(".void_write").val()
	                }//备注信息
	            }
            	apiUrl = '/vehicle-repair/operate'
            }else if(warn_id){
            	param = {
	                mobile: sessionStorage.getItem('mobile'),
	                order_id: warn_id,
	                item_id:'7',
	                up_type_id: type_id,//上报故障类型
	                up_cat_id: cat_id,//上报故障分类
	                params:{
	                	remark: $(".void_write").val()
	                }//备注信息
	            }
            	apiUrl = '/vehicle-zombie/operate'
            }else if(office_id){
            	param = {
	                mobile: sessionStorage.getItem('mobile'),
	                order_id: office_id,
	                item_id:'7',
	                up_type_id: type_id,//上报故障类型
	                up_cat_id: cat_id,//上报故障分类
	                params:{
	                	remark: $(".void_write").val()
	                }//备注信息
	            }
            	apiUrl = '/vehicle-office/operate'
            }else if(maintain_id){
              param = {
                mobile: sessionStorage.getItem('mobile'),
                order_id: maintain_id,
                item_id:'8',
                up_type_id: type_id,//上报故障类型
                up_cat_id: cat_id,//上报故障分类
                params:{
                  remark: $(".void_write").val()
                }//备注信息
              }
              apiUrl = '/vehicle-maintain/operate'
            }else{
            	param = {
	                mobile: sessionStorage.getItem('mobile'),
	                car_id: sessionStorage.getItem('car_id'),//车辆id
	                up_type_id: type_id,//上报故障类型
	                up_cat_id: cat_id,//上报故障分类
	                remark: $(".void_write").val()//备注信息
	            }
            	apiUrl = '/vehicle-fault/create-order'
            }
            if(sessionStorage.getItem("task_id")){//来自调度任务列表
                param.algorithm_task_id=sessionStorage.getItem("task_id");
            }
            myAjax.post(getApiUrl(apiUrl), param, function (data) {
                if (data.status == '0') {
                    sessionStorage.setItem("order_id", data.data.id),//存储故障工单id
                        location.href = "../../manageOrderCardetail/index.html?plate_no=" + plateNumber;
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
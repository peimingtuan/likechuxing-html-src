/**
 * Created by Administrator on 2018/6/8.
 */
require('../css/public.css')
require('../css/carNetstock/selectdetail.css')
import $ from 'jquery'
import FoundationTools from '../js/functionAjax'
import getApiUrl from '../js/getApiUrl';
import myAjax from '../common/myAjax/withJq.js'
import {Confirm,Toast} from '../common/LikeAlert/index'
import waterMark from '../../../../../other_modules/like-manageOrder/waterMark'
import ddTalk from '../js/ddTalk'
//验证页面是否在钉钉浏览器打开
//ddTalk.verify(navigator.userAgent);
//接收url参数
var branch_id = FoundationTools.getUrlParam('branch_id'),//网点id
    type = FoundationTools.getUrlParam('type');//区分搜索的是车辆还是网点，1为车辆；
var plateNumber,
    net_branchid;
if (type == 1) {
    //车辆详情
    document.title = "网点车辆详情";
    myAjax.post(getApiUrl('/branch-car-stock/car-info'), {
        mobile: sessionStorage.getItem('mobile'),
        car_id: branch_id   //车辆id
    }, function (data) {
        if (data.status == '0') {
            net_branchid = data.data.branch_id;//当前所在网点id
            //展示当前页面
            $(".navigation-icon .img2").attr("src",require("../image/carNetstock/daohang.png"));//导航图标
            $(".netdetail-content").removeClass("none");
            $(".netdetail-nextbtn").removeClass("none");
            $(".netdetail-content font").text(data.data.branch_name);//网点名称
            let strstart = data.data.vin.substring(0, 11),
                strend = data.data.vin.substring(11, 17);
            if (data.data.plate_no == '') {
                plateNumber = strend;
            } else {
                plateNumber = data.data.plate_no;
            }
            let line = '';
            if (data.data.current_parking_no != '') {
                line = '-';
            }
            let str = '<input type="hidden" class="plate_no" value="' + data.data.plate_no + '" /><input type="hidden" class="car_id" value="' + data.data.car_id + '" /><span>' + data.data.plate_no + '(<font class="font1">' + strstart + '</font>' + strend + ')</span>' +
                '<span>' + data.data.current_parking_floor + line + data.data.current_parking_no + '</span><br><span>' + data.data.status + '</span><span>' + data.data.model_name + '</span><span>' + data.data.color + '</span><br/><span>停车时长：' + data.data.time + '</span><span class="car-notnet none right">车辆未在网点</span><br/>';
            if (data.data.biz_type == '0') {
                $(".net-name .img1").attr("src", require("../image/mapb.png"));//合作网点
            } else {
                str += '<span>预估费用：<font>' + data.data.fee + '</font>元</span>';
                $(".net-name .img1").attr("src", require("../image/map-B.png"));//非合作网点类型
            }
            $(".selectcardetail").html(str);
        } else {
            new Toast(data.msg)
        }
    });
} else {
    myAjax.post(getApiUrl('/branch-car-stock/branch-info'), {//网点信息
        mobile: sessionStorage.getItem('mobile'),
        branch_id: branch_id//网点id
    }, function (data) {
        if (data.status == '0') {
            //展示当前页面
            $(".selectdetail-content").removeClass("none");
            $(".selectstockList").removeClass("none");
            let str = '';
            str += '<li class="netlist"><input type="hidden" value="' + data.data.id + '" class="net-Id"/><input type="hidden" value="' + data.data.lng + '" class="lng"/><input type="hidden" value="' + data.data.lat + '" class="lat"/><input type="hidden" value="' + data.data.biz_type + '" class="biz_type"/><input type="hidden" value="' + data.data.current_counts + '" class="current_counts"/><input type="hidden" value="' + data.data.address + '" class="address"/><span>' + data.data.name + '</span><br/><span class="netlocation"><span class="circle"></span>当前车辆<font>' + data.data.current_counts + '</font>台</span>' +
                '<span><span class="circle"></span>已超车：<font>' + data.data.over_counts + '</font>台</span><br/>';
            if (data.data.biz_type == '0') {//合作网点
                str += '<span><img src="' + require("../image/mapb.png") + '" class="img1"/>' + data.data.address + '</span>';
            } else if (data.data.biz_type == '1') {//非合作网点
                str += '<span><img src="' + require("../image/map-B.png") + '" class="img1"/>' + data.data.address + '</span>';
            }
            str += '<span class="navigation-icon"><img src="' + require("../image/carNetstock/daohang.png") + '" class="img2"/>导航</span></li>';
            $(".selectstockList").html(str);
            //跳转导航页面
            $(".selectstockList").on("click", ".navigation-icon", function (event) {
                event.stopPropagation();//阻止事件冒泡
                window.location.href = "./netlocation.html?branch_id=" + $(this).parent().find(".net-Id").val();
            });
        } else {
            new Toast(data.msg)
        }
    });
}

//刷新页面
$(".detailRefle").on("click", function () {
    location.reload();
});
//搜索跳转页面
$(".detailSelect").on("click", function () {
    location.href = "./netselect.html";
});
//跳转当前网点车辆库存页
$(".selectstockList").on("click", "li", function () {
    window.location.href = "./netdetail.html?branch_id=" + $(this).find(".net-Id").val() + "&lng=" + $(this).find(".lng").val() + "&lat=" + $(this).find(".lat").val() + "&biz_type=" + $(this).find(".biz_type").val() + "&current_counts=" + $(this).find(".current_counts").val() + "&address=" + $(this).find(".address").val();
});

//page2页面
//跳转导航页面
$(".navigation-icon").on("click", function () {
    window.location.href = "./netlocation.html?branch_id=" + net_branchid;
});
//发现未记录车辆
$(".find-norecordcar").on("click", function () {
    $(".net-contentwindow2").removeClass("none");
    $('.plate-num').val('');//清空数据
    $('.plate-num').focus();
});
//确认
$(".qure2").on("click", function () {
    if ($(".plate-num").val() == '') {
        new Toast("车牌号不能为空")
        return false;
    }
    myAjax.post(getApiUrl('/branch-car-stock/create-report'), {
        mobile: sessionStorage.getItem("mobile"),
        plate_no: $(".plate-num").val(),
        branch_id: net_branchid //网点id
    }, function (data) {
        if (data.status == '0') {
            $(".net-contentwindow2").addClass("none");
            new Toast("提交成功");
        } else {
            new Toast(data.msg);
        }
    });
});
//关闭弹框
$(".cancel2").on("click", function () {
    $(".net-contentwindow2").addClass("none");
});
//车辆未在网点
var car_id = '';
$(".selectcardetail").on("click", ".car-notnet", function (event) {
    event.stopPropagation();//阻止事件冒泡
    $(".net-content1 .plate font").text($(this).parent().find(".plate_no").val())
    $(".net-contentwindow1").removeClass("none");
    car_id = $(this).parent().find(".car_id").val();
});
//确认
$(".qure").on("click", function () {
    myAjax.post(getApiUrl('/branch-car-stock/create-report'), {
        mobile: sessionStorage.getItem("mobile"),
        car_id: car_id,
        branch_id: net_branchid //网点id
    }, function (data) {
        if (data.status == '0') {
            $(".net-contentwindow1").addClass("none");
            new Toast("提交成功");
        } else {
            new Toast(data.msg);
        }
    });
});
//关闭弹框
$(".cancel").on("click", function () {
    $(".net-contentwindow1").addClass("none");
});
//网点网点车辆报错
$(".netdetail-nextbtn button").on("click", function () {
    if ($(this).hasClass("submit-info")) {
        $(this).removeClass("submit-info");
        $(this).text("网点车辆数据报错");
        $(".find-norecordcar").addClass("none");
        $(".selectcardetail .car-notnet").addClass("none");
    } else {
        $(this).addClass("submit-info");
        $(this).text("报错完成");
        $(".find-norecordcar").removeClass("none");
        $(".selectcardetail .car-notnet").removeClass("none");
    }
});

//跳往车辆详情页
$(".selectcardetail").on("click", function () {
    location.href = "../../manageOrderCardetail/index.html?plate_no=" + plateNumber;
});
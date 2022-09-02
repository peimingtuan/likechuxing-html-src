/**
 * Created by Administrator on 2017/12/22.
 */
require('../css/public.css')
require('../css/oilerSingle/newoiler.css')
require('../css/lost_goods_window.less')
import $ from 'jquery'
import FoundationTools from '../js/functionAjax'
import getApiUrl from '../js/getApiUrl'
import myAjax from "../common/myAjax/withJq"
import {Toast} from '../common/LikeAlert/index'
import waterMark from '../../../../../other_modules/like-manageOrder/waterMark'
//import ddTalk from '../js/ddTalk'
//验证页面是否在钉钉浏览器打开
//ddTalk.verify(navigator.userAgent);
waterMark({watermark_txt: sessionStorage.getItem('userName') + '-' + sessionStorage.getItem('mobile')});
//获取url参数
var submit = FoundationTools.getUrlParam('submit'),
    getpicture = FoundationTools.getUrlParam('getpicture'),
    work_order_id = FoundationTools.getUrlParam('work_order_id'),//调度变加油工单
    diapatch = FoundationTools.getUrlParam('diapatch'),//获取调度工单
    newoilerid = FoundationTools.getUrlParam('newoilerid');
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
// 遗失物品列表
let lost_arr = []
//初始化工单详情接口
var param = {
    mobile: sessionStorage.getItem("mobile"),
    work_order_id: sessionStorage.getItem("id"),
    type: '1'//加油工单详情
}
if (newoilerid == '1') {
    param.work_order_id = work_order_id; //获取调度变加油的ID
    sessionStorage.setItem("id", work_order_id);
}
//开关车门
var carparam = {
    mobile: sessionStorage.getItem("mobile"),
    car_info: ''
}
var result = FoundationTools.syncEvent(param, getApiUrl('/work-order/detail')),
    status = result.status,
    msg = result.msg,
    data = result.data;
if (status == '0') {
    //存储调加油工单车辆详情
    sessionStorage.setItem("resultData2", JSON.stringify(data));
    if (data.limit_type) {
        if (data.limit_type != '0') {
            let limit_type = '2';
            if (data.limit_type == '2' || data.limit_type == '3') {
                $(".adjustable_in").text("可调入网点");
                limit_type = '3';
                $(".newoiler-btn button").css("width", "21%");
                $(".newoiler-btn .select-net").css("width", "23%");
                $(".newoiler-btn .adjustable_in").css("width", "27%");
            } else if (data.limit_type == '1') {
                $(".newoiler-btn button").css("width", "16%");
                $(".newoiler-btn .select-net").css("width", "26%");
                $(".urgent_in").removeClass("none");
            }
            $(".adjustable_in").removeClass("none");
            //跳转可调入或可调出网点地图页
            $(".adjustable_in").on("click", function () {
                window.location.href = "../fourDriveOrPark/dispatchmap.html?type=" + limit_type;
            });
            //跳转紧急调离网点地图页
            $(".urgent_in").on("click", function () {
                window.location.href = "../fourDriveOrPark/dispatchmap.html?type=1";
            });
        }
    }
    //取车
    if (data.biz_type == '0') {
        $(".newoiler-mapb").attr("src", require('../image/mapb.png'));
    } else if (data.biz_type == '1') {
        $(".newoiler-mapb").attr("src", require('../image/map-B.png'));
        //停车费用
        if (data.park_fee == '') {
            $(".park_fee").text('');
        } else {
            $(".park_fee").text('当前预计停车费' + data.park_fee + '元');
        }
    } else if (data.biz_type == '2') {
        $(".newoiler-mapb").attr("src", require('../image/mapoiler.png'));
    }
    begin_branch_lng=data.begin_branch_lng;
    begin_branch_lat=data.begin_branch_lat;
    //是否来自调度任务列表，有还车网点
    if (data.end_branch_name) {
        if (data.end_branch_type == '0') {
            $(".newoiler-mapb2").attr("src", require('../image/mapb.png'));
        } else if (data.end_branch_type == '1') {
            $(".newoiler-mapb2").attr("src", require('../image/map-B.png'));
        } else if (data.end_branch_type == '2') {
            $(".newoiler-mapb2").attr("src", require('../image/mapoiler.png'));
        }
        $(".branch_addr2").text(data.end_branch_name);
        end_branch_lng=data.end_branch_lng;
        end_branch_lat=data.end_branch_lat;
        $(".returnnet").removeClass("none");
    }
    var strstart = data.vin.substring(0, 11);
    var strend = data.vin.substring(11, 17);
    if (data.plate_no == '') {
        carparam.car_info = strend;
    } else {
        carparam.car_info = data.plate_no;
    }
    var string = data.plate_no + " (<font class='font1'>" + strstart + "</font>" + strend + ")<span class='right'>ID" + data.id + "</span><br/>" +
        "<span>" + data.status_name + "</span><span>" + data.oil_type + "</span><span>" + data.brand_name + "</span>";
    if (data.status == '1') {
        string += "<span class='deletework none'>&#xe6db;</span>";
    }
    $(".newoiler-content .p1").html(string);
    //车辆id
    sessionStorage.setItem("car_id", data.car_id);
    //网点id
    sessionStorage.setItem("branch_id", data.branch_id);
    //取车停车位置
    if (data.parking_floor != '' && data.parking_no != '') {
        $(".branch_addr").text(data.branch_addr + data.parking_floor + '层' + data.parking_no + '车位');
    } else if (data.parking_floor == '' && data.parking_no == '') {
        $(".branch_addr").text(data.branch_addr);
    } else if (data.parking_floor != '' && data.parking_no == '') {
        $(".branch_addr").text(data.branch_addr + data.parking_floor + '层');
    } else if (data.parking_floor == '' && data.parking_no != '') {
        $(".branch_addr").text(data.branch_addr + data.parking_no + '车位');
    }
    //操作历史
    var list = data.history,
        str = '';
    //控制删除按钮显示与否
    if (list.length != 0) {
        if (list[0].phone == sessionStorage.getItem('mobile')) {
            $(".deletework").removeClass("none");
        }
    }
    for (var i = 0; i < list.length; i++) {
        if (list[i].step_type == '5') {//缴费
            str += '<li><span>' + list[i].time + '</span><span class="check check-payment">查看&nbsp;&nbsp;&#xe623;</span><span>' + list[i].des + '</span><br/><span>' + list[i].username + '</span><span>（' + list[i].phone + '）</span><span>' + list[i].comment + '</span></li>';
        } else {
            str += '<li><span>' + list[i].time + '</span><span>' + list[i].des + '</span><br/><span>' + list[i].username + '</span><span>（' + list[i].phone + '）</span><span>' + list[i].comment + '</span></li>';
        }
    }
    $(".newoiler-history ul").html(str);
    //P端控制上传照片开关
    if (data.photo_flag == '1') {//需要上传照片
        //车辆工单状态1-待加油，2-已加油，3-已完成
        if (data.status == '1') {//待加油
            if (data.photo_get_status == true) {
                $(".span_get").text("查看取车验车单");
                $(".add-single").addClass("check-single");
            }
        } else if (data.status == '2') {//已加油
            $(".span_get").text("查看取车验车单");
            $(".add-single").addClass("check-single");
            $(".add-returncar").removeClass("none");
            $(".edit-endworklist").removeClass("none");
            if (data.photo_back_status == true) {
                $(".span_add").text("查看还车验车单");
                $(".add-returncar").addClass("checkruturncar");
            }
        }
        if (getpicture == '1') {
            $(".span_get").text("查看取车验车单");
            $(".add-single").addClass("check-single");
        }
        if (submit == '1') {
            $(".edit-endworklist button").css("background", "#333");
            $(".span_add").text("查看还车验车单");
            $(".add-returncar").addClass("checkruturncar");
        } else if (data.status == '2' && data.photo_back_status == true) {
            $(".edit-endworklist button").css("background", "#333");
        } else {
            $(".edit-endworklist button").css("background", "buttonface");
        }
    } else {//不需要上传取车验车单照片
        //车辆工单状态1-待加油，2-已加油，3-已完成
        $(".check-btn").removeClass("add-single");
        $(".check-btn .span2").text("已关闭");
        $(".check-btn .span2").css("color", "#999");//已关闭颜色置灰
        if (data.status == '2') {//已加油
            $(".add-returncar").removeClass("none");
            $(".edit-endworklist").removeClass("none");
            if (data.photo_back_status == true) {
                $(".span_add").text("查看还车验车单");
                $(".add-returncar").addClass("checkruturncar");
            }
        }
        if (submit == '1') {
            $(".edit-endworklist button").css("background", "#333");
            $(".span_add").text("查看还车验车单");
            $(".add-returncar").addClass("checkruturncar");
        } else if (data.status == '2' && data.photo_back_status == true) {
            $(".edit-endworklist button").css("background", "#333");
        } else {
            $(".edit-endworklist button").css("background", "buttonface");
        }
    }
    //展示页面
    $(".body").removeClass("none");
} else {
    //展示页面
    $(".body").removeClass("none");
    new Toast(msg)
}
//删除待加油工单
$(".deletework").on("click", function (event) {
    window.location.href = "./deletework.html?type=1";
});
//跳转当前位置页面,暂时隐藏
//$(".daoh").on("click", function () {
//    if (data.status == '3') {
//        window.location.href = "./carLocation.html?name=" + carparam.car_info + "&workstatus=3";
//    } else {
//        window.location.href = "./carLocation.html?name=" + carparam.car_info;
//    }
//});
//跳转输入加油信息页
$(".edit-refueling").on("click", function () {
    if ($(this).hasClass("checkoilerinfo")) {
        window.location.href = "./checkoilerinfo.html"
    } else if (data.status == '2') {
        window.location.href = "./editrefueling.html?id=" + sessionStorage.getItem("id");
    } else {
        if (getpicture == '1') {
            window.location.href = "./editrefueling.html";
        } else if (data.status == '1' && data.photo_get_status == true) {
            window.location.href = "./editrefueling.html";
        } else {
            if (data.photo_flag == '1') {
                new Toast("请先添加取车验车单")
            } else {
                window.location.href = "./editrefueling.html";
            }
        }
    }
});
//添加、查看取车验车单
$(".add-single").on("click", function () {
    if ($(this).hasClass("check-single")) {
        window.location.href = "./checksingle.html";
    } else {
        window.location.href = "./carsingle.html"
    }
});
//跳转车位结束工单页
$(".edit-endworklist").on("click", function () {
    if (submit == '1') {
        //sessionStorage.setItem('branch_types', 1);
        window.location.href = "../../endwork/index.html#/endOrder?type=1"
    } else if (data.status == '2' && data.photo_back_status == true) {
        //sessionStorage.setItem('branch_types', 1);
        window.location.href = "../../endwork/index.html#/endOrder?type=1"
    } else {
        new Toast('请编辑还车验车单');
    }
});
//跳转还车验车单页面
$(".add-returncar").on("click", function () {
    if ($(this).hasClass('checkruturncar')) {
        //查看还车验车单
        if (data.photo_flag == '1') {
            window.location.href = "./checkreturnsingle.html";
        } else {
            window.location.href = "./checkreturnsingle.html?photo_flag=0";
        }
    } else {
        if (data.photo_flag == '1') {
            window.location.href = "./returncarsingle.html"
        } else {
            window.location.href = "./returncarsingle.html?photo_flag=0"//上传照片关闭
        }
    }
});
//网点查询
$(".select-net").on("click", function () {
    window.location.href = "../../endwork/index.html#/selectmapnet2"
});
//开门
$(".open-door").on("click", function () {
    let resultData = FoundationTools.syncEvent(carparam, getApiUrl('/car/open-door'))
  if( resultData.data.length > 0){
    lost_arr = resultData.data
    dealLostGoods()
  }else{
    new Toast(resultData.msg);
  }

});
//锁门
$(".close-door").on("click", function () {
    let resultData = FoundationTools.syncEvent(carparam, getApiUrl('/car/close-door')),
        mSg = resultData.msg;
    new Toast(mSg);
});
//更多
$(".more-list").on("click", function () {
    $(".alert_window").removeClass("none");
});
//关闭弹框
$(".close-icon").on("click", function () {
    $(".alert_window").addClass("none");
});
//出场缴费跳转页面
$(".payment").on("click", function () {
    if (data.begin_branch_type == '1') {
        window.location.href = "../schedulingJob/payment.html?car_begin_time=" + data.car_begin_time + "&parking_hour=" + data.parking_hour + "&type=1";
    } else {
        $(".alert_window").addClass("none");
        new Toast("该网点不需要缴费")
    }
});
//调故障跳转页面
$(".troublecar").on("click", function () {
    window.location.href = "./troublecar.html";
});
//跳转查看缴费信息页
$(".check-payment").on("click", function () {
    window.location.href = "../commonFile/checkpayment.html"
});


$('#lost_yes').click(function(){
    myAjax.post(getApiUrl('/lost-record/confirm'), {
        mobile: sessionStorage.getItem("mobile"),
        PhoneInfo: sessionStorage.getItem("PhoneInfo") || '',
        status:1,
        order_id:lost_arr[0].id
    }, function (data) {
        lost_arr.splice(0,1)
        if(lost_arr.length > 0)dealLostGoods()
        else $('.lostBox').hide()
    });
})
$('#lost_no').click(function(){
    myAjax.post(getApiUrl('/lost-record/confirm'), {
        mobile: sessionStorage.getItem("mobile"),
        PhoneInfo: sessionStorage.getItem("PhoneInfo") || '',
        status:2,
        order_id:lost_arr[0].id
    }, function (data) {
        lost_arr.splice(0,1)
        if(lost_arr.length > 0)dealLostGoods()
        else $('.lostBox').hide()
    });
})
$('#lost_cancel').click(function(){
    $('.lostBox').hide()
})
function dealLostGoods(){
    let item = lost_arr[0]
    $('#lost').text(item.lost)
    $('#lost_detail').text(item.lost_detail)
    $('.lostBox').show()

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

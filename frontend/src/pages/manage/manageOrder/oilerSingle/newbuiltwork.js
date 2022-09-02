/**
 * Created by Administrator on 2017/12/21.
 */
require('../css/public.css')
require('../css/oilerSingle/newbuiltwork.css')
import $ from 'jquery'
import FoundationTools from '../js/functionAjax'
import getApiUrl from '../js/getApiUrl';
import {Confirm,Toast} from '../common/LikeAlert/index'
import waterMark from '../../../../../other_modules/like-manageOrder/waterMark'
//import ddTalk from '../js/ddTalk'
import Loading from '../../../../component/loading'
//验证页面是否在钉钉浏览器打开
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
var resultData = JSON.parse(sessionStorage.getItem("resultData"));
//展示页面
$("body").removeClass("none");
if (resultData.biz_type == '0') {
    $(".mapb").attr("src", require('../image/mapb.png'));
} else if (resultData.biz_type == '1') {
    $(".mapb").attr("src", require('../image/map-B.png'));
} else if (resultData.biz_type == '2') {
    $(".mapb").attr("src", require('../image/mapoiler.png'));
}
//展示边框
$(".cardetail-content span").css("border", "1px solid #e7e7e7");
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
var strstart = resultData.vin.substring(0, 11);
var strend = resultData.vin.substring(11, 17);
$(".plate_no").html(resultData.plate_no + ' ' + '(<font class="font1">' + strstart + '</font>' + strend + ')');
//车辆状态
$(".status_name").text(resultData.status_name);
//续航里程
$(".remain_km").text('约续航' + resultData.remain_km + '公里');
//车辆品牌
$(".brand_name").text(resultData.brand_name);
//车辆id
sessionStorage.setItem('car_id', resultData.car_id);
//停车网点名称
$(".branch_addr").text(resultData.branch_addr);
//停车费用
if (resultData.park_fee == '') {
    $(".park_fee").text('');
} else {
    $(".park_fee").text('当前预计停车费' + resultData.park_fee + '元');
}

//跳转当前位置页面
//$(".daoh").on("click", function () {
//    let plateNumber;
//    if (resultData.plate_no == '') {
//        plateNumber = strend;
//    } else {
//        plateNumber = resultData.plate_no;
//    }
//    window.location.href = "./carLocation.html?name=" + plateNumber;
//});
//提交下一页
var clicktag = 0;
$(".carsingle-nextbtn button").on("click", function () {
    if (clicktag == 0) {
        clicktag = 1;
        //创建加油工单接口
        let resultData = JSON.parse(sessionStorage.getItem("resultData"));
        let param = {
            mobile: sessionStorage.getItem('mobile'),
            city_id: sessionStorage.getItem("carcity_id"),//车辆当前城市id
            car_id: resultData.car_id,//车辆id,
            branch_id: resultData.branch_id,//网点id,
            begin_parking_floor: resultData.current_parking_floor,//取车楼层
            begin_parking_no: resultData.current_parking_no,//取车车位号
            plate_no: resultData.plate_no,//车牌号
            vin: resultData.vin,//vin号
            PhoneInfo: sessionStorage.getItem("PhoneInfo") || '',
            brand_name: resultData.brand_name,//车辆品牌
            type: '1'//加油工单
        }
        if(sessionStorage.getItem("task_id")){//来自调度任务列表
            param.algorithm_task_id=sessionStorage.getItem("task_id");
        }
        $.ajax({
            type: "post",
            data: param,
            url: getApiUrl('/work-order/create'),
            beforeSend: function () {
                // 禁用按钮防止重复提交
                var loading = new Loading()//加载loading
            },
            success: function (data) {
                let result = data;
                if (result.status == '0') {
                    var work_order_id = result.data.id;
                    sessionStorage.setItem("id", work_order_id);
                    window.location.href = "./newoiler.html?id=" + result.data.id;
                } else if (result.status == '2') {
                    new Toast(result.msg);
                    setTimeout(function () {
                        window.location.href = "../schedulingJob/caroilerhistory2.html";
                    }, 1000);
                } else {
                    new Toast(result.msg);
                    if (result.msg == '存在未完成的工单') {
                        setTimeout(function () {
                            window.location.href = "./caroilerhistory.html";
                        }, 1000);
                    }
                }
            }
        });
        setTimeout(function () {
            clicktag = 0;
            window.location.href = "../../manageOrderCardetail/index.html?plate_no="+resultData.plate_no;
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
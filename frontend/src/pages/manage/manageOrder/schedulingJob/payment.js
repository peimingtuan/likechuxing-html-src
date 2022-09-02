/**
 * Created by Administrator on 2017/12/21.
 */
require('../css/public.css')
require('../css/schedulingJob/payment.css')
import $ from 'jquery'
import FoundationTools from '../js/functionAjax'
import getApiUrl from '../js/getApiUrl';
import {Confirm,Toast} from '../common/LikeAlert/index'
import waterMark from '../../../../../other_modules/like-manageOrder/waterMark'
import {Select} from '../../../../component/Select/index'
import ddTalk from '../js/ddTalk'
import Loading from '../../../../component/loading'
//验证页面是否在钉钉浏览器打开
ddTalk.verify(navigator.userAgent);
waterMark({watermark_txt: sessionStorage.getItem('userName') + '-' + sessionStorage.getItem('mobile')});
//获取url参数
var car_begin_time = FoundationTools.getUrlParam('car_begin_time'),
    parking_hour = FoundationTools.getUrlParam('parking_hour');
var type = FoundationTools.getUrlParam('type');
//初始化加载图片
$(".daoh").attr("src", require("../image/carNetstock/daohang.png"));
//展示页面
$("body").removeClass("none");
var begin_branch_lng,
    begin_branch_lat,
    end_branch_lng,
    end_branch_lat;//取车网点，还车网点经纬度
//上传图片
var length = 0,
    imageArray = [];
//获取钉钉授权
import ddConfigs from '../js/ddConfigs'
ddConfigs.config()
dd.error(function (error) {
    new Toast("钉钉授权验证失败，请关闭页面重新打开")
});
dd.ready(function () {
    var userAgent = navigator.userAgent,
        number = 40,
        isiOS = !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isiOS) {
        number = 80;
    }
    $(".uploadIcon").on("click", function () {
        let btn = $(this);
        if (btn.hasClass("hasicam")) {
            //钉钉上传图片
            dd.biz.util.uploadImage({
                compression: true,//(是否压缩，默认为true)
                multiple: false, //是否多选，默认false
                max: 1, //最多可选个数
                quality: number, // 图片压缩质量,
                resize: number, // 图片缩放率
                stickers: {   // 水印信息
                    time: "",
                    dateWeather: "",
                    username: "",
                    address: ""
                },
                onSuccess: function (result) {
                    image(result);
                    imageArray.push(result[0]);
                    function image(file) {
                        btn.siblings(".image").val(file[0]);
                        btn.hide();
                        btn.siblings('.end-photo').removeClass("none");
                        btn.siblings('.check-photo').removeClass("none");
                        btn.siblings('.swat-photo').removeClass("none");
                        if (btn.hasClass("must")) {
                            length++;
                        }
                        if (length > 1 && $(".void_write").val().length > 0 && $(".parkingfee").val().length > 0) {
                            $(".carsingle-nextbtn button").addClass("submit-btn");
                        } else {
                            $(".carsingle-nextbtn button").removeClass("submit-btn");
                        }
                    }
                },
                onFail: function (err) {
                    //new Toast("上传图片失败")
                }
            });
        }else{
            //钉钉上传图片，仅支持手机拍照
            dd.biz.util.uploadImageFromCamera({
                compression: true,//(是否压缩，默认为true)
                quality: number, // 图片压缩质量,
                resize: number, // 图片缩放率
                stickers: {   // 水印信息
                    time: "",
                    dateWeather: "",
                    username: "",
                    address: ""
                },
                onSuccess: function (result) {
                    image(result);
                    imageArray.push(result[0]);
                    function image(file) {
                        btn.siblings(".image").val(file[0]);
                        btn.hide();
                        btn.siblings('.end-photo').removeClass("none");
                        btn.siblings('.check-photo').removeClass("none");
                        btn.siblings('.swat-photo').removeClass("none");
                        if (btn.hasClass("must")) {
                            length++;
                        }
                        if (length > 1 && $(".void_write").val().length > 0 && $(".parkingfee").val().length > 0) {
                            $(".carsingle-nextbtn button").addClass("submit-btn");
                        } else {
                            $(".carsingle-nextbtn button").removeClass("submit-btn");
                        }
                    }
                },
                onFail: function (err) {

                }
            });
        }
    });
    //查看照片
    $(".check-photo").on("click", function () {
        let btn = $(this);
        //图片浏览器
        dd.biz.util.previewImage({
            urls: imageArray,//图片地址列表,数组
            current: btn.siblings(".image").val(),//当前显示的图片链接
            onSuccess: function (result) {
                /**/
            },
            onFail: function (err) {

            }
        });
    });
    //移除当前图片
    $(".swat-photo").on("click", function () {
        if ($(this).hasClass("must-remove")) {
            length--;
        }
        if (length > 1 && $(".void_write").val().length > 0 && $(".parkingfee").val().length > 0) {
            $(".carsingle-nextbtn button").addClass("submit-btn");
        } else {
            $(".carsingle-nextbtn button").removeClass("submit-btn");
        }
        $(this).addClass("none");
        $(this).siblings('.end-photo').addClass("none");
        $(this).siblings('.check-photo').addClass("none");
        $(this).siblings(".uploadIcon").show();
        let index = imageArray.indexOf($(this).siblings(".image").val());
        imageArray.splice(index, 1);
        $(this).siblings(".image").val("");
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
})
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
//停车位置
$(".branch_addr").text(resultData.branch_addr + resultData.begin_parking_floor + '层' + resultData.begin_parking_no + '车位');
//停车费用
if (resultData.park_fee == '') {
    $(".park_fee").text('');
} else {
    $(".park_fee").text('当前预计停车费' + resultData.park_fee + '元');
}
//停车时长
var numhour = Number(parking_hour) / 3600;
if (parking_hour == '0') {
    $(".payinfo").addClass("none");
} else {
    $(".payinfo .span1").text(numhour.toFixed(1) + '小时');
    //停车开始时间
    $(".payinfo .span2").text(FoundationTools.getFormatDate(new Date(Number(car_begin_time) * 1000)));
    //预估费用
    $(".payinfo .span3").text(resultData.park_fee);
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
var regPos = /^\d+(\.\d+)?$/; //非负浮点数
$(".parkingfee").on("input", function () {
    if ($(".void_write").val().length > 0 && $(this).val() != '' && regPos.test($(this).val()) && length > 1) {
        $(".carsingle-nextbtn button").addClass("submit-btn");
    } else {
        $(".carsingle-nextbtn button").removeClass("submit-btn");
    }
});
$(".void_write").on("input", function () {
    if ($(this).val().length > 0 && $(".parkingfee").val() != '' && length > 1) {
        $(".carsingle-nextbtn button").addClass("submit-btn");
    } else {
        $(".carsingle-nextbtn button").removeClass("submit-btn");
    }
});
$(".parkingfee").on("blur", function () {
    if (!regPos.test($(this).val())) {
        $(this).val('');
        $(".carsingle-nextbtn button").removeClass("submit-btn");
        new Toast("请输入大于等于0的数字");
    }
    if ($(this).val() != '' && !/^-?\d+\.?\d{0,2}$/.test($(this).val())) {
        let num = Number($(this).val());
        $(this).val(num.toFixed(2));
    }
});

//选择费用类型
$(".fee-type").on("click", function () {
    new Select({
        name: '选择费用类型',
        id: '费用类型id',
        options: [{id: 1, name: '超停停车费'}, {id: 0, name: 'B+停车费'}, {id: 2, name: '错停停车、锁车费'}, {id: 3, name: '其他费用'}],
        callback: function (item) {
            $(".fee-type").val(item.name);
            $(".car-feeid").val(item.id);
        }
    })
});

//提交下一页
var clicktag = 0;
$(".carsingle-nextbtn button").on("click", function () {
    if ($(this).hasClass("submit-btn")) {
        if ($(".car-feeid").val() == '') {
            new Toast("请输入费用类型");
            return false;
        }
        if (clicktag == 0) {
            clicktag = 1;
            //停车缴费接口
            let resultData = JSON.parse(sessionStorage.getItem("resultData2"));
            let param = {
                mobile: sessionStorage.getItem('mobile'),
                car_id: resultData.car_id,//车辆id,
                city_id: resultData.city_id,//城市id,
                work_order_id: sessionStorage.getItem("id"),//工单id
                input_fee: $(".parkingfee").val(),//运维输入的车费
                comment: $(".void_write").val(),//备注信息
                photo_string: '',//凭证图片
                certificate_type: '',//凭证类型
                fee_type: $(".car-feeid").val(),//费用类型
                PhoneInfo: sessionStorage.getItem("PhoneInfo") || ''
            }
            $(".certificate").each(function () {
                if ($(this).is(':checked')) {
                    param.certificate_type = $(this).val();//凭证类型
                }
            })
            let array = [];
            $(".image").each(function () {
                if ($(this).val() != '') {
                    array.push($(this).val())
                }
            })
            param.photo_string = array.toString();
            $.ajax({
                type: "post",
                data: param,
                url: getApiUrl('/work-order/out-payment'),
                beforeSend: function () {
                    // 禁用按钮防止重复提交
                    var loading = new Loading()//加载loading
                },
                success: function (data) {
                    var result = data;
                    if (result.status == '0') {
                        if (type == '1') {
                            window.location.href = "../oilerSingle/newoiler.html";
                        } else {
                            window.location.href = "./diapatchwork.html";
                        }
                    } else {
                        new Toast(result.msg);
                    }
                }
            });
            setTimeout(function () {
                clicktag = 0;
                if (type == '1') {
                    window.location.href = "../oilerSingle/newoiler.html";
                } else {
                    window.location.href = "./diapatchwork.html";
                }
            }, 20000);
        }
    }
});
/**
 * Created by Administrator on 2018/4/10.
 */
require('../css/public.css')
require('../css/chasingCars/carchasedetail.css')
import $ from 'jquery'
import FoundationTools from '../js/functionAjax'
import getApiUrl from '../js/getApiUrl'
import {Confirm,Toast} from '../common/LikeAlert/index'
import waterMark from '../../../../../other_modules/like-manageOrder/waterMark'
import ddTalk from '../js/ddTalk'
//验证页面是否在钉钉浏览器打开
ddTalk.verify(navigator.userAgent);
waterMark({watermark_txt: sessionStorage.getItem('userName') + '-' + sessionStorage.getItem('mobile')});
//接收URL参数
var rental_id = FoundationTools.getUrlParam('rental_id');//编号id
show()
function show(){
    var param = {
        mobile: sessionStorage.getItem('mobile'),
        id: rental_id,
        PhoneInfo: sessionStorage.getItem("PhoneInfo") || ''
    }
    $.post(getApiUrl('/car-catch/detail'), param, function (data) {
        var result = data,
            status = result.status,
            msg = result.msg;
        $("body").removeClass("none");
        if (status == '0') {
            $(".content .span1").text(result.data.rental_id);//订单号
            $(".content .span2").text(result.data.phone_no);//手机号
            $(".content .span3").text(result.data.car_model);//车型
            $(".content .span4").text(result.data.plate_no);//车牌
            $(".content .span5").text(result.data.book_time);//预定时间
            $(".content .span6").text(result.data.total_time);//时长
            $(".content .span7").text(result.data.total_km);//里程
            $(".content .span8").text(result.data.arrearage);//欠费金额
            $(".content .span9").text(result.data.remark);//暂不追车的备注
            $(".content .span10").text(result.data.remark_time);//备注时间
            if(result.data.status=='4'){
                $(".no-charingcar").addClass("no-charingcarbtn");//暂不追车按钮置灰
                $(".need-charingcar").removeClass("need-charingcarbtn"); //需追车按钮点亮
            }else if(result.data.status=='5'){
                $(".need-charingcar").addClass("need-charingcarbtn"); //需追车按钮置灰
                $(".no-charingcar").removeClass("no-charingcarbtn");//暂不追车按钮点亮
            }else{
                $(".no-charingcar").removeClass("no-charingcarbtn");//暂不追车按钮点亮
                $(".need-charingcar").removeClass("need-charingcarbtn"); //需追车按钮点亮
            }
        } else {
            new Toast(msg);
        }
    });
}

//打开暂不追车弹框
$(".no-charingcar").on("click", function () {
    if (!$(this).hasClass("no-charingcarbtn")) {
        $(".confirm_window").removeClass("none");
    } else {
        $(".confirm_window").addClass("none");
    }
});
//取消追车弹框
$(".cancel-btn").on("click", function () {
    $(".confirm_window").addClass("none");
});
//打开自助缴费单弹框
$(".yeh-charingcar").on("click", function () {
    $(".confirm_window2").removeClass("none");
});
//取消自助缴费单弹框
$(".cancel-btn2").on("click", function () {
    $(".confirm_window2").addClass("none");
});
//点击单选框
$(".builtpayment").on("click", function () {
    if ($(this).val() == '0') {
        $(".confirm-contenttop2 .p2").addClass("none");
        $(".nocharing_content2").css({"height": "12rem", "margin-bottom": "-6rem"});
        $(".parkingfee").val("");//清空缴费金额
    } else {
        $(".confirm-contenttop2 .p2").removeClass("none");
        $(".nocharing_content2").css({"height": "15rem", "margin-bottom": "-7.5rem"});
        if ($(".parkingfee").val() == '') {
            $(".save-btn2").removeClass("save-btncolor2");
        }
    }
});
//暂不追车确定按钮点亮
$(".void_write").on("input", function () {
    if ($(this).val().length > 0) {
        $(".save-btn").addClass("save-btncolor");
    } else {
        $(".save-btn").removeClass("save-btncolor");
    }
});
//确定暂不追车备注信息
$(".save-btn").on("click", function () {
    if ($(this).hasClass("save-btncolor")) {
        let param = {
            mobile: sessionStorage.getItem('mobile'),
            id: rental_id,
            remark: $(".void_write").val()
        }
        $.post(getApiUrl('/car-catch/temp-not'), param, function (data) {
            let result = data,
                status = result.status,
                msg = result.msg;
            if (status == '0') {
                $(".confirm_window").addClass("none");
                $(".no-charingcar").addClass("no-charingcarbtn");//暂不追车按钮置灰
                $(".need-charingcar").removeClass("need-charingcarbtn"); //需追车按钮点亮
                show();//更新详情
            } else {
                $(".confirm_window").addClass("none");
                new Toast(msg)
            }
        });
    }
});
//自助缴费按钮点亮
var regPos = /^\d+(\.\d+)?$/; //非负浮点数
$(".parkingfee").on("input", function () {
    if ($(".void_write2").val().length > 0 && $(this).val() != '' && regPos.test($(this).val())) {
        $(".save-btn2").addClass("save-btncolor2");
    } else {
        $(".save-btn2").removeClass("save-btncolor2");
    }
});
$(".void_write2").on("input", function () {
    let checked_type;
    $(".builtpayment").each(function () {
        if ($(this).is(':checked')) {
            checked_type = $(this).val();
        }
    })
    if (checked_type == '1') {
        if ($(this).val().length > 0 && $(".parkingfee").val() != '') {
            $(".save-btn2").addClass("save-btncolor2");
        } else {
            $(".save-btn2").removeClass("save-btncolor2");
        }
    } else {
        if ($(this).val().length > 0) {
            $(".save-btn2").addClass("save-btncolor2");
        } else {
            $(".save-btn2").removeClass("save-btncolor2");
        }
    }
});
$(".parkingfee").on("blur", function () {
    if (!regPos.test($(this).val())) {
        $(this).val('');
        $(".save-btn2").removeClass("save-btncolor2");
        new Toast("请输入大于等于0的数字");
    }
    if ($(this).val() != '' && !/^-?\d+\.?\d{0,2}$/.test($(this).val())) {
        var num = Number($(this).val());
        $(this).val(num.toFixed(2));
    }
});
//确定自助缴费单备注信息
$(".save-btn2").on("click", function () {
    if ($(this).hasClass("save-btncolor2")) {
        let param = {
            mobile: sessionStorage.getItem('mobile'),
            id: rental_id,
            money: $(".parkingfee").val(),
            remark: $(".void_write2").val(),
            self_service_pay: ''//建自助缴费单1：需创建 0：不需创建
        }
        $(".builtpayment").each(function () {
            if ($(this).is(':checked')) {
                param.self_service_pay = $(this).val();//创建自助缴费单
            }
        })
        $.post(getApiUrl('/car-catch/catched'), param, function (data) {
            let result = data,
                status = result.status,
                msg = result.msg;
            if (status == '0') {
                $(".confirm_window2").addClass("none");
                window.location.href = "./earlywarning.html"
            } else {
                $(".confirm_window2").addClass("none");
                new Toast(msg)
            }
        });
    }
});
//需追车接口
$(".need-charingcar").on("click", function () {
    if (!$(this).hasClass("need-charingcarbtn")) {
        let param={
            mobile: sessionStorage.getItem('mobile'),
            id: rental_id,
        }
        $.post(getApiUrl('/car-catch/need-catch'), param, function (data) {
            let result = data,
                status = result.status,
                msg = result.msg;
            if (status == '0') {
                $(".need-charingcar").addClass("need-charingcarbtn"); //需追车按钮置灰
                $(".no-charingcar").removeClass("no-charingcarbtn");//暂不追车按钮点亮
            } else {
                new Toast(msg)
            }
        });
    }
});
//跳转P端操作历史页
$(".h-history").on("click", function () {
    window.location.href = "./operahistory.html?rental_id=" + rental_id;
});
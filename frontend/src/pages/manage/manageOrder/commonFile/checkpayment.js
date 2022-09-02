/**
 * Created by Administrator on 2017/12/21.
 */
require('../css/public.css')
require('../css/commonFile/checkpayment.css')
import $ from 'jquery'
import FoundationTools from '../js/functionAjax'
import getApiUrl from '../js/getApiUrl';
import {Confirm,Toast} from '../common/LikeAlert/index'
import waterMark from '../../../../../other_modules/like-manageOrder/waterMark'
import ddTalk from '../js/ddTalk'
//require('../../../../component/vconsole')
//验证页面是否在钉钉浏览器打开
//ddTalk.verify(navigator.userAgent);
waterMark({watermark_txt: sessionStorage.getItem('userName') + '-' + sessionStorage.getItem('mobile')});
//接收URL参数
var id = FoundationTools.getUrlParam('id'),//工单id
    car_id = FoundationTools.getUrlParam('car_id'),
    type = FoundationTools.getUrlParam('type');
//返回钉钉授权需要参数
var test = window.location.href;
//上传图片
var length = 0,
    imageArray = [];
dd.ready(function () {
    //初始化查询图片接口
    var param = {
        mobile: sessionStorage.getItem("mobile"),
        work_order_id: sessionStorage.getItem("id"),//工单id
        PhoneInfo: sessionStorage.getItem("PhoneInfo") || ''
    };
    $.post(getApiUrl('/work-order/parking-detail'), param, function (data) {
        var result = data,
            status = result.status,
            photo_string = result.data.photo_string,//图片的路径
            picturearry = photo_string.split(","),//转化为数组
            data = result.data,
            msg = result.msg;
        if (status == '0') {
            $(".text-content .p2 span").text(data.operation_remark);//缴费备注
            if (data.fee_type) {//费用类型
                if (data.fee_type == '0') {
                    $(".fee-type").val("B+停车费");
                } else if (data.fee_type == '1') {
                    $(".fee-type").val("超停停车费");
                } else if (data.fee_type == '2') {
                    $(".fee-type").val("错停停车，锁车费");
                } else if (data.fee_type == '3') {
                    $(".fee-type").val("其他费用");
                }
            }
            $(".text-content .parkingfee").val(data.operation_fee + "元");//停车费用
            if (data.certificate_type == '0') {//凭证类型
                $(".text-content .p0 span").text("无");
            } else if (data.certificate_type == '1') {
                $(".text-content .p0 span").text("发票");
            } else if (data.certificate_type == '2') {
                $(".text-content .p0 span").text("收据");
            }
            imageArray = picturearry;
            console.log()
            if (imageArray.length == 2) {
                $(".remove-photo").remove();
            } else {
                $(".remove-photo").removeClass("none")
            }
            $(".img-circle").each(function (index, element) {
                $(this).attr("src", imageArray[index])
            })
            $(".img-val").each(function (index, element) {
                $(this).val(imageArray[index])
            })
        } else {
            new Toast(msg);
        }
        //钉钉查看大图
        $(".img-circle").on("click", function () {
            let btn = $(this);
            dd.biz.util.previewImage({
                urls: imageArray,//图片地址列表,数组
                current: btn.parent().find(".img-val").val(),//当前显示的图片链接
                onSuccess: function (result) {
                    /**/
                },
                onFail: function (err) {
                    new Toast("查看大图失败");
                }
            });
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
//初始化加载数据
$(".plate_no").text(resultData.plate_no + ' ' + '（' + resultData.vin + '）');
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
//跳转车辆当前位置
$(".branch_addr").on("click", function () {
    window.location.href = "../oilerSingle/carLocation.html?name=" + resultData.plate_no;
});
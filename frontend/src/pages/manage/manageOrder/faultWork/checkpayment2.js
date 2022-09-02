/**
 * Created by Administrator on 2017/12/21.
 */
require('../css/public.css')
require('../css/faultWork/checkpayment2.css')
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
//接收URL参数
var record_id = FoundationTools.getUrlParam('record_id');//操作记录id
//初始化获取数据
myAjax.post(getApiUrl('/vehicle-fault/order-detail'), {
    mobile: sessionStorage.getItem('mobile'),
    order_id: sessionStorage.getItem('order_id')//故障工单id
}, function (data) {
    if (data.status == '0') {
        let img,//图片
            remain,//续航公里
            branch_name,//网点名称
            strstart = data.data.vin.substring(0, 11),
            strend = data.data.vin.substring(11, 17);
        if (data.data.status == '2') {
            if (data.data.end_biz_type == '0') {
                img = require('../image/mapb.png');
            } else if (data.data.end_biz_type == '1') {
                img = require('../image/map-B.png');
            } else if (data.data.end_biz_type == '2') {
                img = require('../image/mapoiler.png');
            }
            remain = data.data.remain_km;
            branch_name = data.data.end_branch
        } else {
            if (data.data.biz_type == '0') {
                img = require('../image/mapb.png');
            } else if (data.data.biz_type == '1') {
                img = require('../image/map-B.png');
            } else if (data.data.biz_type == '2') {
                img = require('../image/mapoiler.png');
            }
            remain = data.data.remain;
            branch_name = data.data.branch_name;
        }
        let strtop = '<span>' + data.data.plate_no + '(<font class="font1">' + strstart + '</font>' + strend + ')</span><span>故障' + data.data.id + '</span><br/>' +
            '<span>' + data.data.status_name + '</span><span>约续航' + remain + '公里</span><span>' + data.data.brand_name + ' ' + data.data.model_name + '</span><br/>' +
            '<span class="branch_addr"><img class="img1" src="' + img + '"/>' + branch_name + '</span> ';
        $(".checkpayment-content").html(strtop);
        //跳转车辆当前位置
        $(".checkpayment-content .branch_addr").on("click", function () {
            location.href = "../oilerSingle/carLocation.html?name=" + data.data.plate_no;
        });
    } else {
        new Toast(data.msg);
    }
});
//上传图片
var length = 0,
    imageArray = [];
dd.error(function (error) {
    new Toast("钉钉授权验证失败，请关闭页面重新打开")
});
dd.ready(function () {
    //初始化查询图片接口
    var param = {
        mobile: sessionStorage.getItem("mobile"),
        order_id: sessionStorage.getItem('order_id'),//故障工单id
        id: record_id,
        item_id: '10'
    };
    myAjax.post(getApiUrl('/vehicle-fault/item-result'), param, function (data) {
        if (data.status == '0') {
            $(".text-content .p2 span").text(data.data.result.remark);//缴费备注
            if (data.data.result.fee_type) {//费用类型
                if (data.data.result.fee_type == '0') {
                    $(".fee-type").val("B+停车费");
                } else if (data.data.result.fee_type == '1') {
                    $(".fee-type").val("超停停车费");
                } else if (data.data.result.fee_type == '2') {
                    $(".fee-type").val("错停停车，锁车费");
                } else if (data.data.result.fee_type == '3') {
                    $(".fee-type").val("其他费用");
                }
            }
            $(".text-content .parkingfee").val(data.data.result.parking_fee + "元");//停车费用
            if (data.data.result.certificate_type == '0') {//凭证类型
                $(".text-content .p0 span").text("无");
            } else if (data.data.result.certificate_type == '1') {
                $(".text-content .p0 span").text("发票");
            } else if (data.data.result.certificate_type == '2') {
                $(".text-content .p0 span").text("收据");
            }
            imageArray = data.data.result.photo.split(",");//转化为数组
            if (imageArray.length == 2) {
                $(".remove-photo").remove();
            } else {
                $(".remove-photo").removeClass("none");
            }
            $(".img-circle").each(function (index, element) {
                $(this).attr("src", imageArray[index])
            })
            $(".img-val").each(function (index, element) {
                $(this).val(imageArray[index])
            })
        } else {
            new Toast(data.msg);
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
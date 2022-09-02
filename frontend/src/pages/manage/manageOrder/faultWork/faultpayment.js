/**
 * Created by Administrator on 2017/12/21.
 */
require('../css/public.css')
require('../css/faultWork/faultpayment.css')
import $ from 'jquery'
import FoundationTools from '../js/functionAjax'
import getApiUrl from '../js/getApiUrl';
import {Confirm,Toast} from '../common/LikeAlert/index'
import {Select} from '../../../../component/Select/index'
import waterMark from '../../../../../other_modules/like-manageOrder/waterMark'
import ddTalk from '../js/ddTalk'
//验证页面是否在钉钉浏览器打开
//ddTalk.verify(navigator.userAgent);
waterMark({watermark_txt: sessionStorage.getItem('userName') + '-' + sessionStorage.getItem('mobile')});
//获取url参数
import ddConfigs from '../js/ddConfigs'
ddConfigs.config();//钉钉授权
//初始化获取数据
var resultData = JSON.parse(sessionStorage.getItem("resultData3")),
    img,
    strstart = resultData.vin.substring(0, 11),
    strend = resultData.vin.substring(11, 17);
if (resultData.biz_type == '0') {
    img = require('../image/mapb.png');
} else if (resultData.biz_type == '1') {
    img = require('../image/map-B.png');
} else if (resultData.biz_type == '2') {
    img = require('../image/mapoiler.png');
}
var strtop = '<span>' + resultData.plate_no + '(<font class="font1">' + strstart + '</font>' + strend + ')</span><span>故障' + resultData.id + '</span><br/>' +
    '<span>' + resultData.status_name + '</span><span>约续航' + resultData.remain + '公里</span><span>' + resultData.brand_name + ' ' + resultData.model_name + '</span><br/>' +
    '<span class="branch_addr"><img class="img1" src="' + img + '"/>' + resultData.branch_name + resultData.parking_floor + '层 ' + resultData.parking_no + '车位 </span> ';
$(".faultpayment-content").html(strtop);
//跳转车辆当前位置
$(".faultpayment-content .branch_addr").on("click", function () {
    location.href = "../oilerSingle/carLocation.html?name=" + resultData.plate_no;
});
var imageArray = [],//存储图片
    length = 0;
dd.ready(function () {
    let userAgent = navigator.userAgent,
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
})

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
        options: [{id:1,name:'超停停车费'},{id:0,name:'B+停车费'},{id:2,name:'错停停车、锁车费'},{id:3,name:'其他费用'}],
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
        if($(".car-feeid").val()==''){
            new Toast("请输入费用类型");
            return false;
        }
        if (clicktag == 0) {
            clicktag = 1;
            //停车缴费接口
            let param = {
                mobile: sessionStorage.getItem('mobile'),
                order_id: sessionStorage.getItem('order_id'),//故障工单id
                item_id: '10',//操作项id
                params:{
                    parking_fee: $(".parkingfee").val(),//运维输入的车费
                    certificate_type: '',//凭证类型
                    photo: '',//凭证图片
                    remark:$(".void_write").val(),//备注信息
                    fee_type:$(".car-feeid").val()//费用类型
                }
            }
            $(".certificate").each(function () {
                if ($(this).is(':checked')) {
                    param.params.certificate_type = $(this).val();//凭证类型
                }
            })
            let array = [];
            $(".image").each(function () {
                if($(this).val()!=''){
                    array.push($(this).val())
                }
            })
            param.params.photo = array.toString();
            $.ajax({
                type: "post",
                data: param,
                url: getApiUrl('/vehicle-fault/operate'),
                beforeSend: function () {

                },
                success: function (data) {
                    if (data.status == '0') {
                        location.href="./faultdetail.html";
                    } else {
                        new Toast(data.msg);
                    }
                }
            });
            setTimeout(function () {
                clicktag = 0;
            }, 5000);
        }
    }
});
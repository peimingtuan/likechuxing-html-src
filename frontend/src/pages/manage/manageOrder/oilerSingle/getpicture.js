/**
 * Created by Administrator on 2017/12/21.
 */
require('../css/public.css')
require('../css/oilerSingle/getpicture.css')
import $ from 'jquery'
import FoundationTools from '../js/functionAjax'
import getApiUrl from '../js/getApiUrl';
import myAjax from '../common/myAjax/withJq.js'
import {Confirm,Toast} from '../common/LikeAlert/index'
//import ddTalk from '../js/ddTalk'
//验证页面是否在钉钉浏览器打开
//ddTalk.verify(navigator.userAgent);
//初始化接收URL参数
var type = FoundationTools.getUrlParam('type');
//获取钉钉授权
import ddConfigs from '../js/ddConfigs'
ddConfigs.config()
//调取钉钉接口
dd.error(function (err) {
    new Toast("钉钉授权验证失败，请关闭页面重新打开")
});
dd.ready(function () {
    var userAgent = navigator.userAgent,
        number = 40,
        isAndroid = userAgent.indexOf('Android') > -1 || userAgent.indexOf('Adr') > -1, //android终端
        isiOS = !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isiOS) {
        number = 80;
    }
    //上传图片
    var length = 0,
        imageArray = [];
    $(".uploadIcon").on("click", function () {
        let btn = $(this);
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
                    length++;
                    if (length > 3) {
                        $(".getpicture-nextbtn button").addClass("getpicture-nextbutton");
                        $(".getpicture-nextbtn button").text("提交");
                    } else {
                        $(".getpicture-nextbtn button").removeClass("getpicture-nextbutton");
                        $(".getpicture-nextbtn button").text("下一步");
                    }
                }
            },
            onFail: function (err) {
                new Toast("上传图片失败")
            }
        });
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
                new Toast("查看大图失败")
            }
        });
    });
    //移除当前图片
    $(".swat-photo").on("click", function () {
        length--;
        if (length > 3) {
            $(".getpicture-nextbtn button").addClass("getpicture-nextbutton");
            $(".getpicture-nextbtn button").text("提交");
        } else {
            $(".getpicture-nextbtn button").removeClass("getpicture-nextbutton");
            $(".getpicture-nextbtn button").text("下一步");
        }
        $(this).addClass("none");
        $(this).siblings('.end-photo').addClass("none");
        $(this).siblings('.check-photo').addClass("none");
        $(this).siblings(".uploadIcon").show();
        let index = imageArray.indexOf($(this).siblings(".image").val());
        imageArray.splice(index, 1);
        $(this).siblings(".image").val("");
    });
    //提交按钮
    var clicktag = 0;
    $(".getpicture-nextbtn button").on("click", function () {
        if (length > 3) {
            if (clicktag == 0) {
                clicktag = 1;
                if (type == '3') {
                    let param = {
                        order_id: sessionStorage.getItem('chargeorder_id'),//工单id
                        mobile: sessionStorage.getItem('mobile'),
                        item_id: '1',//操作项
                        params: {
                            key: sessionStorage.getItem("singleArray").toString(),//key值
                            photo_string: ''
                        }
                    }
                    let array = [];
                    $(".image").each(function () {
                        array.push($(this).val())
                    })
                    param.params.photo_string = array.toString();
                    myAjax.post(getApiUrl('/vehicle-charging/operate'), param, function (data) {
                        if (data.status == '0') {
                            window.location.href = "../chargeWork/charge.html#/chargedetail";
                        } else {
                            new Toast(data.msg);
                        }
                    });
                } else {
                    let param = {
                        work_order_id: sessionStorage.getItem('id'),
                        mobile: sessionStorage.getItem('mobile'),
                        car_id: sessionStorage.getItem("car_id"),//车辆id
                        type: '1',
                        work_order_type: '1',//加油或调度
                        PhoneInfo: sessionStorage.getItem("PhoneInfo") || '',
                        key: sessionStorage.getItem("singleArray").toString(),//key值
                        photo_string: ''
                    }
                    if (type == '2') {
                        param.work_order_type = 2;
                    }
                    let array = [];
                    $(".image").each(function () {
                        array.push($(this).val())
                    })
                    param.photo_string = array.toString();
                    myAjax.post(getApiUrl('/work-order/upload-save'), param, function (data) {
                        if (data.status == '0') {
                            if (type == '2') {
                                window.location.href = "../schedulingJob/diapatchwork.html?getpicture=" + 1;
                            } else {
                                window.location.href = "./newoiler.html?getpicture=" + 1;
                            }
                        } else {
                            new Toast(data.msg);
                        }
                    });
                }
                setTimeout(function () {
                    clicktag = 0
                }, 2000);
            }
        }
    })
});
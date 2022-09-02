/**
 * Created by Administrator on 2017/12/21.
 */
require('../css/public.css')
require('../css/faultWork/afterphoto.css')
import $ from 'jquery'
import FoundationTools from '../js/functionAjax'
import getApiUrl from '../js/getApiUrl';
import myAjax from '../common/myAjax/withJq.js'
import {Confirm,Toast} from '../common/LikeAlert/index'
import waterMark from '../../../../../other_modules/like-manageOrder/waterMark'
import ddTalk from '../js/ddTalk'
//验证页面是否在钉钉浏览器打开
//ddTalk.verify(navigator.userAgent);
import ddConfigs from '../js/ddConfigs'
ddConfigs.config();//钉钉授权
//接收url参数
var item_id = FoundationTools.getUrlParam('item_id');
var length = 0,
    imageArray = [],
    text = '<div class="left1">' + $(".afterphoto-content .left1").html() + '</div>';
if (item_id != '') {
    //回显数据
    myAjax.post(getApiUrl('/vehicle-fault/item-result'), {
        mobile: sessionStorage.getItem("mobile"),
        order_id: sessionStorage.getItem("order_id"),//工单id
        item_id: '4'
    }, function (data) {
        if (data.status == '0') {
            imageArray = data.data.result;
            $(".afterphoto-content").removeClass("none");
            for (var i = 1; i < imageArray.length; i++) {
                $(".afterphoto-content").append(text);
            }
            $(".image").each(function (index, element) {
                $(this).val(imageArray[index])
            })
            $(".uploadIcon").hide();
            $(".number").hide();
            $('.end-photo').removeClass("none");
            $('.check-photo').removeClass("none");
            $('.swat-photo').removeClass("none");
            length = imageArray.length;
            $(".afterphoto-content button").addClass("afterphoto-nextbutton");
        } else {
            new Toast(data.msg);
        }
    });
}else{
    $(".afterphoto-content").removeClass("none");
}
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
    //上传图片
    $(".afterphoto-content").on("click", ".uploadIcon", function () {
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
                if (length < 9) {
                    $(".afterphoto-content").append(text);
                }
                imageArray.push(result[0]);
                btn.hide();
                btn.siblings('.number').hide();
                btn.siblings('.end-photo').removeClass("none");
                btn.siblings('.check-photo').removeClass("none");
                btn.siblings('.swat-photo').removeClass("none");
                btn.parent().parent().find(".image").val(result[0])
                $(".afterphoto-content .left1:last-of-type").find("font").text(length+2);
                length++;
                if (length > 0) {
                    $(".afterphoto-nextbtn button").addClass("afterphoto-nextbutton");
                } else {
                    $(".afterphoto-nextbtn button").removeClass("afterphoto-nextbutton");
                }
            },
            onFail: function (err) {

            }
        });
    });
    //查看照片
    $(".afterphoto-content").on("click",'.check-photo', function () {
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
    $(".afterphoto-content").on("click", ".swat-photo", function () {
        let btn = $(this),
            index = imageArray.indexOf(btn.siblings(".image").val());
        imageArray.splice(index, 1);
        btn.siblings(".image").val("");
        $(".afterphoto-content>div").each(function () {
            if ($(this).find(".image").val() == '') {
                $(this).remove();
            }
        });
        $(".afterphoto-content").append(text);
        $(".afterphoto-content .left1:last-of-type").find("font").text(imageArray.length+1);
        length--;
        if(imageArray.length==0){
            length=0;
            $(".afterphoto-content .left1:last-of-type").find("font").text(1);
        }
        if (length > 0) {
            $(".afterphoto-nextbtn button").addClass("afterphoto-nextbutton");
        } else {
            $(".afterphoto-nextbtn button").removeClass("afterphoto-nextbutton");
        }
    });
    //提交按钮
    var clicktag = 0;
    $(".afterphoto-nextbtn button").on("click", function () {
        if ($(this).hasClass("afterphoto-nextbutton")) {
            if (clicktag == 0) {
                clicktag = 1;
                let param = {
                    mobile: sessionStorage.getItem("mobile"),
                    order_id: sessionStorage.getItem("order_id"),//故障工单id
                    item_id: '4', //结束步骤id
                    params: {}
                }
                let array = [];
                $(".image").each(function () {
                    if ($(this).val() != '') {
                        array.push($(this).val())
                    }
                })
                param.params.after_photo = array.toString();
                myAjax.post(getApiUrl('/vehicle-fault/operate'), param, function (data) {
                    if (data.status == '0') {
                        location.href = "./faultdetail.html";
                    } else {
                        new Toast(data.msg);
                    }
                });
                setTimeout(function () {
                    clicktag = 0
                }, 2000);
            }
        }
    })
});
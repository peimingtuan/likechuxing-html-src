/**
 * Created by Administrator on 2017/12/26.
 */
require('../css/public.css')
require('../css/oilerSingle/returncarpicture.css')
import $ from 'jquery'
import FoundationTools from '../js/functionAjax'
import getApiUrl from '../js/getApiUrl'
import CarDamage from '../../../../component/carDamage/index'
import {Toast} from '../common/LikeAlert'
//import ddTalk from '../js/ddTalk'
//验证页面是否在钉钉浏览器打开
//ddTalk.verify(navigator.userAgent);
//初始化接收URL参数
var type = FoundationTools.getUrlParam('type'),
    photo_flag = FoundationTools.getUrlParam('photo_flag');
if (photo_flag == '0') {
    $(".photo-hide").remove();
    $("body").removeClass("none");
} else {
    $("body").removeClass("none");
}
//获取钉钉授权
import ddConfigs from '../js/ddConfigs'
ddConfigs.config()
//调取钉钉接口
dd.error(function (err) {
    new Toast("钉钉授权验证失败，请关闭页面重新打开")
});
dd.ready(function () {
    //上传图片
    var length = 0,
        imageArray = [];
    var userAgent = navigator.userAgent,
        number = 40,
        isiOS = !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isiOS) {
        number = 80;
    }
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
                console.log(new Date());
                image(result);
                imageArray.push(result[0])
                console.log(imageArray);
                function image(file) {
                    btn.siblings(".image").val(file[0]);
                    btn.hide();
                    btn.siblings('.end-photo').removeClass("none");
                    btn.siblings('.check-photo').removeClass("none");
                    btn.siblings('.swat-photo').removeClass("none");
                    console.log(new Date());
                    length++;
                    if (photo_flag == '0') {
                        if (length > 1) {
                            $(".returnpicture-nextbtn button").addClass("returnpicture-nextbutton");
                        } else {
                            $(".returnpicture-nextbtn button").removeClass("returnpicture-nextbutton");
                        }
                    } else {
                        if (length > 5) {
                            $(".returnpicture-nextbtn button").addClass("returnpicture-nextbutton");
                        } else {
                            $(".returnpicture-nextbtn button").removeClass("returnpicture-nextbutton");
                        }
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
        if (photo_flag == '0') {
            if (length > 1) {
                $(".returnpicture-nextbtn button").addClass("returnpicture-nextbutton");
            } else {
                $(".returnpicture-nextbtn button").removeClass("returnpicture-nextbutton");
            }
        } else {
            if (length > 5) {
                $(".returnpicture-nextbtn button").addClass("returnpicture-nextbutton");
            } else {
                $(".returnpicture-nextbtn button").removeClass("returnpicture-nextbutton");
            }
        }
        $(this).addClass("none");
        $(this).siblings('.end-photo').addClass("none");
        $(this).siblings('.check-photo').addClass("none");
        $(this).siblings(".uploadIcon").show();
        let index = imageArray.indexOf($(this).siblings(".image").val());
        imageArray.splice(index, 1);
        $(this).siblings(".image").val("");
    })
    //跳转下一页
    var clicktag = 0;
    $(".returnpicture-nextbtn button").on("click", function () {
        if ($(this).hasClass("returnpicture-nextbutton")) {
            if (clicktag == 0) {
                clicktag = 1;
                if (type == '3' || type == '4') {//type为3正常流程还车验车，type为4充电前验车
                    let param = {
                        order_id: sessionStorage.getItem('chargeorder_id'),//工单id
                        mobile: sessionStorage.getItem('mobile'),
                        item_id: '6',//操作项
                        params: {
                            key: sessionStorage.getItem("returnsingleArray").toString(),//key值
                            photo_string: ''
                        }
                    }
                    if(type=='4'){
                        param.item_id='2';
                    }
                    let array = [];
                    $(".image").each(function () {
                        array.push($(this).val())
                    })
                    param.params.photo_string = array.toString();
                    $.post(getApiUrl('/vehicle-charging/operate'), param, function (data) {
                        if (data.status == '0') {
                            window.location.href = "../chargeWork/charge.html#/chargedetail";
                        } else {
                            new Toast(data.msg);
                        }
                    });
                }else if(type=='5'){//type为5充电上线还车验车单
                    let array = [];
                    $(".image").each(function () {
                        array.push($(this).val())
                    })
                    sessionStorage.setItem("chargepicture",array.toString());//缓存照片
                    window.location.href = "../chargeWork/charge.html#/chargegoline";//跳转充电上线页面
                }else{
                    let param = {
                        work_order_id: sessionStorage.getItem('id'),
                        mobile: sessionStorage.getItem('mobile'),
                        car_id: sessionStorage.getItem('car_id'), //车辆id
                        type: '2',
                        work_order_type: '1',//加油或调度
                        PhoneInfo: sessionStorage.getItem("PhoneInfo") || '',
                        key: sessionStorage.getItem("returnsingleArray").toString(),//key值
                        photo_string: ''
                    }
                    if (type == '2') {
                        param.work_order_type = 2;
                    }
                    let arrayimg = [];
                    $(".image").each(function () {
                        arrayimg.push($(this).val())
                    });
                    param.photo_string = arrayimg.toString();
                    $.post(getApiUrl('/work-order/upload-save'), param, function (data) {
                        if (data.status == '0') {
                            if (type == '2') {
                                window.location.href = "../schedulingJob/diapatchwork.html?submit=1"
                            } else {
                                window.location.href = "./newoiler.html?submit=1"
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
    });
});
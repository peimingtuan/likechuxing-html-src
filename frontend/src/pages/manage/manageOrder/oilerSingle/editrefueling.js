/**
 * Created by Administrator on 2017/12/25.
 * xurr 181214 type 1 办公用车
 */
//require('../../../../component/vconsole')
require('../css/public.css')
require('../css/oilerSingle/editrefueling.css')
import $ from 'jquery'
import FoundationTools from '../js/functionAjax'
import getApiUrl from '../js/getApiUrl';
import {Confirm,Toast} from '../common/LikeAlert/index'
import waterMark from '../../../../../other_modules/like-manageOrder/waterMark'
//import ddTalk from '../js/ddTalk'
//验证页面是否在钉钉浏览器打开
//ddTalk.verify(navigator.userAgent);
//接收url参数 
var oilername = FoundationTools.getUrlParam('oilername'),
    id = FoundationTools.getUrlParam('id'),
    types = FoundationTools.getUrlParam('type'),
    order_ids = FoundationTools.getUrlParam('order_id');
    if(order_ids){
    	sessionStorage.setItem('id',order_ids)
    	sessionStorage.setItem('order_id',order_ids)
    	sessionStorage.setItem('type',types)
    }
var type = sessionStorage.getItem('type'),
	order_id = sessionStorage.getItem('order_id');
if (oilername == '1') {
    $(".choice-oilstate").val(FoundationTools.getCookie("oilername"));
}
var length = 0;
var imageArray = [];//存放图片路径的数组
var price,//加油站92#油的单价
    box_type;//油箱容量
if (id != '') {
    //回显数据
    let param = {
        mobile: sessionStorage.getItem("mobile"),
        work_order_id: sessionStorage.getItem("id"),//工单id
        PhoneInfo: sessionStorage.getItem("PhoneInfo") || '',
        get_back_type: '3'
    };
    $.post(getApiUrl('/work-order/card-gas'), param, function (data) {
        var result = data,
            status = result.status,
            photo_string = result.data.photo_string,//图片的路径
            picturearry = photo_string.split(","),//转化为数组
            data = result.data,
            msg = result.msg;
        if (status == '0') {
            $(".choice-oilstate").val(data.name);//加油站
            sessionStorage.setItem("oilerstationLat", data.lat),//加油站纬度
                sessionStorage.setItem("oilerstationLng", data.lng),//加油站经度
                sessionStorage.setItem("address", data.address),//加油站详细地址
                $(".oiler-number").val(data.gas_card);//油卡编号
            $(".oilermodel").each(function () {
                if ($(this).val() == data.oil_type) {
                    $(this).attr("checked", true);//油品型号
                }
            });
            $(".oilamount").val(data.oil_mass);//加油数量
            $(".oilmoney").val(data.fee);//加油金额
            $(".oilbalance").val(data.oil_card_fee);//油卡余额
            imageArray = picturearry;
            $(".image").each(function (index, element) {
                console.log(index)
                $(this).val(imageArray[index])
            })
            $(".uploadIcon").hide();
            $('.end-photo').removeClass("none");
            $('.check-photo').removeClass("none");
            $('.swat-photo').removeClass("none");
            length = 4;
            $(".refueling-submit button").addClass("refueling-nextbutton");
            //获取该加油站的92#单价
            $.post(getApiUrl('/work-order/get-price'), {
                mobile: sessionStorage.getItem("mobile"),
                city_id: sessionStorage.getItem("carcity_id"),//车辆当前城市id
                work_order_id: sessionStorage.getItem("id"),//工单id
                lat: sessionStorage.getItem("oilerstationLat"),//加油站纬度
                lng: sessionStorage.getItem("oilerstationLng"),//加油站经度
                PhoneInfo: sessionStorage.getItem("PhoneInfo") || ''
            }, function (data) {
                if (data.status == '0') {
                    price = data.data.price;
                    box_type = data.data.box_type;
                } else {
                    new Toast(data.msg);
                }
            });
        } else {
            new Toast(msg);
        }
    });
}
//选择加油站后跳转该页面
if (oilername != '') {
    let lengthNum = 0;
    if (sessionStorage.getItem("oiler-number")) {
        $(".oiler-number").val(sessionStorage.getItem("oiler-number"));//获取本地缓存油卡编号
        lengthNum++;
    }
    if (sessionStorage.getItem("oilermodel")) {
        $(".oilermodel").each(function () {
            if ($(this).val() == sessionStorage.getItem("oilermodel")) {
                $(this).attr("checked", true);//油品型号
            }
        });
        lengthNum++;
    }
    if (sessionStorage.getItem("oilamount")) {
        $(".oilamount").val(sessionStorage.getItem("oilamount"));//获取本地缓存加油数量
        lengthNum++;
    }
    if (sessionStorage.getItem("oilmoney")) {
        $(".oilmoney").val(sessionStorage.getItem("oilmoney"));//获取本地缓存加油金额
        lengthNum++;
    }
    if (sessionStorage.getItem("oilbalance")) {
        $(".oilbalance").val(sessionStorage.getItem("oilbalance"));//本地缓存油卡余额
        lengthNum++;
    }
    if (sessionStorage.getItem("imageArray") != '') {
        imageArray = sessionStorage.getItem("imageArray").split(",");//图片存储路径
        if (imageArray.length == '4') {
            $(".image").each(function (index, element) {
                $(this).val(imageArray[index])
            });
            $(".uploadIcon").hide();
            $('.end-photo').removeClass("none");
            $('.check-photo').removeClass("none");
            $('.swat-photo').removeClass("none");
            length = 4;
            if (lengthNum == 5) {
                $(".refueling-submit button").addClass("refueling-nextbutton");
            }
        } else {
            $(".image1").val(sessionStorage.getItem("imageArray1") || '');
            $(".image2").val(sessionStorage.getItem("imageArray2") || '');
            $(".image3").val(sessionStorage.getItem("imageArray3") || '');
            $(".image4").val(sessionStorage.getItem("imageArray4") || '');
            if ($(".image1").val() != '') {
                $(".image1").siblings(".uploadIcon").hide();
                $(".image1").siblings(".end-photo").removeClass("none");
                $(".image1").siblings(".check-photo").removeClass("none");
                $(".image1").siblings(".swat-photo").removeClass("none");
            }
            if ($(".image2").val() != '') {
                $(".image2").siblings(".uploadIcon").hide();
                $(".image2").siblings(".end-photo").removeClass("none");
                $(".image2").siblings(".check-photo").removeClass("none");
                $(".image2").siblings(".swat-photo").removeClass("none");
            }
            if ($(".image3").val() != '') {
                $(".image3").siblings(".uploadIcon").hide();
                $(".image3").siblings(".end-photo").removeClass("none");
                $(".image3").siblings(".check-photo").removeClass("none");
                $(".image3").siblings(".swat-photo").removeClass("none");
            }
            if ($(".image4").val() != '') {
                $(".image4").siblings(".uploadIcon").hide();
                $(".image4").siblings(".end-photo").removeClass("none");
                $(".image4").siblings(".check-photo").removeClass("none");
                $(".image4").siblings(".swat-photo").removeClass("none");
            }
            if (imageArray.length == '3') {
                length = 3;
            } else if (imageArray.length == '2') {
                length = 2;
            } else if (imageArray.length == '1') {
                length = 1;
            }
        }
    }
    //获取该加油站的92#单价
    $.post(getApiUrl('/work-order/get-price'), {
        mobile: sessionStorage.getItem("mobile"),
        city_id: sessionStorage.getItem("carcity_id"),//车辆当前城市id
        work_order_id: sessionStorage.getItem("id"),//工单id
        lat: sessionStorage.getItem("oilerstationLat"),//加油站纬度
        lng: sessionStorage.getItem("oilerstationLng"),//加油站经度
        PhoneInfo: sessionStorage.getItem("PhoneInfo") || ''
    }, function (data) {
        if (data.status == '0') {
            price = data.data.price;
            box_type = data.data.box_type;
        } else {
            new Toast(data.msg);
        }
    });
}
//初始化加载图片
$(".close-editRefueling img").attr("src", require('../image/close.png'));
//获取钉钉授权
import ddConfigs from '../js/ddConfigs'
ddConfigs.config();
//调取钉钉接口
dd.error(function (error) {
    new Toast("钉钉授权验证失败，请关闭页面重新打开")
    console.log(error)
});
dd.ready(function () {
    let userAgent = navigator.userAgent,
        number = 40,
        isiOS = !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isiOS) {
        number = 80;
    }
    //上传图片
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
                        length++;
                        let array_void = [];
                        $(".void").each(function () {
                            if ($(this).val() != '') {
                                array_void.push($(this).val());
                            }
                        })
                        if (length > 3 && array_void.length == 5) {
                            $(".refueling-submit button").addClass("refueling-nextbutton");
                        } else {
                            $(".refueling-submit button").removeClass("refueling-nextbutton");
                        }
                    }
                },
                onFail: function (err) {
                    //new Toast("上传图片失败")
                }
            });
        } else {
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
                        let array_void = [];
                        $(".void").each(function () {
                            if ($(this).val() != '') {
                                array_void.push($(this).val());
                            }
                        })
                        if (length > 3 && array_void.length == 5) {
                            $(".refueling-submit button").addClass("refueling-nextbutton");
                        } else {
                            $(".refueling-submit button").removeClass("refueling-nextbutton");
                        }
                    }
                },
                onFail: function (err) {
                    //new Toast("上传图片失败")
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
                new Toast("查看大图失败")
            }
        });
    });
    //移除当前图片
    $(".swat-photo").on("click", function () {
        length--;
        let array_void = [];
        $(".void").each(function () {
            if ($(this).val() != '') {
                array_void.push($(this).val());
            }
        })
        if (length > 3 && array_void.length == 5) {
            $(".refueling-submit button").addClass("refueling-nextbutton");
        } else {
            $(".refueling-submit button").removeClass("refueling-nextbutton");
        }
        $(this).addClass("none");
        $(this).siblings('.end-photo').addClass("none");
        $(this).siblings('.check-photo').addClass("none");
        $(this).siblings(".uploadIcon").show();
        let index = imageArray.indexOf($(this).siblings(".image").val());
        imageArray.splice(index, 1);
        $(this).siblings(".image").val("");
    });
    //提交信息跳转页面
    var clicktag = 0;
    $(".refueling-submit button").on("click", function () {
        if ($(this).hasClass('refueling-nextbutton')) {
            if (clicktag == 0) {
                clicktag = 1;
                setTimeout(function () {
                    clicktag = 0
                }, 8000);
                //录入加油信息接口
                let param,apiUrl;
                if(type==1){
                	param = {
                		order_id:order_id,
                		item_id:'3',
                		mobile: sessionStorage.getItem("mobile"),
	                    city_id: sessionStorage.getItem("carcity_id"),//车辆当前城市id
                		params:{
                			name:$(".choice-oilstate").val(),//加油站名称, 
                			lat: sessionStorage.getItem("oilerstationLat"),//加油站纬度
	                    	lng: sessionStorage.getItem("oilerstationLng"),//加油站经度
	                    	address: sessionStorage.getItem("address"),//加油站详细地址
                			gas_card:$(".oiler-number").val(),//加油卡编号,
                			oil_mass:$(".oilamount").val(),//加油升数,
                			fee:$(".oilmoney").val(),//加油金额,
                			oil_card_fee:$(".oilbalance").val(),
                			photo_string:"", 
                			key:"",
                			type:'1',//加油工单
                		}
                	}
                	apiUrl = '/vehicle-office/operate';
                }else{
	                param = {
	                    mobile: sessionStorage.getItem("mobile"),
	                    city_id: sessionStorage.getItem("carcity_id"),//车辆当前城市id
	                    work_order_id: sessionStorage.getItem("id"),//工单id
	                    car_id: sessionStorage.getItem('car_id'),//车辆id
	                    name: $(".choice-oilstate").val(),//加油站名称
	                    lat: sessionStorage.getItem("oilerstationLat"),//加油站纬度
	                    lng: sessionStorage.getItem("oilerstationLng"),//加油站经度
	                    address: sessionStorage.getItem("address"),//加油站详细地址
	                    gas_card: $(".oiler-number").val(),//加油卡编号
	                    oil_mass: $(".oilamount").val(),//加油升数
	                    fee: $(".oilmoney").val(),//加油金额
	                    oil_card_fee: $(".oilbalance").val(),//油卡余额
	                    PhoneInfo: sessionStorage.getItem("PhoneInfo") || '',
	                    key: '',//key值
	                    type: '1',//加油工单
	                    photo_string: ''
	                }
	                apiUrl = '/work-order/create-car-oil';
                }
                $(".oilermodel").each(function () {
                    if ($(this).is(':checked')) {
                    	if(type==1){
                    		param.params.oil_type = $(this).val();//油品型号
                    	}else{
                        	param.oil_type = $(this).val();//油品型号
                       	}
                    }
                });
                let array = [];
                $(".image").each(function () {
                    array.push($(this).val())
                })
                if(type==1){
                	param.params.photo_string = array.join(',');
                	
                }else{
                	param.photo_string = array.join(',');
                }
                if(type==1){
                	if (param.params.oil_mass > box_type) {
	                    new Toast("请重新填写加油量");
	                    return false;
	                }
                }else{
	                if (param.oil_mass > box_type) {
	                    new Toast("请重新填写加油量");
	                    return false;
	                }
                }
                if(type==1){
                	if (param.params.oil_type == '92') {
	                    if (Number(price) * 0.75 * param.params.oil_mass > param.params.fee || Number(price) * 1.08 * param.params.oil_mass < param.params.fee) {
	                        $(".alert_refuewindow2").removeClass("none");
	                    } else {
	                        $.post(getApiUrl(apiUrl), param, function (data) {
	                            if (data.status == '0') {
	                                window.location.href = "../../manageOrderOfficecar/index.html#/orderDetail?order_id="+order_id;
	                            } else {
	                                new Toast(data.msg);
	                            }
	                        });
	                    }
	                } else if (param.params.oil_type == '95') {
	                    if (Number(price) * 0.75 * param.params.oil_mass > param.params.fee || Number(price) * 1.16 * param.params.oil_mass < param.params.fee) {
	                        $(".alert_refuewindow2").removeClass("none");
	                    } else {
	                        $.post(getApiUrl(apiUrl), param, function (data) {
	                            if (data.status == '0') {
	                                window.location.href = "../../manageOrderOfficecar/index.html#/orderDetail?order_id="+order_id;
	                            } else {
	                                new Toast(data.msg);
	                            }
	                        });
	                    }
	                } else {
	                    if (Number(price) * 0.75 * param.params.oil_mass > param.params.fee || Number(price) * 1.3 * param.params.oil_mass < param.params.fee) {
	                        $(".alert_refuewindow2").removeClass("none");
	                    } else {
	                        $.post(getApiUrl(apiUrl), param, function (data) {
	                            if (data.status == '0') {
	                                window.location.href = "../../manageOrderOfficecar/index.html#/orderDetail?order_id="+order_id;
	                            } else {
	                                new Toast(data.msg);
	                            }
	                        });
	                    }
	                }
                }else{
	                if (param.oil_type == '92') {
	                    if (Number(price) * 0.75 * param.oil_mass > param.fee || Number(price) * 1.08 * param.oil_mass < param.fee) {
	                        $(".alert_refuewindow2").removeClass("none");
	                    } else {
	                        $.post(getApiUrl(apiUrl), param, function (data) {
	                            if (data.status == '0') {
	                                window.location.href = "./newoiler.html"
	                            } else {
	                                new Toast(data.msg);
	                            }
	                        });
	                    }
	                } else if (param.oil_type == '95') {
	                    if (Number(price) * 0.75 * param.oil_mass > param.fee || Number(price) * 1.16 * param.oil_mass < param.fee) {
	                        $(".alert_refuewindow2").removeClass("none");
	                    } else {
	                        $.post(getApiUrl(apiUrl), param, function (data) {
	                            if (data.status == '0') {
	                                window.location.href = "./newoiler.html"
	                            } else {
	                                new Toast(data.msg);
	                            }
	                        });
	                    }
	                } else {
	                    if (Number(price) * 0.75 * param.oil_mass > param.fee || Number(price) * 1.3 * param.oil_mass < param.fee) {
	                        $(".alert_refuewindow2").removeClass("none");
	                    } else {
	                        $.post(getApiUrl(apiUrl), param, function (data) {
	                            if (data.status == '0') {
	                                window.location.href = "./newoiler.html"
	                            } else {
	                                new Toast(data.msg);
	                            }
	                        });
	                    }
	                }
                }
            } else {
                new Toast("请5秒后再试")
            }
        }
    });
    //继续提交
    $(".alert-sure").on("click", function () {
        let param,apiUrl;
        if(type==1){
        	param = {
        		order_id:order_id,
        		item_id:'3',
        		mobile: sessionStorage.getItem("mobile"),
                city_id: sessionStorage.getItem("carcity_id"),//车辆当前城市id
        		params:{
        			name:$(".choice-oilstate").val(),//加油站名称, 
        			lat: sessionStorage.getItem("oilerstationLat"),//加油站纬度
                	lng: sessionStorage.getItem("oilerstationLng"),//加油站经度
                	address: sessionStorage.getItem("address"),//加油站详细地址
        			gas_card:$(".oiler-number").val(),//加油卡编号,
        			oil_mass:$(".oilamount").val(),//加油升数,
        			fee:$(".oilmoney").val(),//加油金额,
        			oil_card_fee:$(".oilbalance").val(),
        			photo_string:"", 
        			key:"",
        			type:'1',//加油工单
        		}
        	}
        	apiUrl = '/vehicle-office/operate';
        }else{
            param = {
                mobile: sessionStorage.getItem("mobile"),
                city_id: sessionStorage.getItem("carcity_id"),//车辆当前城市id
                work_order_id: sessionStorage.getItem("id"),//工单id
                car_id: sessionStorage.getItem('car_id'),//车辆id
                name: $(".choice-oilstate").val(),//加油站名称
                lat: sessionStorage.getItem("oilerstationLat"),//加油站纬度
                lng: sessionStorage.getItem("oilerstationLng"),//加油站经度
                address: sessionStorage.getItem("address"),//加油站详细地址
                gas_card: $(".oiler-number").val(),//加油卡编号
                oil_mass: $(".oilamount").val(),//加油升数
                fee: $(".oilmoney").val(),//加油金额
                oil_card_fee: $(".oilbalance").val(),//油卡余额
                PhoneInfo: sessionStorage.getItem("PhoneInfo") || '',
                key: '',//key值
                type: '1',//加油工单
                photo_string: ''
            }
            apiUrl = '/work-order/create-car-oil';
        }
        $(".oilermodel").each(function () {
            if ($(this).is(':checked')) {
            	if(type==1){
            		param.params.oil_type = $(this).val();//油品型号
            	}else{
                	param.oil_type = $(this).val();//油品型号
            	}
            }
        });
        let array = [];
        $(".image").each(function () {
            array.push($(this).val())
        })
        if(type==1){
    		param.params.photo_string = array.join(',');//油品型号
    	}else{
       		param.photo_string = array.join(',');
    		
    	}
        $(".alert_refuewindow2").addClass("none");
        $.post(getApiUrl(apiUrl), param, function (data) {
            if (data.status == '0') {
            	if(type==1){
	                window.location.href = "../../manageOrderOfficecar/index.html#/orderDetail?order_id="+order_id;
            	}else{
                	window.location.href = "./newoiler.html"
            	}
            } else {
                new Toast(data.msg);
            }
        });
    });
    //更改信息
    $(".alert-cancel").on("click", function () {
        $(".alert_refuewindow2").addClass("none");
    });
    //保留两位小数
    $(".ifnumber").blur(function () {
        let regPos = /^\d+(\.\d+)?$/; //非负浮点数
        if (!regPos.test($(this).val())) {
            $(this).val('');
            new Toast("请输入大于等于0的数字");
        }
        if ($(this).val() != '' && !/^-?\d+\.?\d{0,2}$/.test($(this).val())) {
            new Toast("请保留两位小数")
        }
        let num = Number($(this).val());
        $(this).val(num.toFixed(2));
    });
    //input框的onchange事件
    $(".void").on("change", function () {
        let array_void = [];
        $(".void").each(function () {
            if ($(this).val() != '') {
                array_void.push($(this).val());
            }
        })
        if (length > 3 && array_void.length == 5) {
            $(".refueling-submit button").addClass("refueling-nextbutton");
        } else {
            $(".refueling-submit button").removeClass("refueling-nextbutton");
        }
    });
    //选择加油站跳转页面
    $(".choice-oilstate").on("click", function () {
    	console.log('222')
        sessionStorage.setItem("imageArray", imageArray);//本地存储已上传的图片
        sessionStorage.setItem("imageArray1", $(".image1").val());//缓存第1-4张图片
        sessionStorage.setItem("imageArray2", $(".image2").val());
        sessionStorage.setItem("imageArray3", $(".image3").val());
        sessionStorage.setItem("imageArray4", $(".image4").val());
        $(".oilermodel").each(function () {
            if ($(this).is(':checked')) {
                sessionStorage.setItem("oilermodel", $(this).val());//本地缓存油品型号
            }
        });
        sessionStorage.setItem("oiler-number", $(".oiler-number").val());//本地缓存油卡编号
        sessionStorage.setItem("oilamount", $(".oilamount").val());//本地缓存加油数量
        sessionStorage.setItem("oilmoney", $(".oilmoney").val());//本地缓存加油金额
        sessionStorage.setItem("oilbalance", $(".oilbalance").val());//本地缓存油卡余额
        window.location.href = "./choiceoilerstate.html";
    });
});
//清空input框的数据
$(".clear-icon").on("click", function () {
    $(this).parent().find("input").val('');
    $(this).addClass("none");
    $(this).parent().find(".select-oilnumber").show();
    let array_void = [];
    $(".void").each(function () {
        if ($(this).val() != '') {
            array_void.push($(this).val());
        }
    })
    if (length > 3 && array_void.length == 5) {
        $(".refueling-submit button").addClass("refueling-nextbutton");
    } else {
        $(".refueling-submit button").removeClass("refueling-nextbutton");
    }
});
var flag = true;
//查询油卡信息结果弹框
$(".select-oilnumber").on("click", function () {
    flag = false;
    //油卡查询
    var param = {
        mobile: sessionStorage.getItem("mobile"),
        city_id: sessionStorage.getItem("carcity_id"),//车辆当前城市id
        PhoneInfo: sessionStorage.getItem("PhoneInfo") || '',
        oil_card: $(".oiler-number").val()
    }
    if (param.oil_card == '') {
        $(".alert_refuewindow").removeClass("none");
        $(".alert-refuecontent").text("请输入油卡编号后四位");
        $(".alert-refuecontent").css("padding-top", '0rem');
        $(".alert-refuecontent").css("line-height", '10rem');
        $(".alert-refuecontent").css("text-align", 'center');
        setTimeout(function () {
            flag = true;
        }, 2000)
    } else {
        $.post(getApiUrl('/work-order/search-oil-card'), param, function (data) {
            if (data.status == '0') {
                if (data.data.length != 0) {
                    if (data.data.length == 1) {
                        $(".oiler-number").val(data.data[0].card_no);//只有一条直接带入数据
                    } else {
                        $(".alert_refuewindow").removeClass("none");
                        var str = '<p>油卡编号（' + data.data.length + '条）</p>';
                        for (var i = 0; i < data.data.length; i++) {
                            str += "<input type='radio' value='" + data.data[i].card_no + "' class='' name='number'/>" + data.data[i].card_no + "<br/>";
                        }
                        $(".alert-refuecontent").html(str);
                        $(".alert-refuecontent input").eq(0).attr("checked", true);
                        $(".alert-refuecontent").css("padding-top", '.3rem');
                        $(".alert-refuecontent").css("line-height", '1.3rem');
                    }
                } else {
                    new Toast("未查询到该油卡")
                    $(".oiler-number").val('');
                    $(".refueling-submit button").removeClass("refueling-nextbutton");
                }
            } else {
                new Toast(data.msg);
                $(".oiler-number").val('');
                $(".refueling-submit button").removeClass("refueling-nextbutton");
            }
        });
        setTimeout(function () {
            flag = true;
        }, 2000)
    }
});
//input框验证油卡信息
$(".oiler-number").on("blur", function () {
    if (flag) {
        if ($(this).val() == '') {
            new Toast("油卡编号输入不能为空")
        } else {
            let param = {
                mobile: sessionStorage.getItem("mobile"),
                city_id: sessionStorage.getItem("carcity_id"),//车辆当前城市id
                PhoneInfo: sessionStorage.getItem("PhoneInfo") || '',
                oil_card: $(this).val()
            }
            $.post(getApiUrl('/work-order/search-oil-card'), param, function (data) {
                var result = data,
                    status = result.status,
                    msg = result.msg,
                    data = result.data;
                if (status == '0') {
                    if (data.length != 0) {
                        $(".oiler-number").val(data[0].card_no);//只有一条直接带入数据
                        if (data.length == 1) {

                        } else {
                            $(".alert_refuewindow").removeClass("none");
                            let str = '<p>油卡编号（' + data.length + '条）</p>';
                            for (var i = 0; i < data.length; i++) {
                                str += "<input type='radio' value='" + data[i].card_no + "' class='' name='number'/>" + data[i].card_no + "<br/>";
                            }
                            $(".alert-refuecontent").html(str);
                            $(".alert-refuecontent input").eq(0).attr("checked", true);
                            $(".alert-refuecontent").css("padding-top", '.3rem');
                            $(".alert-refuecontent").css("line-height", '1.3rem');
                        }
                    } else {
                        new Toast("未查询到该油卡,请重新输入");
                        $(".oiler-number").val('');
                        $(".refueling-submit button").removeClass("refueling-nextbutton");
                    }
                } else {
                    new Toast(msg);
                    $(".oiler-number").val('');
                    $(".refueling-submit button").removeClass("refueling-nextbutton");
                }
            });
        }
    }
});
//关闭弹框
$(".alert-refuesure").on("click", function () {
    $(".alert_refuewindow").addClass("none");
    $(".oiler-number").val($(".alert-refuecontent input[type='radio']:checked").val());
    if ($(".oiler-number").val() != '') {
        $(".select-oilnumber").hide();
        $(".oiler-number").parent().find(".clear-icon").removeClass("none");
    }
});
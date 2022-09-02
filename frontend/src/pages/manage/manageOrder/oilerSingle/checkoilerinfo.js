/**
 * Created by Administrator on 2018/1/17.
 * xurr 181214 添加办公用车查看 type=1
 */
require('../css/public.css')
require('../css/oilerSingle/checkoilerinfo.css')
import $ from 'jquery'
import FoundationTools from '../js/functionAjax'
import getApiUrl from '../js/getApiUrl'
import myAjax from '../common/myAjax/withJq.js'
import {Confirm,Toast} from '../common/LikeAlert/index'
import waterMark from '../../../../../other_modules/like-manageOrder/waterMark'
//import ddTalk from '../js/ddTalk'
//验证页面是否在钉钉浏览器打开
//ddTalk.verify(navigator.userAgent);
//获取钉钉授权
import ddConfigs from '../js/ddConfigs'
var type = FoundationTools.getUrlParam('type');//type1 办公用车
var office_id = FoundationTools.getUrlParam('office_id')
ddConfigs.config()
dd.error(function (error) {
    new Toast("钉钉授权验证失败，请关闭页面重新打开")
});
//调取钉钉接口
dd.ready(function () {
    //初始化查询图片接口
    var param,apiUrl;
    if(type==1){
    	param = {
	        mobile: sessionStorage.getItem("mobile"),
	        id: office_id
	    };
	    apiUrl = '/vehicle-office/history-result'
    }else{
    	param = {
	        mobile: sessionStorage.getItem("mobile"),
	        work_order_id: sessionStorage.getItem("id"),//工单id
	        get_back_type: '3',
	        PhoneInfo: sessionStorage.getItem("PhoneInfo") || ''
	    };
	    apiUrl = '/work-order/card-gas'
    }
    var imageArray = [];//存放图片路径的数组
    myAjax.post(getApiUrl(apiUrl), param, function (data) {
        var result = data,
            status = result.status,
            photo_string = result.data.photo_string,//图片的路径
            picturearry = photo_string.split(","),//转化为数组
            data = result.data,
            msg = result.msg;
        if (status == '0') {
            $(".choice-oilstate").val(data.name);//加油站
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
            $(".img-circle").each(function (index, element) {
                console.log(index)
                $(this).attr("src", imageArray[index])
            })
            $(".img-val").each(function (index, element) {
                console.log(index)
                $(this).val(imageArray[index])
            })
        } else {
            new Toast(msg);
        }
        //钉钉查看大图
        $(".img-circle").on("click", function () {
            console.log(imageArray)
            var btn = $(this);
            dd.biz.util.previewImage({
                urls: imageArray,//图片地址列表,数组
                current: btn.parent().find(".img-val").val(),//当前显示的图片链接
                onSuccess: function (result) {
                    /**/
                },
                onFail: function (err) {
                    new Toast("查看大图失败")
                }
            });
        });
    });
});
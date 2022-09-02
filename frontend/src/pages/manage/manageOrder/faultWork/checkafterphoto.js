/**
 * Created by Administrator on 2017/12/25.
 */
require('../css/public.css')
require('../css/faultWork/checkafterphoto.css')
import $ from 'jquery'
import FoundationTools from '../js/functionAjax'
import getApiUrl from '../js/getApiUrl'
import myAjax from '../common/myAjax/withJq.js'
import {Confirm,Toast} from '../common/LikeAlert/index'
import waterMark from '../../../../../other_modules/like-manageOrder/waterMark'
import ddTalk from '../js/ddTalk'
//验证页面是否在钉钉浏览器打开
//ddTalk.verify(navigator.userAgent);
//接收URL参数
var record_id = FoundationTools.getUrlParam('record_id');//操作记录id
//调取钉钉接口
dd.error(function (error) {
    new Toast("钉钉授权验证失败，请关闭页面重新打开")
});
dd.ready(function () {
    //初始化查询图片接口
    var param = {
        mobile: sessionStorage.getItem("mobile"),
        order_id:sessionStorage.getItem("order_id"),//故障id
        id:record_id,
        item_id:'4'
    };
    var imageArray = [];//存放图片路径的数组
    var text = '<div>' + $(".checkafter-content>div").html() + '</div>';
    myAjax.post(getApiUrl('/vehicle-fault/item-result'), param, function (data) {
        if (data.status == '0') {
            imageArray = data.data.result;
            $(".checkafter-content").removeClass("none");
            for (var i = 1; i < imageArray.length; i++) {
                $(".checkafter-content").append(text);
            }
            $(".img-circle").each(function (index, element) {
                $(this).attr("src", imageArray[index])
            });
            $(".img-val").each(function (index, element) {
                $(this).val(imageArray[index])
            });
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
                        new Toast(err);
                    }
                });
            });
        } else {
            new Toast(data.msg)
        }
    });
});
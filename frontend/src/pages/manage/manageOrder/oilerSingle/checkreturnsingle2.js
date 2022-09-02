/**
 * Created by Administrator on 2018/1/17.
 */
require('../css/public.css')
require('../css/oilerSingle/checkreturnsingle.css')
import $ from 'jquery'
import FoundationTools from '../js/functionAjax'
import getApiUrl from '../js/getApiUrl'
import myAjax from '../common/myAjax/withJq.js'
import {Confirm,Toast} from '../common/LikeAlert/index'
import waterMark from '../../../../../other_modules/like-manageOrder/waterMark'
//import ddTalk from '../js/ddTalk'
//验证页面是否在钉钉浏览器打开
//ddTalk.verify(navigator.userAgent);
//接收URL参数
var id = FoundationTools.getUrlParam('id'),//工单id
    car_id = FoundationTools.getUrlParam('car_id'),
    photo_flag = FoundationTools.getUrlParam('photo_flag');
if (photo_flag == '0') {
    $(".photo-hide").remove();
    $(".returnpicture-content").removeClass("none");
} else {
    $(".returnpicture-content").removeClass("none");
}
dd.error(function (err) {
    alert('dd error: ' + JSON.stringify(err));
});
//调取钉钉接口
dd.ready(function () {
    //初始化查询图片接口
    var param = {
        mobile: sessionStorage.getItem("mobile"),
        work_order_id: sessionStorage.getItem("id"),//工单id
        car_id: sessionStorage.getItem("car_id"),//车辆id
        PhoneInfo: sessionStorage.getItem("PhoneInfo") || '',
        type: '2' //还车验车类型
    };
    var imageArray = [];//存放图片路径的数组
    myAjax.post(getApiUrl('/work-order/check-car'), param, function (data) {
        if (data.status == '0') {
            let photo_string = data.data.photo_string,//图片的路径
                picturearry = photo_string.split(",");//转化为数组
            imageArray = picturearry;
            $(".img-circle").each(function (index, element) {
                console.log(index)
                $(this).attr("src", imageArray[index])
            })
            $(".img-val").each(function (index, element) {
                console.log(index)
                $(this).val(imageArray[index])
            })
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
        } else {
            new Toast(data.msg)
        }
    });
});
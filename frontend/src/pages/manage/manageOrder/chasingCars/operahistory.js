/**
 * Created by Administrator on 2018/4/11.
 */
require('../css/public.css')
require('../css/chasingCars/operahistory.css')
import $ from 'jquery'
import FoundationTools from '../js/functionAjax'
import getApiUrl from '../js/getApiUrl'
import {Confirm,Toast} from '../common/LikeAlert/index'
import ddTalk from '../js/ddTalk'
//验证页面是否在钉钉浏览器打开
ddTalk.verify(navigator.userAgent);
//接收URL参数
var rental_id = FoundationTools.getUrlParam('rental_id');
var param = {
    mobile: sessionStorage.getItem('mobile'),
    id: rental_id,
    PhoneInfo: sessionStorage.getItem("PhoneInfo") || ''
}
$.post(getApiUrl('/car-catch/history'), param, function (data) {
    var result = data,
        status = result.status,
        msg = result.msg,
        str = '';
    $("body").removeClass("none");
    if (status == '0') {
        for (var i = 0; i < result.data.length; i++) {
            str += '<li><p>单据：' + rental_id + '</p><p>操作人：' + result.data[i].operator + '</p><p>类型：' + result.data[i].type + '</p><p>时间：' + result.data[i].oper_time + '</p><p>沟通备注：' + result.data[i].remark + '</p></li>';
        }
        $(".history-list").html(str);
    } else {
        new Toast(msg);
    }
});
//返回
$(".back-btn button").on("click", function () {
    window.history.back();
});
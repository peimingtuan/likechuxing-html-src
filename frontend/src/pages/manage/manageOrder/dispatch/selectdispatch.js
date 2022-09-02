/**
 * Created by Administrator on 2018/6/4.
 */
require('../css/public.css')
require('../css/dispatch/selectdispatch.css')
import $ from 'jquery'
import FoundationTools from '../js/functionAjax'
import getApiUrl from '../js/getApiUrl';
import myAjax from '../common/myAjax/withJq.js'
import {Confirm,Toast} from '../common/LikeAlert/index'
import waterMark from '../../../../../other_modules/like-manageOrder/waterMark'
import PullUpDown from '../../../../component/pullDonwRefresh/index'
import ddTalk from '../js/ddTalk'
//验证页面是否在钉钉浏览器打开
ddTalk.verify(navigator.userAgent);
//获取url参数
var branch_id = FoundationTools.getUrlParam('branch_id');//网点id
myAjax.post(getApiUrl('/car-dispatch/branch-info'), {
    mobile:sessionStorage.getItem('mobile'),
    branch_id:branch_id
}, function (data) {
    let str = '';
    if(data.status=="0"){
        str += '<li><div class="div1"> <span class="net-id">' + data.data.id + '</span><br/><span>' + data.data.name + '</span></div>' +
            '<div class="div2"><span>' + data.data.lin_recommend_car + '</span><br/><span class="advise">建议</span></div><div class="div3"><span>' + data.data.dispatch_num + '</span><br/><span class="need-dispatch">需调入</span></div></li>';
    }else{
        new Toast(data.msg)
    }
    $(".selectdispatch").html(str);
});
//刷新页面
$(".selectdispatchRefle").on("click", function () {
    location.reload();
});
//搜索跳转页面
$(".dispatchSelect").on("click", function () {
    location.href="../carNetstock/netselect.html?type=2";
});
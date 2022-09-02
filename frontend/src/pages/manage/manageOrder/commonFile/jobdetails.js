/**
 * Created by Administrator on 2018/4/20.
 */
require('../css/public.css')
require('../css/commonFile/jobdetails.css')
import $ from 'jquery'
import FoundationTools from '../js/functionAjax'
import getApiUrl from '../js/getApiUrl'
import {Confirm,Toast} from '../common/LikeAlert/index'
import ddTalk from '../js/ddTalk'
import Loading from '../../../../component/loading'
//验证页面是否在钉钉浏览器打开
ddTalk.verify(navigator.userAgent);
//获取url参数
var type = FoundationTools.getUrlParam('type'),
    datastatus=FoundationTools.getUrlParam('datastatus');
//初始化工单详情接口
var param = {
    mobile: sessionStorage.getItem("mobile"),
    work_order_id: sessionStorage.getItem("id"),
    type: '1'//加油工单详情
}
var result = FoundationTools.syncEvent(param, getApiUrl('/work-order/detail')),
    status = result.status,
    msg = result.msg,
    data = result.data;
if (status == '0') {
    var strstart=data.vin.substring(0,11);
    var strend=data.vin.substring(11,17);
    var string = data.plate_no + " (<font class='font1'>" + strstart + "</font>"+strend + ")<span class='right'>ID" + data.id + "</span><br/>" +
        "<span>" + data.status_name + "</span><span>" + data.oil_type + "</span><span>" + data.brand_name + "</span>";
    $(".details-content .p1").html(string);
    //展示页面
    $(".body").removeClass("none");
}else{
    new Toast(msg)
}
//操作历史
var list = data.history,
    str = '';
for (var i = 0; i < list.length; i++) {
    if(list[i].step_type=='0'){
        str += '<li><span class="span1">&#xe608; ' + list[i].time + '</span><span class="span2">' + list[i].des + '</span><br/><span class="span3">' + list[i].username + '</span><span class="span3">（' + list[i].phone + '）</span><span>' + list[i].comment + '</span></li>';
    }else if(list[i].step_type=='1'){//取车
        if(data.photo_flag == '1') {//需要上传照片
            str += '<li><span class="span1">&#xe608; ' + list[i].time + '</span><span class="check check-get">查看取车&nbsp;&nbsp;&#xe623;</span><span class="span2">' + list[i].des + '</span><br/><span class="span3">' + list[i].username + '</span><span class="span3">（' + list[i].phone + '）</span></br><span><img class="get-img" src=""/>'+list[i].step_content +'</span></li>';
        }else{
            str += '<li><span class="span1">&#xe608; ' + list[i].time + '</span><span class="check check-get">已关闭</span><span class="span2">' + list[i].des + '</span><br/><span class="span3">' + list[i].username + '</span><span class="span3">（' + list[i].phone + '）</span></br><span><img class="get-img" src=""/>'+list[i].step_content +'</span></li>';
        }
    }else if(list[i].step_type=='3'){//加油
        str += '<li><span class="span1">&#xe608; ' + list[i].time + '</span><span class="check check-oiler">查看加油&nbsp;&nbsp;&#xe623;</span><span class="span2">' + list[i].des + '</span><br/><span class="span3">' + list[i].username + '</span><span class="span3">（' + list[i].phone + '）</span></br><span><img class="oiler-img" src=""/>'+list[i].step_content +'</span></li>';
    }else if(list[i].step_type=='4'){//还车
        str += '<li><span class="span1">&#xe608; ' + list[i].time + '</span><span class="check check-return">查看还车&nbsp;&nbsp;&#xe623;</span><span class="span2">' + list[i].des + '</span><br/><span class="span3">' + list[i].username + '</span><span class="span3">（' + list[i].phone + '）</span><span>' + list[i].comment + '</span></li>';
    }else if(list[i].step_type=='5'){//缴费
        str += '<li><span class="span1">&#xe608; ' + list[i].time + '</span><span class="check check-payment">查看&nbsp;&nbsp;&#xe623;</span><span class="span2">' + list[i].des + '</span><br/><span class="span3">' + list[i].username + '</span><span class="span3">（' + list[i].phone + '）</span><span>' + list[i].comment + '</span></li>';
    }else if(list[i].step_type=='6'){//完成
        if (data.end_branch_id != '0') {
            str += '<li><span class="span1">&#xe608; ' + list[i].time + '</span><span class="span2">' + list[i].des + '</span><br/><span class="span3">' + list[i].username + '</span><span class="span3">（' + list[i].phone + '）</span><span>' + list[i].comment + '</span></br><span><img class="end-img" src=""/>'+list[i].step_content +'</span></li>';
        }else{
            str += '<li><span class="span1">&#xe608; ' + list[i].time + '</span><span class="span2">' + list[i].des + '</span><br/><span class="span3">' + list[i].username + '</span><span class="span3">（' + list[i].phone + '）</span><span>' + list[i].comment + '</span>';
        }
    }
}
$(".history-list").html(str);
//图片加载
//取车
if (data.biz_type == '0') {
    $(".get-img").attr("src", require('../image/colorb.png'));
} else if (data.biz_type == '1') {
    $(".get-img").attr("src", require('../image/color-B.png'));
} else if (data.biz_type == '2') {
    $(".get-img").attr("src", require('../image/oiler.png'));
}
//还车
if (data.end_branch_type == '0') {
    $(".end-img").attr("src", require('../image/colorredb.png'));
} else if (data.end_branch_type == '1') {
    $(".end-img").attr("src", require('../image/color-redB.png'));
} else if (data.end_branch_type == '2') {
    if (data.end_branch_id != '0') {
        $(".end-img").attr("src", require('../image/oiler.png'));
    }
}
//加油站
$(".oiler-img").attr("src", require('../image/oiler.png'));
//跳转查看取车页
$(".check-get").on("click",function(){
    window.location.href="../oilerSingle/checksingle.html"
});
//跳转查看加油页
$(".check-oiler").on("click",function(){
    window.location.href="../oilerSingle/checkoilerinfo.html"
});
//跳转查看还车页
$(".check-return").on("click",function(){
    if(data.photo_flag=='1'){
        window.location.href="../oilerSingle/checkreturnsingle.html"
    }else{
        window.location.href="../oilerSingle/checkreturnsingle.html?photo_flag=0"//不需要上传照片
    }
});
//跳转查看缴费信息页
$(".check-payment").on("click",function(){
    window.location.href="./checkpayment.html"
});
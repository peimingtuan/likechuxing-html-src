require('../css/public.css')
require('../css/faultWork/passothergroup.css')
import $ from 'jquery'
import FoundationTools from '../js/functionAjax'
import getApiUrl from '../js/getApiUrl';
import myAjax from '../common/myAjax/withJq.js'
import {Select} from '../../../../component/Select/index'
import {Confirm,Toast} from '../common/LikeAlert/index'
import waterMark from '../../../../../other_modules/like-manageOrder/waterMark'
import ddTalk from '../js/ddTalk'
//验证页面是否在钉钉浏览器打开
//ddTalk.verify(navigator.userAgent);
waterMark({watermark_txt: sessionStorage.getItem('userName') + '-' + sessionStorage.getItem('mobile')});
//初始化获取数据
var resultData = JSON.parse(sessionStorage.getItem("resultData3")),
    img,
    strstart = resultData.vin.substring(0, 11),
    strend = resultData.vin.substring(11, 17);
if (resultData.biz_type == '0') {
    img = require('../image/mapb.png');
} else if (resultData.biz_type == '1') {
    img = require('../image/map-B.png');
} else if (resultData.biz_type == '2') {
    img = require('../image/mapoiler.png');
}
var strtop = '<span>' + resultData.plate_no + '(<font class="font1">' + strstart + '</font>' + strend + ')</span><span>故障' + resultData.id + '</span><br/>' +
    '<span>' + resultData.status_name + '</span><span>约续航' + resultData.remain + '公里</span><span>' + resultData.brand_name + ' ' + resultData.model_name + '</span><br/>' +
    '<span class="branch_addr"><img class="img1" src="' + img + '"/>' + resultData.branch_name + resultData.parking_floor + '层 ' + resultData.parking_no + '车位 </span> ';
$(".othergroup-content").html(strtop);
//跳转车辆当前位置
$(".othergroup-content .branch_addr").on("click", function () {
    location.href = "../oilerSingle/carLocation.html?name=" + resultData.plate_no;
});
//提交按钮点亮
$(".void_write").on("input", function () {
    if ($(this).val().length > 0) {
        $(".othergroup-nextbtn button").addClass("submit-btn");
    } else {
        $(".othergroup-nextbtn button").removeClass("submit-btn");
    }
});
//转交组
$(".othergroup-state").on("click", function () {
    new Select({
        name: '转交至',
        options: [{name:'保养'},{name:'保险'}],
        callback: function (item) {
            $(".group-state").val(item.name);
            $(".group-stateid").val(item.name);
        }
    })
});
//提交下一页
var clicktag = 0;
$(".othergroup-nextbtn button").on("click", function () {
    if ($(this).hasClass("submit-btn")) {
        if($(".group-stateid").val()==''){
            new Toast("请选择转交组")
            return false;
        }
        if (clicktag == 0) {
            clicktag = 1;
            //停车缴费接口
            let param = {
                mobile: sessionStorage.getItem('mobile'),
                order_id: sessionStorage.getItem('order_id'),//故障工单id
                item_id: '9',//操作项id
                params:{
                    group:$(".group-stateid").val(),//组名称
                    remark:$(".void_write").val(),//备注信息
                }
            }
            myAjax.post(getApiUrl('/vehicle-fault/operate'),param, function (data) {
                if (data.status == '0') {
                    location.href="./faultend.html";
                } else {
                    new Toast(data.msg);
                }
            });
            setTimeout(function () {
                clicktag = 0;
            }, 5000);
        }
    }
});
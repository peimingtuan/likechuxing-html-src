/**
 * Created by Administrator on 2018/4/20.
 */
require('../css/public.css')
require('../css/faultWork/recordtails.css')
import $ from 'jquery'
import FoundationTools from '../js/functionAjax'
import getApiUrl from '../js/getApiUrl'
import myAjax from '../common/myAjax/withJq.js'
import {Confirm,Toast} from '../common/LikeAlert/index'
import ddTalk from '../js/ddTalk'
//验证页面是否在钉钉浏览器打开
//ddTalk.verify(navigator.userAgent);
//获取故障工单详情
myAjax.post(getApiUrl('/vehicle-fault/order-detail'), {
    mobile: sessionStorage.getItem('mobile'),
    order_id: sessionStorage.getItem('order_id')//故障工单id
}, function (data) {
    if (data.status == '0') {
        let strstart = data.data.vin.substring(0, 11),
            strend = data.data.vin.substring(11, 17);
        let string = data.data.plate_no + " (<font class='font1'>" + strstart + "</font>" + strend + ")<span class='right'>故障" + data.data.id + "</span><br/>" +
            "<span>" + data.data.status_name + "</span><span>续航里程" + data.data.remain_km + "km</span><span>" + data.data.brand_name + " " + data.data.model_name + "</span>";
        $(".recordtails-content .p1").html(string);
        //展示页面
        $("body").removeClass("none");
    } else {
        new Toast(data.msg);
    }
});

//操作历史
myAjax.post(getApiUrl('/vehicle-fault/operate-history'), {
    mobile: sessionStorage.getItem("mobile"),
    order_id: sessionStorage.getItem("order_id")
}, function (data) {
    if (data.status == '0') {
        let str = '';
        for (var i = 0; i < data.data.length; i++) {
            let checkli = '';
            if (data.data[i].item_id == '2') {
                checkli = '<span class="check check-before right">查看<input class="id" type="hidden" value="' + data.data[i].id + '" />&nbsp;&nbsp;&#xe623;</span>';
            } else if (data.data[i].item_id == '3') {
                checkli = '<span class="check check-part right">查看<input class="id" type="hidden" value="' + data.data[i].id + '" />&nbsp;&nbsp;&#xe623;</span>';
            } else if (data.data[i].item_id == '4') {
                checkli = '<span class="check check-after right">查看<input class="id" type="hidden" value="' + data.data[i].id + '" />&nbsp;&nbsp;&#xe623;</span>';
            } else if (data.data[i].item_id == '10') {
                checkli = '<span class="check check-payment right">查看<input class="id" type="hidden" value="' + data.data[i].id + '" />&nbsp;&nbsp;&#xe623;</span>';
            }
            str += '<li><span class="span1">&#xe608;' + data.data[i].time + '</span>' + checkli + '<span class="span2">' + data.data[i].operate + '</span><br/><span class="span3">' + data.data[i].real_name + '</span>' +
                '<span class="span3">(' + data.data[i].user_name + ')</span><br/>';
            if (data.data[i].item_id == '6') {
                str += '<span>';
                if (data.data[i].remark.name) {
                    if (data.data[i].remark.biz_type == '0') {
                        str += '<img class="net_type" src="' + require('../image/colorredb.png') + '" />' + data.data[i].remark.name + ' ';
                    } else {
                        str += '<img class="net_type" src="' + require('../image/color-redB.png') + '" />' + data.data[i].remark.name + ' ';
                    }
                }
                str += data.data[i].remark.remark + '</span></li>';
            } else {
                str += '<span>' + data.data[i].remark + '</span></li>'
            }
        }
        $(".recordtails-list").html(str);
        //跳转查看更换配件前
        $(".check-before").on("click", function () {
            window.location.href = "./checkbeforephoto.html?record_id=" + $(this).find(".id").val();
        });
        //跳转查看更换配件页面
        $(".check-part").on("click", function () {
            window.location.href = "./changeparts.html?record_id=" + $(this).find(".id").val() + "&finshed=1";
        });
        //跳转查看更换配件后
        $(".check-after").on("click", function () {
            window.location.href = "./checkafterphoto.html?record_id=" + $(this).find(".id").val();
        });
        //跳转查看缴费信息页
        $(".check-payment").on("click", function () {
            window.location.href = "./checkpayment2.html?record_id=" + $(this).find(".id").val();
        });
    } else {
        new Toast(data.msg)
    }
});

/**
 * Created by Administrator on 2018/2/11.
 */
require('./css/public.css')
require('./css/couponVoucher.css')
import rem from '../../../component/rem'
import getActivityapiUrl from '../../../js/getActivityapiUrl'
import myAjax from '../../../component/myAjax'
import toast from '../../../component/toast'
import parseURL from '../../../js/parseURL'
import $ from 'jquery'
import {IsIos} from '../../../js/UserAgent'
import downloadUrl from '../../../component/downloadUrl'
import formatCouponData from '../../../component/couponList/formatCouponData'
require('./css/coupon.less')
let couponBox = require('../../../component/couponList/couponBox.pug')
//初始化加载图片
$(".imgicon img").attr("src", require("./images/youhui.png"));
let query = parseURL(window.location.search).query
$('#download').click(function () {
    //appMutual.jumpLoginAndCloseThisWebview()//登陆APP
    if (IsIos()) {
        window.location.href = downloadUrl.appleStore
    } else {
        window.location.href = downloadUrl.yingyongbao
    }
})
var amount = 0;
myAjax.post(getActivityapiUrl('coupon/list'), {
    uuid: query.uuid,
    sign: query.sign,
    status: 0,
    begin: 0
}, function (data) {
    if (data.status !== 0) {
        toast(data.msg)
        return
    }

    if (data.data.length === 0) {
        $(".aleadyreceive").removeClass("none");
        $(".getcontent").addClass("none");
        $("#download").text("我要领券")
        return
    }
    if (data.data.length != 0) {
        for (var i = 0; i < data.data.length; i++) {
            amount += Number(data.data[i].value);
        }
        if (query.new_user == "1") {
            $(".getcontent>p").text("恭喜您！获得" + amount + "元优惠券")
        } else {
            $(".getcontent>p").text("您已经领取！已有" + amount + "元优惠券")
        }
    }
    let str = data.data.map(item => {
        return couponBox(formatCouponData(item))
    }).join('')
    $('.coupon_list .msg').replaceWith(str)
})

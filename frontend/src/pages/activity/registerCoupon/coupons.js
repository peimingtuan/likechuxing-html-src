/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: coupons
 Author: garvey
 Version: 1.0.0
 Date: 2017/11/14-下午7:15
 Description:
 Demo:
 Others:
 *************************************************/
require('./css/coupons.less')
import getActivityapiUrl from '../../../js/getActivityapiUrl'
import myAjax from '../../../component/myAjax'
import toast from '../../../component/toast'
import parseURL from '../../../js/parseURL'
import $ from 'jquery'
import {IsIos} from '../../../js/UserAgent'
import downloadUrl from '../../../component/downloadUrl'
import formatCouponData from '../../../component/couponList/formatCouponData'
import Umeng from '../../../component/umeng'
new Umeng(1273055684)
let couponBox = require('../../../component/couponList/couponBox.pug')
require('../../../component/couponList/coupon.less')

let query = parseURL(window.location.search).query

$('#download').click(function() {
	if(IsIos()){
		window.location.href = downloadUrl.appleStore
	}else{
		window.location.href = downloadUrl.yingyongbao
	}
})

myAjax.post(getActivityapiUrl('coupon/list'), {
	uuid: query.uuid,
	sign: query.sign,
	status: 0,
	begin: 0
}, function (data){
	if(data.status !== 0 ){
		toast(data.msg)
		return
	}

	if(data.data.length === 0){
		$('li.msg').remove()
		$('.coupon_list').append('<li class="empty"><p>您已经领取</p><p>快去邀请好友获得更多优惠券吧</p><img src="'+require('./images/empty_coupon.png')+'" /><p class="out">优惠券已用完</p></li>')
		return
	}

	let str = data.data.map(item => {
		return couponBox(formatCouponData(item))
	}).join('')
	$('.coupon_list .msg').replaceWith(str)
})

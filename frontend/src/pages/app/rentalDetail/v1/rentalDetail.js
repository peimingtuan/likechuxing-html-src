/**
 * Created by garvey on 2017/8/18.
 */
require('./css/rentalDetails.less')
require('../../../js/polyfills')
import $ from 'jquery'
import getApiUrl from '../../../js/getApiUrl';
import format from '../../../js/function/format';
import parseURL from './js/parseURL';
import toast from '../../../component/toast'
import Loading from '../../../component/loading'
import myAjax from '../../../component/myAjax/withJq'
import Time from '../../../js/function/Time'

require('./template/detail.less')
let detailBox = require('./template/detail.pug')

let arg = parseURL(window.location.href).query;
let loading = new Loading()
init()

function getCostDetail(arg){
	let data = {
		uuid:arg.uuid,
		sign:arg.sign,
		rental_no:arg.rental_no
	}

	myAjax.post(getApiUrl('/rental-history/fee-detail'), data, function(data){
		if(data.status != 0){
			toast(data.msg)
		}else{
			$('.detail').show()
			loadCostDetail(formatData(data.data))
		}
	})

	function formatData(data){
		let price_desc = data.price_desc.split('+');
		let dt_distance_price = price_desc[0].match(/[\d\.]+/).toString();
		let dt_time_price = price_desc[1].match(/[\d\.]+/).toString();
		return {
			distance: Number(data.distance).toFixed(1),
			total_time:new Time().duration2(data.total_time),
			total_fee:data.fee_total,

			dt_distance_price:dt_distance_price,
			dt_time_price:dt_time_price,
			price_extra:data.price_extra,

			km_fee:data.km_fee,
			time_fee:data.time_fee,
			deal_fee:data.fee_total,
			parking_fee_in:data.parking_fee_in,
			coupon_fee:Math.abs(+data.coupon_fee).toFixed(2),
			balance:Math.abs(+data.balance).toFixed(2),
			actual_fee: data.actual_fee,

			discount_msg:data.discount_msg,
			discount_fee:format.money(data.discount_fee),
			discount_km:Number(data.discount_km).toFixed(1),
			discount_min:data.discount_time,

			book_time: data.book_time,
			begin_time: data.begin_time,
			end_time: data.end_time,
			pay_time: data.pay_time,
			auto_cancel: data.auto_cancel,
			is_cancel: data.is_cancel
		}
	}
}

function loadCostDetail(data){
	loading.destroy()

	let str_operate = '<li><div>' + format.time(data.book_time, 0) + '</div><div><span class="three_points"></span>预定成功</div></li>';
	if (+data.begin_time > 0) {//有开始时间
		str_operate += '<li><div>' + format.time(data.begin_time, 0) + '</div><div><span class="three_points"></span>计费开始</div></li>';
	}
	if (+data.end_time > 0) {
		if (data.is_cancel) {//取消的订单
			if (data.auto_cancel) {//系统取消
				str_operate += '<li class="sys_cancel"><div>' + format.time(data.end_time, 0) + '</div><div class="two_point"><span class="three_points"></span>取消成功<p>超3小时系统取消</p></div></li>';
			} else {//顾客取消
				str_operate += '<li><div>' + format.time(data.end_time, 0) + '</div><div class="two_point"><span class="three_points"></span>取消成功</div></li>';
			}
		} else {//顺利完成的订单
			str_operate += '<li><div>' + format.time(data.end_time, 0) + '</div><div><span class="three_points"></span>还车成功</div></li>';
		}
	}
	if (+data.pay_time > 0) {//有支付
		str_operate += '<li><div>' + format.time(data.pay_time, 0) + '</div><div><span class="three_points"></span>系统扣款成功</div></li>';
	}
	data.operateList = str_operate
	$('.detail').html(detailBox(data))
	if(data.discount_msg){
		$('.discount').show()
	}
}

function init () {
	if(arg.uuid && arg.sign && arg.rental_no){
		getCostDetail(arg);
	}else{
		toast('网页开小差了，请返回重试，04');
		setTimeout(function(){
			window.history.back()
		},2500)
	}
}

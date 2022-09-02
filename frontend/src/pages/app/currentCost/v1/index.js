/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey
 Version: 1.0.0
 Date: 2017/11/2-下午3:18
 Description:
 Demo:
 Others:
 *************************************************/
require('./index.less')
require('../../../css/buttons/button-animate-feedback')
import $ from 'jquery'
import Time from '../../../js/function/Time'
import format from '../../../js/function/format'
import parseUrl from '../../../js/parseURL'
const publicMsg = require('./template/publicMsg.pug')

let query = parseUrl(window.location.search).query
/*
query = {
	price_km:"1.20",
	price_min:"0.12"
}
*/

if(query.hasOwnProperty('total_money')){
	let data = {
		price_km: format.money(query.price_km),
		price_min: format.money(query.price_min),
		total_km: Number(query.total_km).toFixed(1),
		total_time: new Time().duration2(query.total_time),
		km_money: format.money(query.km_money),
		min_money: format.money(query.min_money),
		parking_fee_in: format.money(query.parking_fee_in),
		total_money: format.money(query.total_money)
	}

	if(query.discount_msg){
		let msg = decodeURIComponent(query.discount_msg)
		let title = decodeURIComponent(query.discount_title)
		$('.explainBox').before(publicMsg({msg:'您已参加 "'+title+'" 活动'}))
		data.discount_min = decodeURIComponent(query.discount_time)
		data.discount_km = Number(query.discount_km).toFixed(1)
		data.discount_fee = format.money(query.discount_fee)
		$('.discount').show()
		$('.discount.msg .itemName').text(msg)
	}

	for (let key in data){
		$('#'+key).text(data[key])
	}
}
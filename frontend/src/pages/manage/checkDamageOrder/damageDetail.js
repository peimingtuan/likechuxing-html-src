/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: damageDetail
 Author: garvey
 Version: 1.0.0
 Date: 2017/10/30-下午6:55
 Description:
 Demo:
 Others:
 *************************************************/
require('./css/damageDetail.less')

require('./js/common')
import getUuid from '../../../component/manageApp_getUuidFromLocal'

import $ from 'jquery'
import myAjax from '../../../component/myAjax'
import getApiUrl from './js/getApiUrl'
import parseUrl from '../../../js/parseURL'
import toast from '../../../component/toast'
import CarDamage from '../../../component/carDamage'
import opClass from '../../../js/function/opClass'

class Selected {
	constructor () {
		this.broken_level = null
		this.list = []
	}

	add (data) {
		if (this.broken_level === null){
			this.broken_level = data.broken_level
			this.activeButtons()
			this.list.push(data)
			return true
		}

		if (this.broken_level === data.broken_level){
			this.list.push(data)
			return true
		}else{
			return false
		}
	}

	remove (data){

		let rmIndex = this.list.findIndex( item => item.part_id === data.part_id)
		this.list.splice(rmIndex, 1)
		if(this.list.length === 0){
			this.broken_level = null
			this.activeButtons()
		}
	}

	getCarParts () {
		return this.list.map( item => item.part_id).join(',')
	}

	init () {
		this.broken_level = null
		this.list = []
		this.activeButtons()
	}

	activeButtons (){
		let immediately = $('#immediately')
		let later = $('#later')
		switch (this.broken_level){
			case null:
				immediately.addClass('disabled')
				later.addClass('disabled')
				break;
			case '0':
				immediately.removeClass('disabled')
				later.addClass('disabled')
				break;
			case '1':
				immediately.addClass('disabled')
				later.removeClass('disabled')
				break;
		}
	}
}
let selected = new Selected()

function init () {
	let carDamage = new CarDamage({
		parent: document.querySelector('.showContainer'),
		clickable: true,
		clickCallback: function (area){
			if (!carDamage.data.hasOwnProperty('part_data_' + area.id)){
				return
			}

			let img = $('.carDamage_container .part[data-id="'+area.id+'"]')
			if (img.hasClass('select')){
				img.removeClass('select')
				selected.remove(carDamage.data['part_data_' + area.id])
			}else{
				if (selected.add(carDamage.data['part_data_' + area.id])){
					img.addClass('select')
				}
			}
		}
	})

	let lastAjaxTime = 0

	function changePartStatus (opt){
		lastAjaxTime = new Date().getTime()
		myAjax.post(getApiUrl('/car/modify-broken-level'), {
			uuid:login.uuid,
			sign: login.sign,
			city_id: login.city_id,
			car_id: id,
			car_parts: opt.part_id,
			broken_level: opt.broken_level
		}, function (data) {
			if(data.status === 6001){
				window.location.href = '/login.html';
				return false
			}else if(data.status !== 0){
				toast(data.msg)
			}else{
				let parts = opt.part_id.split(',')
				parts.forEach( item => {
					carDamage.data['part_data_'+item].broken_level = opt.broken_level
				})

				//carDamage.data['part_data_'+opt.part_id].broken_level = opt.broken_level
				selected.init()
				if(opt.broken_level == 0){
					$('img.part.select').removeClass('red')
					setTimeout(function () {
						$('img.part.select').addClass('yellow').removeClass('select')
					}, 0)
				}else{
					$('img.part.select').removeClass('yellow')
					setTimeout(function () {
						$('img.part.select').addClass('red').removeClass('select')
					}, 0)
				}
				return
				if(opt.broken_level == 0){
					$('img.part[data-id="'+opt.part_id+'"]').removeClass('red')
					setTimeout(function () {
						$('img.part[data-id="'+opt.part_id+'"]').addClass('yellow')
					}, 0)
					$('#immediately').removeClass('disabled')
					$('#later').addClass('disabled')
				}else{
					$('img.part[data-id="'+opt.part_id+'"]').removeClass('yellow')
					setTimeout(function () {
						$('img.part[data-id="'+opt.part_id+'"]').addClass('red')
					}, 0)
					$('#later').removeClass('disabled')
					$('#immediately').addClass('disabled')
				}
			}
		})
	}

	$('#toOpList').attr('href', 'operationList.html?id='+id)
	$('#toHistory').attr('href', 'checkDamageOrderHistory.html?id='+id)

	myAjax.post(getApiUrl('/car/vehicle-failure-detail'), {
		uuid:login.uuid,
		sign: login.sign,
		city_id: login.city_id,
		car_id: id
	}, function (data) {
		if(data.status === 6001){
			window.location.href = '/login.html';
			return false
		}else if(data.status !== 0){
			toast(data.msg)
		}else{
			if (data.data.length > 0){
				data.data.forEach( item => {
					let ele = document.querySelector('.carDamage_container .part[data-id="'+item.part_id+'"]')
					if (ele){
						let classStr = 'active'
						classStr += item.broken_level == 1 ? ' red' : ' yellow'
						opClass.addClass(ele, classStr)
						carDamage.data['part_data_'+item.part_id] = item
					}
				})
			}
		}
	})

	$('.changeStatus').on('click', function () {
		if ($(this).hasClass('disabled')){
			return
		}

		let now = new Date().getTime()
		if((now - lastAjaxTime) < 600){
			return
		}

		changePartStatus({
			part_id: selected.getCarParts(),
			broken_level: selected.broken_level === '0' ? '1' : '0'
		})
	})

	$('.tofix').on('click', function () {
		window.location.href = 'dealDamage.html?id=' + id
	})
}

let login = getUuid()
let id=parseUrl(window.location.href).query.id
if(!id){
	toast('车辆ID为空')
}else{
	init()
}

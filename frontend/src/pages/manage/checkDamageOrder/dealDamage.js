/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: dealDamage
 Author: garvey
 Version: 1.0.0
 Date: 2017/11/6-下午4:27
 Description:
 Demo:
 Others:
 *************************************************/
require('./css/dealDamage.less')

require('./js/common')
import getUuid from '../../../component/manageApp_getUuidFromLocal'

import $ from 'jquery'
import myAjax from '../../../component/myAjax'
import getApiUrl from './js/getApiUrl'
import parseUrl from '../../../js/parseURL'
import toast from '../../../component/toast'
import CarDamage from '../../../component/carDamage'
import opClass from '../../../js/function/opClass'
import ChosenList from './js/ChosenList'
import Confirm from '../../../component/confirm'

function init () {
	let carDamage = new CarDamage({
		parent: document.querySelector('.showContainer'),
		clickable: true,
		clickCallback: function (area){
			if (!carDamage.data.hasOwnProperty('part_data_' + area.id)){
				return
			}

			let img = $('.carDamage_container .part[data-id="'+area.id+'"]')
			if (img.hasClass('green')){
				img.removeClass('green')
				chosenList.removeItem(carDamage.data['part_data_' + area.id])
			}else{
				img.addClass('green')
				chosenList.addItem(carDamage.data['part_data_' + area.id])
			}

			if(chosenList.getList().length>0){
				$('#repair').removeClass('disabled')
			}else{
				$('#repair').addClass('disabled')
			}
		}
	})

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

	$('#return').on('click', function () {
		window.location.href = 'damageDetail.html?id=' + id
	})

	$('#repair').on('click', function () {
		if ($(this).hasClass('disabled')){
			return
		}
		let msg = '本次维修 '
		msg += chosenList.getList().map( item => item.desc + ' ') + '，确定提交后将修改车损状态，此操作不可回退'
		let car_parts = chosenList.getList().map( item => item.part_id).join(',')
		new Confirm({
			type: 'confirm',
			msg: msg,
			confirmButtonCallback: function () {
				myAjax.post(getApiUrl('/car/modify-handle-status'), {
					uuid:login.uuid,
					sign: login.sign,
					car_id: id,
					car_parts: car_parts
				}, function (data) {
					if(data.status === 6001){
						window.location.href = '/login.html';
						return false
					}else if(data.status !== 0){
						toast(data.msg)
					}else{
						$('#return').click()
					}
				})
			}
		})
	})
}

let login = getUuid()
let chosenList = new ChosenList()
let id=parseUrl(window.location.href).query.id
if(!id){
	toast('车辆ID为空')
}else{
	init()
}

/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: list
 Author: garvey
 Version: 1.0.0
 Date: 2017/10/30-下午2:43
 Description:
 Demo:
 Others:
 *************************************************/
require('./js/common')
require('./css/list.less')
import getUuid from '../../../component/manageApp_getUuidFromLocal'
import $ from 'jquery'
import myAjax from '../../../component/myAjax'
import getApiUrl from './js/getApiUrl'
import toast from '../../../component/toast'
import format from '../../../js/function/format'
import parseUrl from '../../../js/parseURL'
import PullUpDown from '../../../component/pullDonwRefresh'

let conditionFilterLayer = require('./template/conditionFilterLayer.pug')
require('./template/conditionFilterLayer.less')
let damageBox = require('./template/damageBox.pug')
require('./template/damageBox.less')

function init() {
	let showConditionFilterLayer = conditionFilter()

	$('#filter').click(function () {
		showConditionFilterLayer(function (id) {
			if(id == 0){
				$('#filter').text('筛选')
			}else if(id >=4){
				$('#filter').text('伤≥4')
			}else{
				$('#filter').text(id+'伤')
			}
			if (queryCondition.count_failure !== Number(id)){
				queryCondition.count_failure = Number(id)
				queryCondition.page = 1
				pullUpDown.changeContent('<div class="empty">加载中...</div>')
				getData({}, function (data){
					if(data.status === 0){
						pullUpDown.changeContent(data.data.map( item => damageBox({
							id:item.car_id,
							plate_no:format.chepai(item.plate_no),
							vin:item.vin,
							parts:item.part_info,
							time:item.update_time
						})).join(''))
					}else{
						toast(data.msg)
					}
				})
			}
		})
	})

	$('.listContainer').height($(window).height()-$('.header').height())

	let pullUpDown = new PullUpDown({
		listClassName: 'damageList',
		content: '<div class="empty">加载中...</div>',
		parent:document.querySelector('.listContainer'),
		pullDownRefresh: function (cb) {
			queryCondition.page = 1
			getData({}, function (data){
				cb()
				if(data.status === 0){
					pullUpDown.changeContent(data.data.map( item => damageBox({
						id:item.car_id,
						plate_no:format.chepai(item.plate_no),
						vin:item.vin,
						parts:item.part_info,
						time:item.update_time
					})).join(''))
				}else{
					toast(data.msg)
				}
			})
		},
		pullUpLoad: function (cb) {
			queryCondition.page++
			getData({}, function (data){
				if(data.status === 0){
					if (data.data.length === 0){
						cb(false)
						return
					}
					pullUpDown.appendContent(data.data.map( item => damageBox({
						id:item.car_id,
						plate_no:format.chepai(item.plate_no),
						vin:item.vin,
						parts:item.part_info,
						time:item.update_time
					})).join(''))
					cb(true)
				}else{
					toast(data.msg)
				}
			})
		}
	})
	pullUpDown.changeContent = function (str) {
		if (str.length === 0){
			str = '<div class="empty">数据为空</div>'
		}
		PullUpDown.prototype.changeContent.call(pullUpDown, str)
	}

	getData({}, function (data){
		if(data.status === 0){
			pullUpDown.changeContent(data.data.map( item => damageBox({
				id:item.car_id,
				plate_no:format.chepai(item.plate_no),
				vin:item.vin,
				parts:item.part_info,
				time:item.update_time
			})).join(''))
		}else{
			toast(data.msg)
		}
	})

	$('.damageList').on('click', '.damageBox', function () {
		window.location.href = 'damageDetail.html?id='+this.dataset.id
	})

	$('#searchBtn').on('click', function () {
		let queryString = $('#search').val()
		if (queryCondition.vin_plate_no !== queryString){
			queryCondition.vin_plate_no = queryString
			queryCondition.page = 1
			pullUpDown.changeContent('<div class="empty">加载中...</div>')
			getData({}, function (data){
				if(data.status === 0){
					pullUpDown.changeContent(data.data.map( item => damageBox({
						id:item.car_id,
						plate_no:format.chepai(item.plate_no),
						vin:item.vin,
						parts:item.part_info,
						time:item.update_time
					})).join(''))
				}else{
					toast(data.msg)
				}
			})
		}
	})
}
let login = getUuid()
let queryCondition = {
	uuid: login.uuid,
	sign: login.sign,
	city_id: login.city_id,
	group: parseUrl(window.location.href).query.type,
	page: 1,
	count_failure: 0,
	vin_plate_no: ''
}
init()

function conditionFilter () {
	let selected = 0
	return function (cb) {
		$('body').append(conditionFilterLayer())
		if(selected !==0){
			$('.filterBox .option[data-id="'+selected+'"]').addClass('active')
		}
		$('.filterBox').on('click','.option', function () {
			if($(this).hasClass('active')){
				$('.option.active').removeClass('active')
				selected = 0
			}else{
				$('.option.active').removeClass('active')
				selected = $(this).addClass('active').attr('data-id')
			}
		}).on('click', '.blue_btn', function(){
			$('.conditionFilterLayer').remove()
			cb(selected)
		}).on('touchmove', function(e){
			e.stopPropagation()
			return false
		})
	}
}

function getData(opt, cb) {
	for (let key in queryCondition){
		opt[key] = queryCondition[key]
	}
	myAjax.post(getApiUrl('/car/list-vehicle-failure'),opt, function (data) {
		if (data.status === 6001){
			window.location.href = '/login.html';
			return false
		}

		cb(data)
	})
}
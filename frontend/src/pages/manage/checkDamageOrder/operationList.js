/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: operationList
 Author: garvey
 Version: 1.0.0
 Date: 2017/10/31-上午10:32
 Description:
 Demo:
 Others:
 *************************************************/
require('./js/common')
require('./css/operationList.less')
import getUuid from '../../../component/manageApp_getUuidFromLocal'
import $ from 'jquery'
import myAjax from '../../../component/myAjax'
import getApiUrl from './js/getApiUrl'
import toast from '../../../component/toast'
import parseUrl from '../../../js/parseURL'
import PullUpDown from '../../../component/pullDonwRefresh'

let operationHistoryBox = require('./template/operationHistoryBox.pug')
require('./template/operationHistoryBox.less')

function init() {
	$('.listContainer').height($(window).height())
	let pullUpDown = new PullUpDown({
		listClassName: 'damageList',
		content: '<div class="empty">加载中...</div>',
		parent:document.querySelector('.listContainer'),
		pullDownRefresh: function (cb) {
			queryCondition.page = 1
			getData({}, function (data) {
				cb()
				if (data.status === 0) {
					if (data.data.length == 0){
						pullUpDown.changeContent('<div class="empty">当前数据为空</div>')
						return
					}
					pullUpDown.changeContent(data.data.map(item => {
						let str = '修改 <span>'
						item.car_parts.forEach( item2 => {
							str+=item2.desc + ' '
						})
						str+='</span>为 <span>' + item.car_parts_status + '</span>'
						return operationHistoryBox({
							operation: str,
							name: item.manage_name,
							time: item.create_time
						})
					}).join(''))
				} else {
					toast(data.msg)
				}
			})
		},
		pullUpLoad: function (cb) {
			queryCondition.page++
			getData({}, function (data) {
				if (data.status == 0){
					if (data.data.length == 0){
						cb(false)
						return
					}
					pullUpDown.appendContent(data.data.map(item => {
						let str = '修改 <span>'
						item.car_parts.forEach( item2 => {
							str+=item2.desc + ' '
						})
						str+='</span>为 <span>' + item.car_parts_status + '</span>'
						return operationHistoryBox({
							operation: str,
							name: item.manage_name,
							time: item.create_time
						})
					}).join(''))
					cb(true)
				}else{
					toast(data.msg)
					cb(true)
				}
			})
		}
	})

	getData({}, function (data) {
		if (data.status === 0) {
			if (data.data.length == 0){
				pullUpDown.changeContent('<div class="empty">当前数据为空</div>')
				return
			}
			pullUpDown.changeContent(data.data.map(item => {
				let str = '修改 <span>'
				item.car_parts.forEach( item2 => {
					str+=item2.desc + ' '
				})
				str+='</span>为 <span>' + item.car_parts_status + '</span>'
				return operationHistoryBox({
					operation: str,
					name: item.manage_name,
					time: item.create_time
				})
			}).join(''))
		} else {
			toast(data.msg)
		}
	})

	$('.damageList').on('click', '.damageBox', function () {
		window.location.href = 'damageDetail.html?id=' + this.dataset.id
	})
}

function getData(opt, cb){
	for (let key in queryCondition){
		opt[key] = queryCondition[key]
	}
	myAjax.post(getApiUrl('/car/list-vehicle-failure-history'),queryCondition, function (data){
		if (data.status === 6001){
			window.location.href = '/login.html';
			return false
		}

		cb(data)
	})
}

let login = getUuid()
let queryCondition = {
	uuid: login.uuid,
	sign: login.sign,
    city_id: login.city_id,
	page: 1,
	car_id: parseUrl(window.location.href).query.id,
}
init()
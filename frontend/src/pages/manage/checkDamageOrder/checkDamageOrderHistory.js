/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: checkDamageOrderHistory
 Author: garvey
 Version: 1.0.0
 Date: 2017/10/31-上午10:33
 Description:
 Demo:
 Others:
 *************************************************/
require('./js/common')

require('./css/checkDamageOrderHistory.less')
import getUuid from '../../../component/manageApp_getUuidFromLocal'
require('../../../js/polyfills')
import $ from 'jquery'
import myAjax from '../../../component/myAjax'
import getApiUrl from './js/getApiUrl'
import toast from '../../../component/toast'
import format from '../../../js/function/format'
import parseUrl from '../../../js/parseURL'
import PullUpDown from '../../../component/pullDonwRefresh'
import previewImg from '../../../component/previewImg2'

let checkDamageOrderBox = require('./template/checkDamageOrderBox.pug')
require('./template/checkDamageOrderBox.less')

function init() {
	$('.listContainer').height($(window).height())
	let pullUpDown = new PullUpDown({
		listClassName: 'orderList',
		content: '<div class="empty">加载中...</div>',
		parent:document.querySelector('.listContainer'),
		pullDownRefresh: function (cb) {
			queryCondition.page = 1
			getData({}, function (data){
				cb()
				if(data.status === 0){
					if (data.data.length == 0){
						pullUpDown.changeContent('<div class="empty">当前数据为空</div>')
						return
					}
					pullUpDown.changeContent(data.data.map( item => {
						let photos = []
						for (let key in item.photo_string){
							photos.push(item.photo_string[key])
						}
						return checkDamageOrderBox({
							ddid:item.rental_id,
							time:item.updatetime,
							parts:item.car_parts,
							photos:photos
						})
					}).join(''))
				}else{
					toast(data.msg)
				}
			})
		},
		pullUpLoad: function (cb) {
			queryCondition.page++
			getData({}, function (data){
				if(data.status === 0){
					if (data.data.length == 0){
						cb(false)
						return
					}
					pullUpDown.appendContent(data.data.map( item => {
						let photos = []
						for (let key in item.photo_string){
							photos.push(item.photo_string[key])
						}
						return checkDamageOrderBox({
							ddid:item.rental_id,
							time:item.updatetime,
							parts:item.car_parts,
							photos:photos
						})
					}).join(''))
				}else{
					toast(data.msg)
				}
				cb(true)
			})
		}
	})

	getData({}, function (data){
		if(data.status === 0){
			if (data.data.length == 0){
				pullUpDown.changeContent('<div class="empty">当前数据为空</div>')
				return
			}
			pullUpDown.changeContent(data.data.map( item => {
				let photos = []
				for (let key in item.photo_string){
					photos.push(item.photo_string[key])
				}
				return checkDamageOrderBox({
					ddid:item.rental_id,
					time:item.updatetime,
					parts:item.car_parts,
					photos:photos
				})
			}).join(''))
		}else{
			toast(data.msg)
		}
	})

	$('.orderList').on('click', '.photo', function () {
		previewImg({
			url: this.src
		})
	})
}

function getData(opt, cb){
	for (let key in queryCondition){
		opt[key] = queryCondition[key]
	}
	myAjax.post(getApiUrl('/car/car-failure-list'),queryCondition, function (data){
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
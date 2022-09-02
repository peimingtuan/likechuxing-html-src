/**
 * Created by garvey on 2017/9/21.
 */
require('./css/winnerList.less')
import Loading from '../../../component/loading'
import toast from '../../../component/toast'
import parseURL from '../../../js/parseURL'
import getApiUrl from '../../../js/getApiUrl'
import myAjax from '../../../component/myAjax'
import {IsIos, IsWeiXin} from '../../../js/UserAgent'
import $ from 'jquery'
import WxShare from '../../../js/wx/WxShare'
import PleaseOpenInWx from '../../../component/pleaseOpenInWx'
require('./js/mockLink')
import format from '../../../js/function/format'

import winnerListLong from './template/winnerListLong'

let loading
let first = true
let query = parseURL(window.location.href).query
let dataList = []
let could_load = true

init()

function init() {
	loading = new Loading()
	getData()
}

function loadPage () {
	$('.container').append(winnerListLong({
		dead_time:format.time(Math.floor(new Date().getTime()/1000), 2)
	}));

	(function bindEvent() {
		$('#loadMore').on('click', getMore)
		$('.refresh').on('click', function () {
			$('.refresh .icon').addClass('active')
			setTimeout(function () {
				$('.refresh .icon').removeClass('active')
			}, 800)


			dataList.length = 0
			$('#loadMore').show()
			$('#noMore').hide()
			getData()
		})
	})()
}

function getData () {
	myAjax.post(getApiUrl('/activity-like-x/top-list'), {
		limit: 30,
		offset: dataList.length
	}, function (data) {
		loading.destroy()
		if (first){
			first = false
			loadPage()
		}
		if (data.status === 0) {
			$('.dead_time').text(format.time(Math.floor(new Date().getTime()/1000), 2))
			dataList = dataList.concat(data.data)
			loadWinnerList(dataList)
		} else {
			toast(data.msg)
		}
	})
}

function loadWinnerList (data) {
	let list = $('.winner_list')
	list.children().remove()
	if (data.length < 30){
		$('#loadMore').hide()
		$('#noMore').show()
	}
	if (data.length == 0){
		list.append('<li class="noMore">当前列表为空</li>')
		return
	}
	$('#getMore').hide()
	data.forEach( (item, index) => {
		list.append('<li><span class="index">'+(index+1)+'</span>'+ item.phone_no +'<span class="prize_name">将要获得 ' + item.prize + '</span></li>')
	})
}

function getMore () {
	if (dataList.length == 0 || !could_load) {
		return
	}

	let loading = new Loading()
	myAjax.post(getApiUrl('/activity-like-x/top-list'), {
		limit: 30,
		offset: dataList.length
	}, function (data) {
		loading.destroy()
		if (data.status === 0) {
			if (data.data.length > 0) {
				dataList = dataList.concat(data.data)
				loadWinnerList(dataList)
				if (data.data.length < 30){
					$('#loadMore').hide()
					$('#noMore').show()
				}
			} else {
				$('#loadMore').hide()
				$('#noMore').show()
			}
		} else {
			toast(data.msg)
		}
	})
}
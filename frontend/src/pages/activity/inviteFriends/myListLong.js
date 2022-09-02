/**
 * Created by garvey on 2017/9/23.
 */
require('./css/myList.less')
import toast from '../../../component/toast'
import parseURL from '../../../js/parseURL'
import Loading from '../../../component/loading'
import getApiUrl from '../../../js/getApiUrl'
import myAjax from '../../../component/myAjax'
import $ from 'jquery'
require('./js/mockLink')
import format from '../../../js/function/format'
// import templates
import box from './template/box'
import myPrize from './template/myPrize'
import btn from './template/btn'
import apartFromApple from './template/apartFromApple'

let query = parseURL(window.location.href).query
let loading = new Loading()
let first = true

init()

function init() {
	if (!query.hasOwnProperty('uuid') || !query.hasOwnProperty('sign')) {
		toast('抱歉，app开小差了')
		return
	}

	getData()
}

function getData () {
	myAjax.post(getApiUrl('/activity-like-x/rank'), {
		uuid: query.uuid,
		sign: query.sign
	}, function (data) {
		loading.destroy()
		if (data.status === 0) {
			loadPage(data.data)
			getList()
		} else {
			toast(data.msg)
		}
	})
}

function loadPage (data) {
	$('.container').append(
		box({
			box_body: getBody(data) + getTotal(data)+ btn({
				type: 'red',
				btn_id: 'toAddress',
				text: '我的收货信息'
			})+ getListCon()
		}, 'box2')
	);

	if (data.no > 167 || data.current_prize == ''){
		$('.btn_con_long.red').remove()
	}

	(function bindEvent() {
		$('.refresh').on('click', function () {
			$('.refresh .icon').addClass('active')
			setTimeout(function () {
				$('.refresh .icon').removeClass('active')
			}, 800)

			getList()
		})

		$('#toAddress').on('click', function () {
			window.location.href = 'editAddress.html?' + format.map2url({
					uuid:query.uuid,
					sign:query.sign
				})
		})
	})()
}

function getBody(data) {
	let str = ''
	str+='<div class="list_header"><span class="refresh"><span class="icon"></span>刷新</span><div class="dead_time">'+format.time(Math.floor(new Date().getTime()/1000),2)+'</div></div>'
	str+=myPrize({
		my_index:data.no,
		prize_name: data.current_prize == ''? '未获奖' :data.current_prize
	},'myListLong')
	return str
}

function getTotal(data){
	let str=''
	str+='<div class="desc">您总计邀请好友 <span class="strong" id="total">-</span> 位</div>'
	str+='<div class="desc">认证成功 <span class="strong" id="succ">'+data.invite_cnt+'</span> 位</div>'
	return str
}

function getListCon() {
	return '<div class="invite_history"><div class="detail_title">邀请记录</div><ul class="invite_list"></ul></div>'
}

function getList () {
	myAjax.post(getApiUrl('/activity-like-x/invite-list'), {
		uuid: query.uuid,
		sign: query.sign
	}, function (data) {
		if (data.status === 0) {
			$('#succ_invite').text(data.data.length)
			if (data.data.length > 0) {
				$('#total').text(data.data.length)

				$('.dead_time').text(format.time(Math.floor(new Date().getTime()/1000), 2))
				loadInviteList(data.data)
			} else {

			}
		} else {
			toast(data.msg)
		}
	})
}

function loadInviteList (list) {
	let length = list.length
	$('.invite_list').children().remove()
	let success = 0
	let str = list.reverse().map( (item, index) => {
		let _str = '<li>'
		_str+='<div class="index flo">'+(length-index)+'</div>'
		let time = item.update_time == 0 ? '' : format.time(item.update_time, 8)
		_str+='<div class="flo second"><div class="phone_no">'+item.phone_no.replace('****', ' **** ')+'</div><div class="time">'+time+'</div></div>'
		let status_des = [
			'<span class="red">未认证</span>',
			'<span class="red">认证中</span>',
			'<span class="red">认证未通过</span>',
			'认证成功'
		]
		if (item.status == 3) {
			success++
		}
		_str+='<div class="flo third">'+status_des[item.status]+'</div>'
		return _str
	}).join('')
	$('#succ').text(success)
	$('.invite_list').append(str)
}
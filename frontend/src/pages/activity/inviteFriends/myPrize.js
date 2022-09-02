/**
 * Created by garvey on 2017/9/23.
 */
require('./css/myPrizes.less')
import toast from '../../../component/toast'
import parseURL from '../../../js/parseURL'
import Loading from '../../../component/loading'
import getApiUrl from '../../../js/getApiUrl'
import myAjax from '../../../component/myAjax'
import $ from 'jquery'
import format from '../../../js/function/format'
import WxShare from '../../../js/wx/WxShare'
import Confirm from '../../../component/confirm'
require('./js/mockLink')
import AppMutual from '../../../js/AppMutual'
// import templates
import myPrizeList from './template/myPrizeList'
import wxShareSelector from '../../../component/wxShareSelector'

import _czc from './js/umeng'
require('./js/actFinishTip')

let query = parseURL(window.location.href).query
let loading = new Loading()
let first = true
let license_status = null
function getLicenseStatus() {
	myAjax.post(getApiUrl('/user/information'), {
		uuid: query.uuid,
		sign: query.sign,
		auth: 0
	}, function (data) {
		if (+data.status === 0) {
			license_status = +data.data.license.status
		}
	})
}

init()

function init() {
	if (!query.hasOwnProperty('uuid') || !query.hasOwnProperty('sign')) {
		new Confirm({
			type: 'alert',
			msg: '您需要先登录立刻出行，再进入活动',
			confirmButtonText: '知道了'
		})
		return
	}
	getLicenseStatus()

	getData()
}

function getData () {
	$('.container .box').remove()

	myAjax.post(getApiUrl('/activity-like-x/rank'), {
		uuid: query.uuid,
		sign: query.sign
	}, function (data) {
		loading.destroy()
		let _data = {}
		if (+data.status === 0) {
			_data.prize_name = data.data.current_prize
			_data.no = data.data.no || '-'
			_data.next_prize = data.data.next_prize
			_data.next_prize_dis = data.data.next_prize_dis
			_data.invite_cnt = data.data.invite_cnt
		}
		first = false
		loadPage(_data)
		getList()
	})
}

function getList () {
	myAjax.post(getApiUrl('/activity-like-x/invite-list'), {
		uuid: query.uuid,
		sign: query.sign
	}, function (data) {
		if (data.status == 6001) {
			toast('当前账号被踢出，请重新登录')
			return
		}
		if (data.status === 0) {
			if (data.data.length > 0) {
				$('.dead_time').text(format.time(Math.floor(new Date().getTime()/1000), 2))
				loadInviteList(data.data)
			} else {

			}
		} else {
			toast(data.msg)
		}
	})
}

function loadPage (data) {
	let desc = []
	if (data.no > 167) {
		desc = [
			'您正在冲击 <span class="strong">'+data.next_prize+'</span>',
			'已经成功邀请<span class="strong" id="succ_invite">'+data.invite_cnt+'</span>名好友',
			'继续加油，看好你'
		]
	} else if (data.no <3){
		desc = [
			'您即将获得 <span class="strong">iPhone X</span>',
			'已经成功邀请<span class="strong" id="succ_invite">'+data.invite_cnt+'</span>名好友',
			'稳住，你能赢'
		]
	} else if (data.no != undefined) {
		desc = [
			'目前距离 <span class="strong">iPhone X</span> 还有 <span class="strong"> '+(data.no - 2)+'</span> 个位次',
			'已经成功邀请<span class="strong" id="succ_invite">'+data.invite_cnt+'</span>名好友',
			'是时候启动你的人脉了'
		]
	} else {
		desc = []
	}
	$('.container').append(
		myPrizeList({
			dead_time: format.time(Math.floor(new Date().getTime()/1000), 2),
			prize_name:data.prize_name,
			my_index: data.no || '-',
			text_desc: desc,
			img_load_more: require('./images/loadMore.png')
		})
	);

	(function bindEvent() {
		$('.btn_con_long').on('click', function () {
			if (license_status === null) {
				new Confirm({
					type: 'alert',
					msg: '登录信息已过期，请退回App进行登录',
					confirmButtonText: '知道了',
					confirmButtonCallback: function () {
						window.location.href = AppMutual.JUMP_TO_APP_MAIN_PAGE
					}
				})
				return
			}

			if (license_status != 0) {
				new Confirm({
					type: 'alert',
					msg: '需要身份认证通过后，才能参加此活动，赶快去个人中心认证吧。',
					confirmButtonText: '知道了'
				})
				return
			}

			if (Number(query.user_version.split('_')[1]) >= 1400) {
				wxShareSelector({
					pyqCb: function () {
						_czc.push(["_trackEvent",'target_myPrize','action_share','app','pyq'])
						alert(JSON.stringify({
							like: {
								type: 5,
								destination: 1
							}
						}))
					},
					wxCb: function () {
						_czc.push(["_trackEvent",'target_myPrize','action_share','app','wx'])
						alert(JSON.stringify({
							like: {
								type: 5,
								destination: 2
							}
						}))
					}
				})
			} else {
				_czc.push(["_trackEvent",'target_myPrize','action_share','app','version_below_1400'])
				new Confirm({
					type: 'alert',
					msg: '请将APP升级到最新版本参与活动',
					confirmButtonText: '知道了'
				})
			}
		})
		$('.invite_list').on('click','.btn', function () {
			let that = this
			if ($(that).hasClass('disabled') || $(that).text() === '已提醒'){
				return
			}

			new Confirm({
				type: 'confirm',
				msg: '立刻出行会发短信给您的好友，提醒他认证帮您，是否确认发送？',
				confirmButtonText: '确认',
				confirmButtonCallback: function () {
					myAjax.post(getApiUrl('/activity-like-x/send-remind-msg'), {
						uuid:query.uuid,
						sign:query.sign,
						remaind_uuid:that.dataset.id
					}, function (data) {
						if (data.status == 0){
							$(that).text('已提醒').addClass('disabled')
						} else {
							toast(data.msg)
						}
					})
				},
			})
		})
		$('.refresh').on('click', function () {
			$('.refresh .icon').addClass('active')
			setTimeout(function () {
				$('.refresh .icon').removeClass('active')
			}, 800)

			getData()
		})
	})()
}

function loadInviteList (list) {
	$('.invite_list').children().remove()
	let length = list.length
	let succ = 0
	let str = list.reverse().map( (item, index) => {
		if (item.status == 3){
			succ++
		}
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
		_str+='<div class="flo third">'+status_des[item.status]+'</div>'
		let btn = ''
		// 0:未认证  2：审核不通过
		if (+item.status === 0 ) {
			btn = item.reminded == 0 ? '<button data-id="'+item.uuid+'" class="btn">提醒认证</button>' : '<button class="btn disabled">已提醒</button>'
		}
		if (+item.status === 2) {
			btn = item.reminded == 0 ? '<button data-id="'+item.uuid+'" class="btn">提醒再次认证</button>' : '<button class="btn disabled">已提醒</button>'
		}
		_str+='<div class="flo four">'+btn+'</div>'
		return _str
	}).join('')
	//$('#succ_invite').text(succ)
	$('.invite_list').append(str)
}
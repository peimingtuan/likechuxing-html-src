/**
 * Created by garvey on 2017/9/19.
 */
require('./css/index.less')
import Loading from '../../../component/loading'
import toast from '../../../component/toast'
import parseURL from '../../../js/parseURL'
import getApiUrl from '../../../js/getApiUrl'
import myAjax from '../../../component/myAjax'
import $ from 'jquery'
import text from './js/activity_text'
import format from '../../../js/function/format'
import AppMutual from '../../../js/AppMutual'
import static_template from './template/static'
import box from './template/box'

// import templates
import myPrize from './template/myPrize'
import winnerList8 from './template/winnerList8'
import prizes from './template/prizes'
import details from './template/details'
import apartFromApple from './template/apartFromApple'
import imgTitle from './template/imgTitle'
import Confirm from '../../../component/confirm'
import wxShareSelector from '../../../component/wxShareSelector'
import _czc from './js/umeng'

require('./js/mockLink')
require('./js/actFinishTip')

let loading
let first = true
let query = parseURL(window.location.href).query
let license_status = null
function getLicenseStatus() {
	myAjax.post(getApiUrl('/user/information'), {
		uuid: query.uuid,
		sign: query.sign,
		auth: 0
	}, function (data) {
		if (data.status == 6001) {
			toast('当前账号被踢出，请重新登录')
			return
		}
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
			confirmButtonText: '知道了',
			confirmButtonCallback: function () {
				window.location.href = AppMutual.JUMP_TO_APP_MAIN_PAGE
				$('.container').append(box({
					box_body: static_template('logout')
				}, 'box2'));
			}
		})
		return
	}

	getLicenseStatus()
	loading = new Loading()
	getData()
}

function getData () {
	myAjax.post(getApiUrl('/activity-like-x/rank'), {
		uuid: query.uuid,
		sign: query.sign
	}, function (data) {
		loading.destroy()
		let _data = {}
		if (+data.status === 0) {
			_data.prize_name = data.data.current_prize
			_data.my_index = data.data.no || '-'
		} else {
			_data.noIndex = true
		}
		if (first){
			first = false
			loadPage(_data)
			getList()
		}
	})
}

function getList () {
	myAjax.post(getApiUrl('/activity-like-x/top-list'), {
		uuid: query.uuid,
		sign: query.sign,
		offset: 0,
		limit: 8
	}, function (data) {
		if (data.status === 0) {
			$('.dead_time').text(format.time(Math.floor(new Date().getTime()/1000), 2))
			loadWinnerList(data.data)
		} else {
			toast(data.msg)
		}
	})
}

function loadPage (data) {
	$('.container').append(
		imgTitle()
	).append(
		details({
			title: '活动说明',
			details:[
				{title: '1.活动奖品', des: prizes(true) },
				{title: '2.参与方式', des: '10月10日 - 10月18日<br/>邀请好友注册立刻出行并认证成功即可'}
			]
		})
	).append(
		'<div class="btn_con"><img class="toInvite btn" src="'+require('./images/btn_invite.png')+'"/><img class="toDetail btn" src="'+require('./images/btn_detail.png')+'"/></div>'
	).append(
		myPrize(data)
	).append(winnerList8({
		dead_time:format.time(Math.floor(new Date().getTime()/1000), 2)
	})).append(
		apartFromApple()
	);

	(function bindEvent() {
		$('.toDetail').on('click', function() {
			window.location.href = 'explain.html' + window.location.search
		})
		$('.my_prize .link').on('click', function() {
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
			window.location.href = 'myPrize.html' + window.location.search
		})
		$('.winner_con .link').on('click', function () {
			window.location.href = 'winnerList.html' + window.location.search
		})
		$('.toInvite').on('click', function () {
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
						_czc.push(["_trackEvent",'target_index','action_share','app','pyq'])
						alert(JSON.stringify({
							like: {
								type: 5,
								destination: 1
							}
						}))
					},
					wxCb: function () {
						_czc.push(["_trackEvent",'target_index','action_share','app','wx'])
						alert(JSON.stringify({
							like: {
								type: 5,
								destination: 2
							}
						}))
					}
				})
			} else {
				_czc.push(["_trackEvent",'target_index','action_share','app','version_below_1400'])
				new Confirm({
					type: 'alert',
					msg: '请将APP升级到最新版本参与活动',
					confirmButtonText: '知道了'
				})
			}
		})
		$('.refresh').on('click', function () {
			$('.refresh .icon').addClass('active')
			setTimeout(function () {
				$('.refresh .icon').removeClass('active')
			}, 800)

			getList()
		})
	})()
}

function loadWinnerList (data) {
	let list = $('.winner_list')
	list.children().remove()
	if (data.length == 0){
		list.append('<li class="noMore">当前列表为空</li>')
		return
	}
	data.sort(function (a, b) {
		return a.no > b.no
	}).forEach( (item, index) => {
		list.append('<li><span class="index">'+(index+1)+'</span>'+ item.phone_no +'<span class="prize_name">将要获得 ' + item.prize + '</span></li>')
	})
}

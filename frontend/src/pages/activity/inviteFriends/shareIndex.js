/**
 * Created by garvey on 2017/9/19.
 */
require('./css/shareIndex.less')
import toast from '../../../component/toast'
import parseURL from '../../../js/parseURL'
import Login from './js/Login'
import getApiUrl from '../../../js/getApiUrl'
import myAjax from '../../../component/myAjax'
import {IsIos, IsWeiXin} from '../../../js/UserAgent'
import Format from '../../../js/function/format'
import Loading from '../../../component/loading'
import $ from 'jquery'
import WxShare from '../../../js/wx/WxShare'
import PleaseOpenInWx from '../../../component/pleaseOpenInWx'
require('./js/mockLink')
import format from '../../../js/function/format'
// import templates
import box from './template/box'
import login_template from './template/login'
import btn from './template/btn'
import winnerList8 from './template/winnerList8'
import details from './template/details'
import prizes from './template/prizes'
import apartFromApple from './template/apartFromApple'
import Confirm from '../../../component/confirm'
require('./js/actFinishTip')
let wx = window.wx

let query = parseURL(window.location.href).query
let first = true
let loading = new Loading()

init()

function init() {
	if (!query.hasOwnProperty('inviter_uuid')) {
		window.location.href = 'login.html'
		return
	}

	if (IsWeiXin()){
		myAjax.post(getApiUrl('/wx-js/sign-package'), {
			url: window.location.href.split('#')[0]
		}, function (data) {
			if (data.status === 0) {
				let sign = data.data
				wx.config({
					debug: false,
					appId: sign.appId,
					timestamp: sign.timestamp,
					nonceStr: sign.nonceStr,
					signature: sign.signature,
					jsApiList: [
						'checkJsApi',
						'onMenuShareTimeline',
						'onMenuShareAppMessage'
					]
				})
				wx.ready(function () {
					let shareOptions = {
						title: '能不能拿到iPhoneX靠你了', // 分享标题
						desc: '考验我们感情的时候到了', // 分享描述
						link: window.location.href, // 分享链接
						imgUrl: 'https://h5test.likechuxing.com/images/activity_inviteFriends/share_iphoneX.png', // 分享图标
						type: 'link', // 分享类型,music、video或link，不填默认为link
						dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
						success: function () {
						},
						cancel: function () {
						}
					}
					let pyqOptions = {
						title: shareOptions.title,
						link: shareOptions.link,
						imgUrl: shareOptions.imgUrl,
						type: shareOptions.type,
						success: shareOptions.success,
						cancel: shareOptions.cancel
					}
					wx.onMenuShareAppMessage(shareOptions)
					wx.onMenuShareTimeline(pyqOptions)
				})
			} else {
				console.warn('/wx-js/sign-package返回失败，详情见下行：')
				console.log(data)
			}
		}.bind(this))
	}
	getData()
}

function getData () {
	myAjax.post(getApiUrl('/activity-like-x/top-list'), {
		offset: 0,
		limit: 8
	}, function (data) {
		loading.destroy()
		if (first){
			first = false
			loadPage()
		}
		if (data.status === 0) {
			if (data.data.length > 0) {
				$('.dead_time').text(format.time(Math.floor(new Date().getTime()/1000), 2))
				loadWinnerList(data.data)
			}
		} else {
			toast(data.msg)
		}
	})
}

function loadPage () {
	let inviter = query.inviter_phone || ''

	$('.container').append(
		getBigBox(inviter)
	).append(
		details({
			title: '活动说明',
			details:[
				{title: '1.活动奖品', des: prizes(true)},
				{title: '2.活动概述', des: '10月10日-10月18日，邀请好友注册立刻出行并认证成功，即有机会赢取iPhoneX，邀请好友数量越多，距离iPhoneX越近！'},
			]
		})
	).append(
		apartFromApple()
	);

	(function bindEvent() {
		let login = new Login({
			phone: document.querySelector('#phone'),
			getCodeBtn: document.querySelector('#getCode'),
			code: document.querySelector('#code'),
			verifyBtn: document.querySelector('#verify'),
			getCode: function (phone, cb) {
				myAjax.post(getApiUrl('/login/get-code'), {
					phone: phone
				}, function (res) {
					if (res.status == 0) {
						toast('发送成功')
						cb()
					} else {
						$('#getCode').removeClass('disabled')
						toast(res.msg)
					}
				})
			},
			verify: function (data) {
				myAjax.post(getApiUrl('/web/verify-code'), Object.assign(data, {
					inviter_uuid: query.inviter_uuid,
					channel: 'act_invite'
				}), function (res) {
					if (res.status == 0) {
						if (res.data.new_user == 1){
							window.location.href = 'static.html?' + Format.map2url({
									type: 'newUserBl',
									uuid: res.data.uuid,
									sign: res.data.sign,
									inviter_phone: query.inviter_phone
								})
						} else if(res.data.auth_status == 0){
							let phone = document.querySelector('#phone').value
							let mask_phone = phone.substr(0,3) + '****'+phone.substr(7,4)
							window.location.href = 'static.html?' + Format.map2url({
									type: 'oldUser',
									uuid: res.data.uuid,
									sign: res.data.sign,
									inviter_phone:mask_phone
								})
						} else {
							window.location.href = 'static.html?' + Format.map2url({
									type: 'oldUserBl',
									uuid: res.data.uuid,
									sign: res.data.sign,
									inviter_phone:inviter
								})
						}
					} else {
						toast(res.msg)
					}
				})
			}
		})
		$('.winner_con .link').on('click', function () {
			window.location.href = 'winnerList.html' + window.location.search
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

function getBigBox(phone_no) {
	let str = '<div class="whoiam">我是 '+phone_no.replace('****', ' **** ')+'</div>'
	str+='<p>正在参加 立刻出行 i LIKE X 活动，<br/>请注册认证，帮我赢 iPhone X 大奖！'
	str+=login_template() + btn({
			type: 'red',
			btn_id: 'verify',
			text: '注册立刻出行'
		})
	let str2 = winnerList8({dead_time: format.time(Math.floor(new Date().getTime()/1000), 2)}, true)
	return box({
		box_body: str,
		box_body_2: str2
	}, true)
}

function loadWinnerList (data) {
	let list = $('.winner_list')
	list.children().remove()
	data.sort(function (a, b) {
		return a.no > b.no
	}).forEach( (item, index) => {
		list.append('<li><span class="index">'+(index+1)+'</span>'+ item.phone_no +'<span class="prize_name">将要获得 ' + item.prize + '</span></li>')
	})
}



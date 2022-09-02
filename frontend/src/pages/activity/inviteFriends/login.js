/**
 * Created by garvey on 2017/9/20.
 */
require('./css/login.less')
import toast from '../../../component/toast'
import parseURL from '../../../js/parseURL'
import Login from './js/Login'
import getApiUrl from '../../../js/getApiUrl'
import myAjax from '../../../component/myAjax'
import {IsIos, IsWeiXin} from '../../../js/UserAgent'
import Loading from '../../../component/loading'
import $ from 'jquery'
import WxShare from '../../../js/wx/WxShare'
import PleaseOpenInWx from '../../../component/pleaseOpenInWx'
require('./js/mockLink')
import pageLink from './js/pageLink'
import format from '../../../js/function/format'
import _czc from './js/umeng'
// import templates
import box from './template/box'
import login_template from './template/login'
import btn from './template/btn'
import downloadFooter from './template/downloadFooter'
import imgTitle from './template/imgTitle'
require('./js/actFinishTip')
let wx = window.wx
init()

function init() {
	if (IsWeiXin()){
		myAjax.post(getApiUrl('/wx-js/sign-package'), {
			url: window.location.href.split('#')[0]
		}, function (data) {
			if (data.status === 0) {
				let sign = data.data
				wx.config({
					debug: true,
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
							_czc.push(["_trackEvent",'target_activity','action_share','wx','success']);
						},
						cancel: function () {
							_czc.push(["_trackEvent",'target_activity','action_share','wx','cancel']);
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
	loadPage()
}

function loadPage () {
	$('.container').append(
		imgTitle()
	).append(
		box({
			box_body: login_template() + btn({
				type: 'red',
				btn_id: 'verify',
				text: '查看活动资格'
			}) + btn({
				btn_id: 'toDetail',
				text: '查看活动详情'
			}) + btn({
				btn_id: 'toWxzhiyin',
				text: '立刻出行使用指引'
			})
		}, 'box3')
	).append(
		downloadFooter()
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
				myAjax.post(getApiUrl('/login/verify-code'), data, function (res) {
					if (res.status == 0) {
						if (res.data.license.status == 0){
							let phone = document.querySelector('#phone').value
							let mask_phone = phone.substr(0,3) + '****'+phone.substr(7,4)
							window.location.href = 'static.html?'+format.map2url({
									uuid: res.data.uuid,
									sign: res.data.sign,
									inviter_phone:mask_phone,
									type: 'couldShare'
								})
						} else {
							window.location.href = 'static.html?'+format.map2url({
									uuid: res.data.uuid,
									sign: res.data.sign,
									type: 'couldNotShare'
								})
						}
					} else {
						toast(res.msg)
					}
				})
			}
		})

		$('#toWxzhiyin').on('click', function () {
			window.location.href =pageLink.howToUseLikePage
		})
		$('#toDetail').on('click', function () {
			window.location.href = 'explain.html'
		})

		$('.toYYB').on('click', function () {
			if (IsIos()) {
				_czc.push(["_trackEvent",'target_login','action_download','app','ios'])
				window.location.href = pageLink.itunes
			} else {
				_czc.push(["_trackEvent",'target_login','action_download','app','android'])
				window.location.href = pageLink.YYB_download
			}
		})

	})()
}



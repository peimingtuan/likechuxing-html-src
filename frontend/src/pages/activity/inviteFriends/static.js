/**
 * Created by garvey on 2017/9/20.
 */
require('./css/static.less')
import Loading from '../../../component/loading'
import toast from '../../../component/toast'
import parseURL from '../../../js/parseURL'
import format from '../../../js/function/format'
import getApiUrl from '../../../js/getApiUrl'
import myAjax from '../../../component/myAjax'
import {IsIos, IsWeiXin} from '../../../js/UserAgent'
import $ from 'jquery'
import WxShare from '../../../js/wx/WxShare'
import PleaseOpenInWx from '../../../component/pleaseOpenInWx'
import text from './js/activity_text'
import pageLink from './js/pageLink'
import _czc from './js/umeng'

// import templates
import myPrize from './template/myPrize'
import winnerList8 from './template/winnerList8'
import prizes from './template/prizes'
import static_template from './template/static'
import box from './template/box'
import Confirm from '../../../component/confirm'

require('./js/mockLink')

let query = parseURL(window.location.href).query
let wx = window.wx
init()

function init() {
	if (IsWeiXin()){
		myAjax.post(getApiUrl('/wx-js/sign-package'), {
			uuid:query.uuid,
			sign:query.sign,
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
						link: 'https://'+window.location.host+'/activity/inviteFriends/shareIndex.html?inviter_phone='+query.inviter_phone+'&inviter_uuid='+query.uuid, // 分享链接
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
	$('.container').append(box({
		box_body: static_template(query.type, {phone_no: query.invite_phone})
	}, 'box2'));

	(function bindEvent() {
		$('.shareMask').on('click', function () {
			$(this).hide()
		})
		switch (query.type){
			case 'oldUser':
				$('#toShare').on('click', function () {
					if (!IsWeiXin()){
						showUrl()
					} else{
						$('.shareMask').show()
					}
				})
				$('#toDetails').on('click', function () {
					window.location.href = 'explain.html?' + format.map2url({
							uuid:query.uuid,
							sign:query.sign
						})
				})
				$('#toYYB').on('click', function () {
					if (IsIos()) {
						_czc.push(["_trackEvent",'target_static','action_download','app','ios'])
						window.location.href = pageLink.itunes
					} else {
						_czc.push(["_trackEvent",'target_static','action_download','app','android'])
						window.location.href = pageLink.YYB_download
					}
				})
				break;
			case 'oldUserAl':
				$('#toWxzhiyin').on('click', function () {
					window.location.href =pageLink.howToUseLikePage
				})
				$('#toDetails').on('click', function () {
					window.location.href = 'explain.html?' + format.map2url({
							uuid:query.uuid,
							sign:query.sign
						})
				})
				break;
			case 'oldUserBl':
				$('#toLicense').on('click', function () {
					window.location.href = 'license.html?' + format.map2url({
							uuid:query.uuid,
							sign:query.sign
						})
				})
				$('#toYYB').on('click', function () {
					if (IsIos()) {
						_czc.push(["_trackEvent",'target_static','action_download','app','ios'])
						window.location.href = pageLink.itunes
					} else {
						_czc.push(["_trackEvent",'target_static','action_download','app','android'])
						window.location.href = pageLink.YYB_download
					}
				})
				$('#toDetails').on('click', function () {
					window.location.href = 'explain.html?' + format.map2url({
							uuid:query.uuid,
							sign:query.sign
						})
				})
				break;
			case 'newUserBl':
				$('#toLicense').on('click', function () {
					window.location.href = 'license.html?' + format.map2url({
							uuid:query.uuid,
							sign:query.sign,
							inviter_phone:query.inviter_phone,
							from:'new'
						})
				})
				$('#toDetails').on('click', function () {
					window.location.href = 'explain.html?' + format.map2url({
							uuid:query.uuid,
							sign:query.sign,
							inviter_phone:query.inviter_phone
						})
				})
				break;
			case 'newUserAl':
				$('#toWxzhiyin').on('click', function () {
					window.location.href =pageLink.howToUseLikePage
				})
				$('#toDetails').on('click', function () {
					window.location.href = 'explain.html?' + format.map2url({
							uuid:query.uuid,
							sign:query.sign,
							inviter_phone:query.inviter_phone
						})
				})
				break;
			case 'couldShare':
				$('#toShare').on('click', function () {
					if (!IsWeiXin()){
						showUrl()
					} else{
						$('.shareMask').show()
					}
				})
				$('#toDetails').on('click', function () {
					window.location.href = 'explain.html?' + format.map2url({
							uuid:query.uuid,
							sign:query.sign,
							inviter_phone:query.inviter_phone
						})
				})
				break;
			case 'couldNotShare':
				$('#toLicense').on('click', function () {
					window.location.href = 'license.html?' + format.map2url({
							uuid:query.uuid,
							sign:query.sign
						})
				})
				$('#toYYB').on('click', function () {
					if (IsIos()) {
						_czc.push(["_trackEvent",'target_static','action_download','app','ios'])
						window.location.href = pageLink.itunes
					} else {
						_czc.push(["_trackEvent",'target_static','action_download','app','android'])
						window.location.href = pageLink.YYB_download
					}
				})
				break;
			default:
		}
		$('.cancel').click(function () {
			$('.mask').hide()
		})
	})()
}

function showUrl () {
	let str = '能不能拿到iphonex靠你了'
	str+=' https://'+window.location.host+'/activity/inviteFriends/shareIndex.html?'
	str+=format.map2url({
		inviter_phone: query.inviter_phone,
		inviter_uuid: query.uuid
	})
	$('#word').val(str)
	$('.mask').show()
	$('#word').select()
}
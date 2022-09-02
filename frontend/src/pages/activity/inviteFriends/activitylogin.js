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

init()

function init() {
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
				text: '查看我的获奖结果'
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
						window.location.href = 'myList.html?'+format.map2url({
								uuid: res.data.uuid,
								sign: res.data.sign
							})
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



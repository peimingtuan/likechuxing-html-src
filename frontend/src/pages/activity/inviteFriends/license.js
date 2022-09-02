/**
 * Created by garvey on 2017/9/19.
 */
require('./css/license.less')
import Loading from '../../../component/loading'
import toast from '../../../component/toast'
import parseURL from '../../../js/parseURL'
import getApiUrl from '../../../js/getApiUrl'
import myAjax from '../../../component/myAjax'
import {IsIos, IsWeiXin} from '../../../js/UserAgent'
import $ from 'jquery'
import format from '../../../js/function/format'
import WxShare from '../../../js/wx/WxShare'
import PleaseOpenInWx from '../../../component/pleaseOpenInWx'
import Confirm from '../../../component/confirm'

let loading
let query = parseURL(window.location.href).query
let wx = window.wx
let store = {
	serverId_0: false,
	serverId_1: false,
	serverId_2: false
}

init()

function init() {
	if (!IsWeiXin()) {
		document.querySelector('.License').style.display = 'none'
		new PleaseOpenInWx()
		return
	}

	myAjax.post(getApiUrl('/wx-js/sign-package'), {
		url: window.location.href.split('#')[0],
		uuid: query.uuid,
		sign: query.sign
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
					'chooseImage',
					'uploadImage',
					'getLocalImgData'
				]
			})
		} else {
			console.warn('/wx-js/sign-package返回失败，详情见下行：')
			console.log(data)
		}
	})

	loading = new Loading()

	getUserLicense()

	document.querySelectorAll('.camera').forEach( (item, index) => {
		item.src = require('./images/license_camera.png')
		item.addEventListener('click', () => {
			wx.chooseImage({
				count: 1, // 默认9
				sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
				sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
				success: function (res) {
					if (IsIos()) {
						wx.getLocalImgData({
							localId: res.localIds[0],
							success: function (res_2) {
								// localData是图片的base64数据，可以用img标签显示
								document.querySelector('.photo_' + (index + 1)).style.backgroundImage ='url("' + res_2.localData + '")'
							}
						})
					} else {
						document.querySelector('.photo_' + (index + 1)).style.backgroundImage ='url("' + res.localIds[0] + '")'
					}
					wx.uploadImage({
						localId: res.localIds[0].toString(), // 需要上传的图片的本地ID，由chooseImage接口获得
						isShowProgressTips: 0, // 默认为1，显示进度提示
						success: function (res) {
							store['serverId_' + index] = res.serverId
							checkServerId()
						}
					})
				}
			})
		})
	})
	$('.sub_btn').on('click', function () {
		if (!$(this).hasClass('active')){
			return
		}

		let loading2 = new Loading({text: '上传中...'})
		myAjax.post(getApiUrl('/license/wx-submit'), {
			uuid: query.uuid,
			sign: query.sign,
			file1: store.serverId_0,
			file2: store.serverId_1,
			file3: store.serverId_2
		}, function (data) {
			loading2.destroy()
			if (+data.status === 0) {
				toast('上传成功')
				setTimeout(function () {
					if (query.from == 'new'){
						window.location.href = 'static.html?'+format.map2url({
								type: 'newUserAl',
								uuid:query.uuid,
								sign:query.sign,
								inviter_phone:query.inviter_phone
							})
					} else {
						window.location.href = 'static.html?'+format.map2url({
								type: 'oldUserAl',
								uuid:query.uuid,
								sign:query.sign
							})
					}
				}, 2000)
			}else{
				toast(data.msg)
			}
		})
	})
}

function getUserLicense () {
	myAjax.post(getApiUrl('/user/information'), {
		auth: 0,
		uuid: query.uuid,
		sign: query.sign
	}, function (data) {
		loading.destroy()
		if (data.status === 0) {
			let license = data.data.license

			switch (+license.status) {
				// 审核通过
				case 0:
					// todo 跳转到 8.1
					break;

				// 待审核
				case 1:
					new Confirm({
						type: 'alert',
						msg: '您已上传过照片，我们将会抓紧审核，请耐心等待',
						confirmButtonText: '知道了',
						confirmButtonCallback: function () {
							window.location.href = 'static.html?'+format.map2url({
									type: 'oldUserAl',
									uuid:query.uuid,
									sign:query.sign
								})
						}
					})
					break;

				// 未通过
				case 2:
					document.querySelector('.status_desc').innerHTML = '未认证通过<p>' + license.reason + '</p>'
					break;

				// 未上传
				default:
					document.querySelector('.status_desc').innerHTML = '未认证'

			}
		} else {
			toast(data.msg)
		}
	})
}

function checkServerId () {
	let array = [
		store.serverId_0,
		store.serverId_1,
		store.serverId_2
	]
	let btn = $('.sub_btn')
	if (array.every( item => item)) {
		btn.addClass('active')
	} else {
		btn.removeClass('active')
	}
}
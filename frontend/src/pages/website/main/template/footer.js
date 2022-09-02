/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: footer
 Author: garvey
 Version: 1.0.0
 Date: 2017/11/10-上午11:15
 Description:
 Demo:
 Others:
 *************************************************/
import getUrl from '../js/getUrl'
const footer_box = require('./footer.pug')
require('./footer.less')
import $ from 'jquery'
import url from '../../../../component/downloadUrl'
require('../js/common')

$.get(getUrl('index/index-config'), function (data) {
	if(data.status === 0){
		// footer
		let footer = footer_box({
			contact_us: data.data.contact_us,
			copyright: data.data.copyright,
			official_accounts: data.data.official_accounts
		})
		$('body').append(footer)
		$('.menuBar').click(function () {
			$(this).toggleClass('active').find('.menu').slideToggle()
		})
		$('.download-ios').click(downloadIos)
		$('.download-android').click(downloadAndroid)
		if(window.likeCb){
			window.likeCb(data.data)
		}
	}
})

let channel = window.sessionStorage.getItem('like_website_channel') ? "-"+window.sessionStorage.getItem('like_website_channel'):''

function downloadIos(){
	window._czc.push(["_trackEvent",'download','footer','ios'+channel]);
	window.location.href = url.appleStore
}

function downloadAndroid(){
	window._czc.push(["_trackEvent",'download','footer','android'+channel]);
	window.location.href = url.yingyongbao
}




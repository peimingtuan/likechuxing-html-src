import parseUrl from "../../../js/parseURL";

/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: download
 Author: garvey
 Version: 1.0.0
 Date: 2017/11/8-下午5:28
 Description:
 Demo:
 Others:
 *************************************************/
require('./js/common')
require('./css/download.less')

import $ from 'jquery'
import url from '../../../component/downloadUrl'

(function countChannel(){
    if(!window._czc){
        window._czc = []
    }
    let query = parseUrl(window.location.href).query
    if(query.hasOwnProperty('channel')){
        window.sessionStorage.setItem('like_website_channel', query.channel)
        window._czc.push(["_trackEvent",'channel',query.channel]);
    }
})();

let channel = window.sessionStorage.getItem('like_website_channel') ? "-"+window.sessionStorage.getItem('like_website_channel'):''

function initAction(){
	$(window).on('scroll', scrollCB)
	$('#download_ios').click(downloadIos)
	$('#download_android').click(downloadAndroid)
}

function scrollCB () {
	if($(window).scrollTop()>window.app_show_height){
		$('.animate_container').addClass('animate_active')
		$(window).off('scroll', scrollCB)
	}
}

function initCss () {
	let width = window.innerWidth
	let height = window.innerHeight

	window.app_show_height = $('.app_show').height()

	$('.banner').height(height)
	let main_download = $('.banner .main_download')
	let phone = $('.banner .phone')
	main_download.css("top", (height - phone.width()*308/286 - main_download.height())/2 +main_download.height()/3)
}

function downloadIos(){
	window._czc.push(["_trackEvent",'download','downloadPage','ios'+channel]);
	window.location.href = url.appleStore
}

function downloadAndroid(){
	window._czc.push(["_trackEvent",'download','downloadPage','android'+channel]);
	window.location.href = url.yingyongbao
}
$(function(){
	initCss()
	initAction()

})



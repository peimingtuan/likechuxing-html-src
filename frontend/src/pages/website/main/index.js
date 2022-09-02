/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index.js
 Author: garvey
 Version: 1.0.0
 Date: 2017/11/7-下午5:07
 Description:
 Demo:
 Others:
 *************************************************/
require('./js/common')
require('./css/index.less')

import $ from 'jquery'
import isPc from './js/isPc'
import parseUrl from '../../../js/parseURL'

function countChannel(){
	if(!window._czc){
		window._czc = []
	}
	let query = parseUrl(window.location.href).query
	if(query.hasOwnProperty('channel')){
		window.sessionStorage.setItem('like_website_channel', query.channel)
        window._czc.push(["_trackEvent",'channel',query.channel]);
	}
}

function initAction(){
	window.likeCb = function (data){
		let source = isPc() ? data.video : data.video_phone
		let video_mask = $('.video_mask')

		let str = '<video id="my-video" class="video-js" controls preload="auto" width="'+video_mask.width()+'" height="'+video_mask.height()+'" data-setup="{}">'
		str+='<source src="'+source+'" type="video/mp4">'
		str+='<p class="vjs-no-js">播放视频需要启用 JavaScript，推荐使用<a href="http://videojs.com/html5-video-support/" target="_blank">支持HTML5</a>的浏览器访问。 </p></video>'
		$('.video>.mask').append(str)
		let player = window.videojs('my-video');
		let video = $('#my-video')
		$('.video_start').click(function () {
			video.show()
			player.play()
		})

		player.on('ended', function () {
			video.hide()
		})
	}
}

function initCss () {
	let width = window.innerWidth
	let height = window.innerHeight

	$('.banner').height(width/2)
}

initCss()
initAction()
countChannel()

/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey
 Version: 1.0.0
 Date: 2017/10/31-下午2:53
 Description:
 Demo:
 Others:
 *************************************************/
require('./index.less')
const template = require('./index.pug')
const PinchZoom = require('../../../other_modules/pinchZoom')

function previewImg (opt) {
	if (!opt.url){
		return
	}

	let container = document.createElement('div')
	container.className = 'large_img_container zoomIn'
	container.innerHTML = template({
		url:opt.url
	})
	document.body.appendChild(container)
	document.querySelector('#preview_close').addEventListener('click', function () {
		document.body.removeChild(container)
	})

	let zoom = new PinchZoom(document.querySelector('.large_img'))
	let img = zoom.el
	let width = img.naturalWidth || img.clientWidth || img.width || img.offsetWidth
	let height = img.naturalHeight || img.clientHeight || img.height || img.offsetHeight
	if(width && height){
		let screen_width = window.innerWidth
		let screen_height = window.innerHeight
		let img_h = screen_width*height/width
		zoom.container.style.top = (screen_height - img_h)/2 + 'px'
		zoom.container.style.overflow = 'visible'
	}
}

export default previewImg

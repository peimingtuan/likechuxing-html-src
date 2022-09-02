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
const PinchZoom = require('../pinchZoom')

const makeImg = function(url){
	let img = document.createElement('div')
	img.className = 'large_img'
	img.style.backgroundImage = 'url('+url + ')'
	return img
}

function previewImg (opt) {
	if (!opt.url){
		return
	}

	let container = document.createElement('div')
	container.className = 'large_img_container zoomIn'



	let img = makeImg(opt.url)
	container.appendChild(img)
	document.body.appendChild(container)

	// 向history压入当前，如此可借用设备返回按钮关闭预览
  history.pushState(null, null, document.URL);

	const popStateCallback = function(){
    document.body.removeChild(container)
		window.removeEventListener("popstate",popStateCallback)
		if(typeof opt.onClose === 'function'){
    	opt.onClose()
		}
  }
  window.addEventListener("popstate",popStateCallback, false);

  if(opt.close){
    container.onclick = function(){
    	window.history.go(-1)
    }
  }

  new PinchZoom(img)
}

export default previewImg

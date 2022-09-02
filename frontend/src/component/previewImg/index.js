/**
 * Created by garvey on 2017/9/14.
 */
require('./index.less')

function previewImg (opt) {
	let config = {
		url: opt.url
	}
	let container = document.createElement('div')
	container.className = 'large_img zoomIn'
	container.style.backgroundImage='url("'+config.url+'")'
	container.onclick = function () {
		document.body.removeChild(document.querySelector('.large_img.zoomIn'))
	}
	document.body.appendChild(container)
}

export default previewImg
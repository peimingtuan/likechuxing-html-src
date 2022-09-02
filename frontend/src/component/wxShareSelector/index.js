/**
 * Created by garvey on 2017/9/26.
 */
require('./index.less')
let box = require('./box.pug')
require('../../js/polyfills')

export default function (opt) {
	let config = Object.assign({
		cb: function () {},
		msg: '开始邀请'
	}, opt)

	let container = document.createElement('div')
	container.className = 'wxShareSelector'
	container.innerHTML = box(config)
	container.addEventListener('touchmove', function (e) {
		e.stopPropagation()
		e.preventDefault()
		return false
	})
	container.addEventListener('click', function () {
		document.body.removeChild(container)
	})
	container.querySelector('.share_box').addEventListener('click', function (e) {
		e.stopPropagation()
	})
	container.querySelector('.pyq.share_button').addEventListener('click', function () {
		document.body.removeChild(container)
		setTimeout(function(){
      config.cb('1')
		},0)
	})
	container.querySelector('.wx.share_button').addEventListener('click', function () {
		document.body.removeChild(container)
		setTimeout(function(){
      config.cb('2')
		},0)

	})
	document.body.appendChild(container)
}
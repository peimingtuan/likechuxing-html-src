/**
 * Created by garvey on 2017/9/14.
 */
require('./loading.less')
import $ from "jquery"

class Loading{
	constructor(opt){
		opt = opt || {}
		this.text = opt.text || '加载中...'
		this.parent = opt.parent || document.body
		this.loading = $('<div class="loading_fe4e"><div class="load" data-loader="circle-side"></div><p>'+this.text+'</p></div>')
		this.loading.on('touchmove', function(e){
			e.preventDefault()
		})
		$(this.parent).append(this.loading)
	}

	destroy(){
		this.loading.remove()
	}
}

function Loading1 (opt) {
	this.config = {
		text: '加载中...',
		parent: document.body
	}
	for (let key in opt) {
		this.config[key] = opt[key]
	}

	this.loading = document.createElement('div')
	this.createdElements(this.config)
}

Loading1.prototype.createdElements = function (config) {
	let loader = document.createElement('div')
	loader.className = 'load'
	loader.setAttribute('data-loader', 'circle-side')
	let p = document.createElement('p')
	p.innerText = config.text
	this.loading.className = 'loading_fe4e'
	this.loading.appendChild(loader)
	this.loading.appendChild(p)
	this.config.parent.appendChild(this.loading)
}

Loading1.prototype.destroy = function () {
	if (this.loading.parentNode) {
		this.config.parent.removeChild(this.loading)
	}
}

export default Loading
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

	show(){
		this.loading.show()
	}

	hide(){
		this.loading.hide()
	}

	destroy(){
		this.loading.remove()
	}
}

export default new Loading()
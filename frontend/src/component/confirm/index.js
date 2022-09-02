/**
 * Created by garvey on 2017/9/21.
 */
require('../../js/polyfills')
require('./index.less')
require('../../css/buttons/button-animate-feedback')
let template_confirm = require('./confirm.pug')
let template_alert = require('./alert.pug')


export default class Confirm {
	constructor (opt) {
		this.config = Object.assign({
			type: 'alert',
			parent: document.body,
			icon: '',
			title: '',
			msg: '',
			confirmButtonText: '确定',
			confirmButtonCallback: this.hideAll.bind(this),
			cancelButtonText: '取消',
			cancelButtonCallback: this.hideAll.bind(this)
		}, opt)
		this.container = document.createElement('div')
		this.container.addEventListener('touchmove', function (e) {
			e.stopPropagation()
			e.preventDefault()
			return false
		})

		switch (this.config.type) {
			case 'alert':
				showAlert.apply(this)
				break;
			case 'confirm':
				showConfirm.apply(this)
				break;
			default:
		}
    this.container.querySelector('.confirm_btn').focus()
	}

	hideAll () {
		this.config.parent.removeChild(this.container)
	}
}

function showAlert() {
	this.container.innerHTML = template_alert(this.config)
	this.container.querySelector('.confirm_btn').addEventListener('click', this.config.confirmButtonCallback)
	this.container.querySelector('.confirm_btn').addEventListener('click', this.hideAll.bind(this))
	this.config.parent.appendChild(this.container)
}

function showConfirm() {
	this.container.innerHTML = template_confirm(this.config);
	this.container.querySelector('.confirm_btn').addEventListener('click', this.config.confirmButtonCallback)
	this.container.querySelector('.confirm_btn').addEventListener('click', this.hideAll.bind(this))
	this.container.querySelector('.cancel_btn').addEventListener('click', this.config.cancelButtonCallback)
	this.config.parent.appendChild(this.container)
}

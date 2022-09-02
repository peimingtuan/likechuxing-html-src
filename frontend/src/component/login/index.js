/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey
 Version: 1.0.0
 Date: 2017/10/26-下午5:35
 Description:将两个input和一个button元素整合成具有登录
 倒计时功能的登录模块，不具备ajax功能，需要使用者自己
 在回调中完成
 Others:
 *************************************************/
import toast from '../toast'

const myREG = {
	phone: /^1[3456789]\d{9}$/,
	verCode: /^([0-9]{4})$/,
	chinese: /^[\u4e00-\u9fa5]+$/,
	eMail: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
}

export default class Login {
	constructor (opt) {
		this.config = opt
		this.count = 60
		this.could_verify = false
		this.setTimeKey = null
		opt.getCodeBtn.addEventListener('click', this.getCode.bind(this))
		opt.verifyBtn.addEventListener('click', this.verify.bind(this))
	}

	init () {
		this.count = 60
		this.config.getCodeBtn.innerText = '获取验证码'
		this.config.phone.value = ''
		this.config.code.value = ''
		if(this.setTimeKey !== null){
			clearTimeout(this.setTimeKey)
		}
	}

	getCode () {
		if (this.count !== 60) {
			return
		}
		let phone = this.config.phone.value
		if (!myREG.phone.test(phone)) {
			toast('请输入正确手机号')
			return
		}

		this.config.getCodeBtn.className = this.config.getCodeBtn.className + ' disabled'
		this.config.getCode(phone, this.getCodeCb.bind(this))
	}

	getCodeCb () {
		this.could_verify = true
		this.countDown()
	}

	countDown () {
		if (this.count > 0) {
			this.config.getCodeBtn.innerText = this.count-- + 's'
			this.setTimeKey = setTimeout(this.countDown.bind(this),1000)
		} else {
			this.count = 60
			this.config.getCodeBtn.className = this.config.getCodeBtn.className.replace('disabled', '')
			this.config.getCodeBtn.innerText = '获取验证码'
		}
	}

	verify () {
		if (!this.could_verify) {
			toast('请先获取验证码')
			return
		}

		let phone = this.config.phone.value
		if (!myREG.phone.test(phone)) {
			toast('请输入正确手机号')
			return
		}

		let code = this.config.code.value
		if (!myREG.verCode.test(code)) {
			toast('请输入4位验证码')
			return
		}

		this.config.verify({
			phone,
			code
		})
	}
}
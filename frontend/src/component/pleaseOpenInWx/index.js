/**
 * Created by garvey on 2017/9/20.
 */
require('./index.less')
let template = require('./index.pug')

export default class PleaseOpenInWx {
	constructor () {
		this.con = document.createElement('div')
		this.con.innerHTML =template()
		this.con.className = 'weui_msg'
		document.body.appendChild(this.con)
	}
}
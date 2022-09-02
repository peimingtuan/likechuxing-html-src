/**
 * Created by garvey on 2017/9/24.
 */
require('./index.less')
let oldUser = require('./oldUser.pug')
let oldUserAl = require('./oldUserAl.pug')
let oldUserBl = require('./oldUserBl.pug')
let newUserBl = require('./newUserBl.pug')
let newUserAl = require('./newUserAl.pug')
let couldShare = require('./couldShare.pug')
let couldNotShare = require('./couldNotShare.pug')
let logout = require('./logout.pug')

export default function (type, data) {
	switch (type) {
		case 'oldUser':
			return oldUser({phone_no: data.phone_no})
			break;
		case 'oldUserAl':
			return oldUserAl({phone_no: data.phone_no})
			break;
		case 'oldUserBl':
			return oldUserBl({phone_no: data.phone_no})
			break;
		case 'newUserBl':
			return newUserBl({phone_no: data.phone_no})
			break;
		case 'newUserAl':
			return newUserAl({phone_no: data.phone_no})
			break;
		case 'couldShare':
			return couldShare({phone_no: data.phone_no})
			break;
		case 'couldNotShare':
			return couldNotShare({phone_no: data.phone_no})
			break;
		case 'logout':
			return logout()
			break;
		default:
			return '<div class="static_container"><p>哎呦喂，页面不翼而飞了</p></div>'
	}
}
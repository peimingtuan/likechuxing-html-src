/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index.js
 Author: garvey
 Version: 1.0.0
 Date: 2017/11/7-下午5:07
 Description:
 Demo:
 Others:
 *************************************************/
require('./js/common')
require('./css/about.less')

import $ from 'jquery'
import autoBannerHeight from './js/autoBannerHeight'
let contact_ways = require('./template/contact_ways.pug')

const _czc = window._czc

function initAction(){
	window.likeCb = function (data){
		let contact = contact_ways({
			cooperation_mail: data.cooperation_mail
		})
		let img = '<div class="where"><img src="'+data.company_name+'"></div>'
		$('footer').before(img).before(contact)
	}
}

autoBannerHeight()
initAction()


/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: header
 Author: garvey
 Version: 1.0.0
 Date: 2017/11/8-上午9:59
 Description:
 Demo:
 Others:
 *************************************************/
import $ from 'jquery'
require('./header.less')
const page = require('../js/menu.json')

let path = window.location.pathname
page.forEach(function (item) {
	if (item.href !== 'index.html' && new RegExp(item.href).test(path)){
		$('[data-href="'+item.href+'"]').attr('href', 'javascript: void(0)').addClass('this')
	}
})

$('.menu_m').click(function () {
	$(this).toggleClass("active")
	$('.navHeader .nav').slideToggle(400)
})

$('#headerLogo').click(function(){
	if(path !== '/' && path !== '/index.html'){
		window.location.href = '/index.html'
	}
})
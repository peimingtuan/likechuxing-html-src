/**
 * Created by garvey on 2017/8/8.
 */
const $ = require('jquery');
import REG from '../../../js/Regular.js';
import getApiUrl from '../../../js/getApiUrl.js';
import toast from './js/toast.js';

require('./css/index.less');


//window.like_env = 'development'


document.body.addEventListener('touchstart', function () {});
$(function(){
	let u = parseURL(window.location.href);
	$.post(getApiUrl('/statistics/index'),{
		channel:u.query.channel || '',
		page:3
	})

	$('.btn.open').on('click',toStep2)

	$('#phone').on('input',function(){
		if(REG.phone.test($(this).val())){
			$('.get_code').removeClass('disable')
		}else(
			$('.get_code').addClass('disable')
		)
	})

	$('.get_code').on('click',function(){
		if(!$(this).attr('class').match('disable')){
			getCode()
		}
	})

	$('#code').on('input',function(){
		if( REG.phone.test($('#phone').val()) && REG.verCode.test($('#code').val()) ){
			$('.get_coupon').removeClass('disable')
		}else{
			$('.get_coupon').addClass('disable')
		}
	})

	$('.get_coupon').on('click',function(){
		if(!$(this).attr('class').match('disable')){
			login()
		}
	})

	$('.download_ios').on('click',function(){
		$.post(getApiUrl('/statistics/download'),{
			channel:u.query.channel || '',
			page:3,
			agent_type:2
		})
		window.open('https://itunes.apple.com/cn/app/id1245529926?mt=8')
	})

	$('.download_android').on('click',function(){
		$.post(getApiUrl('/statistics/download'),{
			channel:u.query.channel || '',
			page:3,
			agent_type:1
		})
		window.open('http://a.app.qq.com/o/simple.jsp?pkgname=com.like.car')
	})
});

(function setCss(){
	let width=window.innerWidth;
	document.querySelector('.text').style.height=0.825*width+'px'
})()

function parseURL(url) {
	var
		res = {
			query: {}
		},
		reg = /([^?=&]+)=([^?=&]+)/g;

	url.replace(reg, function() {
		res.query[arguments[1]] = arguments[2];
	})
	var index = url.indexOf('?');
	res.origin = index === -1 ? url : url.substr(0, index);
	// res.host = url.substr(0,/[^:/]\/[^/]/.exec(url) === null?url:url.substr(0,/[^:/]\/[^/]/.exec(url).index+1);
	return res;
}

function toStep2(){
	$('.header').addClass('up');
	$('.step_1').addClass('down');
	setTimeout(function(){
		$('.step_1').hide()
	},600)
}

function toStep3(){
	$('.step_2').hide();
	$('.step_3').show();
}

function getCode(){
	let phone = $('#phone').val()
	if(!REG.phone.test(phone)){
		toast('请输入11位有效手机号码')
		return
	}

	$.post(getApiUrl('/web/get-code'),{
		user_version:'h5',
		phone:phone
	},function(data){
		if(data.status==0){
			codeBtnCount()
		}else{
			toast(data.msg)
		}
	})
}

function login(){
	let phone = $('#phone').val(),
		code = $('#code').val()
	$.post(getApiUrl('/web/verify-code'),{
		user_version:'h5',
		phone:phone,
		code:code,
		channel:'baidunuomi'
	},function(data){
		if(data.status==0){
			toStep3()
		}else{
			toast(data.msg)
		}
	})
}

function codeBtnCount(n){
	console.log(n)
	let num=n || 61;
	let get_code=$('.get_code');
	if(num===1){
		get_code.text('获取验证码').removeClass('disable')
	}else{
		num--;
		if(num===60){
			get_code.text('发送中...').addClass('disable')
		}else{
			get_code.text(num+'s')
		}
		setTimeout(function(){
			codeBtnCount(num)
		},1000)
	}
}


/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: button-animate-feedback
 Author: garvey
 Version: 1.0.0
 Date: 2017/11/2-下午4:24
 Description:
 Demo:
 Others:
 *************************************************/
import opClass from '../../js/function/opClass'
require('./button-animate.less')
const btnClassNames = [
	'blue_btn',
	'dark_btn',
	'white_btn'
]

const disableFeedbackAttribute = 'disable-btn-feedback'

document.addEventListener('click', function (e) {
	let ele = e.target
	if(ele && !opClass.hasClass(ele, 'disabled') && btnClassNames.some( item => new RegExp(' ' + item + '').test(' ' + ele.className + '')) && !opClass.hasClass(ele.className, 'btn-feedback-animate') && !ele.dataset.hasOwnProperty(disableFeedbackAttribute)){
		opClass.addClass(ele, 'btn-feedback-animate')
		setTimeout(function () {
			opClass.removeClass(ele, 'btn-feedback-animate')
		},150)
	}
})
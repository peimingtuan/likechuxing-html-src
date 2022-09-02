/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: job
 Author: garvey
 Version: 1.0.0
 Date: 2017/11/8-下午8:11
 Description:
 Demo:
 Others:
 *************************************************/
require('./js/common')
require('./css/job.less')
import getUrl from './js/getUrl'
import Swiper from 'swiper'
require('../../../../node_modules/swiper/dist/css/swiper.css')

const jobList = require('./template/jobList.pug')
require('./template/jobList.less')
const jobList_m = require('./template/jobList_m.pug')
require('./template/jobList_m.less')

const jobDetail = require('./template/jobDetail.pug')
require('./template/jobDetail.less')

import $ from 'jquery'
const city_data = require('./js/city.json')
$.fn.extend({
	animateCss: function (animationName) {
		let animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
		this.addClass('animated ' + animationName).one(animationEnd, function() {
			$(this).removeClass('animated ' + animationName);
		});
		return this;
	}
});

const _czc = window._czc
let scroll_top = 0

function initAction(){
	$.get(getUrl('/index/recruit'), function (data) {
		if(data.status === 0){
			let job_list = data.data
			let str = ''
			let str_m = ''
			if (job_list.length === 0){
				job_list.push({
					city: '北京市',
					cityFullName:'北京 BEIJING',
					img_src : require('./images/job_beijing.jpg'),
					jobs: []
				})
				str = jobList(job_list[0])
				str_m = jobList_m(job_list[0])
			}else{
				let job_data = job_list.map( item => {
					//如果职位名字过长，省略后边文字
					item.jobs.forEach(job =>{
						job.display_name = job.recruit_name.length>7?job.recruit_name.substr(0,6)+'...': job.recruit_name
					})
					let cityData = city_data.find( item2 => new RegExp(item2.city).test(item.city))
					if(cityData){
						item.cityFullName = cityData.city + ' ' + cityData.pinyin.toUpperCase()
						item.img_src = require('./images/'+cityData.job_page_img_name)
					}else{
						item.cityFullName = item.city.replace(/市$/, '')
						item.img_src = require('./images/job_beijing.jpg')
					}
					return item
				})
				str = job_data.map(item=>jobList(item)).join('')
				str_m = job_data.map(item=>jobList_m(item)).join('')
			}

			$('.swiper-wrapper').append(str)
			$('.jobList_m').append(str_m)

			let swiper = new Swiper('.swiper-container', {
				pagination:'.swiper-pagination',
				paginationClickable: true,
				paginationBulletRender: function (swiper, index, className) {
					return '<span class="' + className + '">' + job_list[index]['city'].replace(/市$/, '') + '</span>';
				}
			});

			$('.job_detail').on('click',function () {
				scroll_top =$(window).scrollTop()
				let id = $(this).attr('data-id')
				let job = {}
				job_list.forEach( item => {
					item.jobs.forEach( item_job =>{
						if(id === item_job.id){
							job = item_job
						}
					})
				})
				$('.navHeader').addClass('dark');
				$('.banner,.introduce').hide();
				$('.detail_con').append(jobDetail(job)).animateCss('slideInDown')
				$('html,body').animate({
					scrollTop:70
				},400)
			})
		}
	})

	$('.detail_con').on('click','.close',function() {
		$('.detail_con').animateCss('slideOutUp')
		$('.navHeader').removeClass('dark');
		$('.banner,.introduce').show();
		setTimeout(function () {
			$('html,body').animate({
				scrollTop:scroll_top
			},100)
			$('.detail_con').children().remove();
		},400)
	})
}

function initCss () {
	let width = window.innerWidth
	let height = window.innerHeight

	$('.banner').height(width/2)
}

initCss()
initAction()






/**
 * Created by garvey on 2017/8/11.
 */
require('./css/index.less')
const $ = require('jquery');
const touch = require('touchjs')
import format from '../../../js/function/format';
//import AppMutual from '../../../js/AppMutual';
import getApiUrl from '../../../js/getApiUrl';
import parseURL from './js/parseURL'
let Map = require('./js/map.js')
import pageUrl from '../../../js/PageUrl'
require('../../../js/polyfills')
import toast from '../../../component/toast'
import Loading from '../../../component/loading'
import myAjax from '../../../component/myAjax/withJq'
import AppMutual from '../../../component/AppMutual'
const appMutual = new AppMutual()
const publicMsg = require('./template/publicMsg.pug')

let map;
document.body.style.minHeight=window.innerHeight+'px';
let query = parseURL(window.location.href).query;
if(query.like_uuid && query.like_sign){
	// 如果是从h5页过来的
	query.uuid = query.like_uuid
	query.sign = query.like_sign
}
let loading = new Loading()
init()

function init () {
	if (query.hasOwnProperty('rental_no') && query.hasOwnProperty('uuid')) {
		getRentalDetail()
	}else{
		setTimeout(function(){
			toast('网页开小差了，请返回重试，04');
		},500)
		setTimeout(function(){
			loading.destroy()
		},3000)
	}
}

function getRentalDetail(){
	let data = {
		uuid: query.uuid,
		sign: query.sign,
		rental_no: query.rental_no
	}
	myAjax.post(getApiUrl('/rental-history/detail'), data, function(data){
		if(data.status != 0){
			toast(data.msg)
		}else{
			initPage(data.data)
		}
	})
}

function initPage(data){
	loading.destroy()
	document.querySelector('.page').style.display = 'block'

	loadStaticData();
	setMapHeight()
	map = new Map();
	if(data.points.length<2){
        if(data.points.length<2 && data.start_point && data.hasOwnProperty('start_point_lat')){
            map.drawStartPoint(data)
        }
	}else{
        //画轨迹
        map.drawRoute(data.points, query.city_name);
	}

	if(data.publicMsg){
		let msg = data.publicMsg
        if(data.discount_type == 2 || data.discount_type == 3){
            msg = msg.replace('点击查看您的现金奖励', '<br />点击查看您的现金奖励')
        }
        $('body').append(publicMsg({msg}))
		if(data.discount_type == 2){
            $('.PublicMsg').click(function(){
                window.location.href = '/activity/millionGift?uuid='+query.uuid+'&sign='+query.sign
            })
		}else if(data.discount_type == 3){
            $('.PublicMsg').click(function(){
                window.location.href = '/activity/millionGift_gz?uuid='+query.uuid+'&sign='+query.sign
            })
		}else if(data.discount_type == 5){
            $('.PublicMsg').click(function(){
                window.location.href = '/activity/millionGift_wh?uuid='+query.uuid+'&sign='+query.sign
            })
		}
	}

	function loadStaticData(){
		$('#order_time').text(format.time(data.rental_time,0))
		$('.chepai').text(format.chepai(data.plate));
		$('.chekuan').text(data.car_type);
		$('.car_img').css('background-image','url('+data.car_img+')');
		$('.cost_num').text(format.money(data.fee));

		if(data.is_cancel){
			$('.point_con').text('行程已取消')
		}else{
			//判断名字是否过长
			let con_w = document.querySelector('.point_con').offsetWidth;
			let p_w = document.querySelector('.point_con p').offsetWidth;
			let word_w = (con_w - p_w) / 2;
			let max_length = Math.floor(p_w / word_w) - 1;
			let start = data.start_point.length < max_length ? data.start_point : data.start_point.substr(0, max_length) + '...'
			let end = data.end_point.length < max_length ? data.end_point : data.end_point.substr(0, max_length) + '...'
			document.querySelector('#start_point_name').innerText = start
			document.querySelector('#end_point_name').innerText = end
		}

		//行程是否能够评价
		if(data.comment.can_comment == 1){
			let btn = $('<button class="btn white">服务评价</button>');
			btn.click(function(){
				$('.appraise_con').show();
			})
			$('.detail_con .btn_con').append(btn);

			//是否评价过
			if(data.comment.has_commented == 1){
				$('.appraise_con .title').text('非常感谢您对本次服务的评价')
				//0：好评，1：差评。
				$(['.dissatisfied','.satisfied'][+data.comment.type]).remove()
				data.comment.commented_list.forEach( function(item){
					$('.choose_list').append('<li class="active">'+item.des+'</li>')
				})
				$('.appraise_con .btn').remove()
			}else{
				//有评价资格，没评价过
				$('.appraise_con').show();
				$('.choose_list').on('click','li',function(){
					$(this).toggleClass('active');
					let active = false
					$('.choose_list li').each(function(index,item){
						if(item.className.match('active')){
							active = true
						}
					})

					let className = $('.choose_one.active').attr('class')
					if (className.match('dissatisfied')){
						if(active){
							$('#send_comment').removeClass('disable')
						}else{
							$('#send_comment').addClass('disable')
						}
					}else{
						$('#send_comment').removeClass('disable')
					}
				})
				loadChooseList(data.comment.positive_list);
				$('.choose_one').on('click',function(){
					let className = $(this).attr('class');
					if(!className.match('active')){
						$('.choose_one').removeClass('active');
						$(this).addClass('active');
						if(className.match('dissatisfied')){
							loadChooseList(data.comment.negative_list)
							$('#send_comment').addClass('disable')
						}else{
							loadChooseList(data.comment.positive_list)
							$('#send_comment').removeClass('disable')
						}
					}
				});

				$('#send_comment').click(function(){
					let btn_className = $(this).attr('class');
					if(btn_className.match('disable')){
						return
					}
					let className = $('.choose_one.active').attr('class');
					let type = className.match('dissatisfied')? 1 : 0 ;
					let str = '^';
					$('.choose_list').children('.active').each(function(index,item){
						str+=item.dataset.id+'^';
					})

					let data = {
						uuid: query.uuid,
						sign: query.sign,
						rental_no: query.rental_no,
						type:type,
						ids:str
					}
					myAjax.post(getApiUrl('/rental-history/comment'), data, function(data){
						if(data.status != 0){
							toast(data.msg)
						}else{
							appMutual.jumpIndexAndCloseThisWebview()
							//window.location.href = AppMutual.JUMP_TO_APP_MAIN_PAGE;
						}
					})
				})
			}
		}

		//加载行程详情按钮
		(function(){
			let btn = document.createElement('button');
			btn.innerText='费用明细'
			btn.className = 'btn white'
			if(!data.comment.can_comment && !data.has_accident && !data.has_car_photo){
				btn.className = 'btn white no_float'
			}
			btn.onclick = function(){
				window.location.href = '/app/rentalDetail/rentalDetail.html?uuid=' + query.uuid + '&sign=' + query.sign + '&rental_no=' + query.rental_no
			};
			$('.detail_con .btn_con').append(btn);
		})()

		//是否有事故照片
		if(data.has_accident){
			let btn = document.createElement('button');
			btn.innerText='事故图片';
			btn.className = 'btn white'
			btn.onclick = function(){
				appMutual.jumpAccidentPhoto(data.rental_id)
				/*
				// 兼容ios8
				let ua = navigator.userAgent.toLowerCase().replace(/\s/g, '')
				if(/iphoneos8_/.test(ua)){
					let a = document.createElement('a')
					a.href = AppMutual.JUMP_TO_ACCIDENT_PICTURE+data.rental_id
					a.click()
				}else{
					window.location.href = AppMutual.JUMP_TO_ACCIDENT_PICTURE+data.rental_id;
				}
				*/
			};
			$('.detail_con .btn_con').append(btn);
		}

		//是否用车前拍照，查看照片按钮
		if(data.has_car_photo){
			let version = +query.user_version.replace(/[a-zA-Z]+_/, '')
			let btn = document.createElement('button');
			btn.innerText=version>= 1400 ? '验车单' : '用车前照片';
			btn.className = 'btn white'
			let _data = {
				uuid: query.uuid,
				sign: query.sign,
				user_channel: 'h5',
				rental_id: data.rental_id
			}
			let param = []
			for(let key in _data){
				param.push(key+'='+_data[key])
			}
			btn.onclick = function(){
				if (version>= 1400) {
					window.location.href = pageUrl.CHECK_DAMAGE_SHOW + '?' + param.join('&');
				} else {
					appMutual.jumpBeforeRentalPhoto(data.rental_id)
					//window.location.href = AppMutual.JUMP_TO_USE_CAR_PICTURE_BEFORE_RENTAL + data.rental_id
				}
			};
			$('.detail_con .btn_con').append(btn)
		}

		function loadChooseList(list){
			$('.choose_list').children().remove();
			list.forEach( function(item){
				$('.choose_list').append('<li data-id="'+item.id+'">'+item.des+'</li>')
			})
		}
	}

	touch.on('.slide_btn','swipeup',function(){
		let cla = $('.detail_con').attr('class');
		if(cla.match('fold')){
			changeFooterBar()
		}
	})

	touch.on('.slide_btn','swipedown',function(){
		let cla = $('.detail_con').attr('class');
		if(!cla.match('fold')){
			changeFooterBar()
		}
	})

	$('.slide_btn').on('click',changeFooterBar)

	$('.btn_close').on('click',function(){
		$('.appraise_con').hide();
	})
}

function changeFooterBar(){
	let detail = $('.detail_con');
	let cla = detail.attr('class');
	if(cla.match('fold')){
		//open
		detail.removeClass('fold')
		setTimeout(setMapHeight,600)
	}else{
		//close
		detail.addClass('fold')
		setMapHeight()
	}

}

function setMapHeight(){
	let full_hei = window.innerHeight;
	let detail_hei = $('.detail_con').height();
	$('#map').height(full_hei-detail_hei);
	if(window.bd_map){
		//window.bd_map.reset()
	}
}




/**
 * Created by garvey on 2017/9/6.
 */
//require('../../../component/vconsole')
require('./style.less')
let bg = require('./images/bg.png')
require('../../../js/polyfills')
import Swiper from './js/swiper'
require('../../../../node_modules/swiper/dist/css/swiper.css')
import previewImg from '../../../component/previewImg'
import toast from '../../../component/toast'
import parseURL from '../../../js/parseURL'
import myAjax from '../../../component/myAjax/withJq'
import getApiUrl from '../../../js/getApiUrl'
import Loading from '../../../component/loading'

let loading
let query = {}
let parts = []
let container = document.querySelector('.car_container')

if(window.innerWidth === 375 && window.innerHeight === 690){
	container.style.marginTop = '60px'
}

init()

function init () {
	checkUuid()
}

function checkUuid () {
	query = parseURL(window.location.href).query
	if (!query.hasOwnProperty('uuid') || !query.hasOwnProperty('sign')) {
		toast('抱歉，app开小差了')
		document.querySelector('.empty').style.display = 'block'
		return
	}

	loading = new Loading()
	getData()
}

function getData () {
	myAjax.post(getApiUrl('/rental-history/car-before-photo-detail'), query, function (result) {
		loading.destroy()
		if (result.status === 0) {
			let empty =true
			if (result.data.hasOwnProperty('parts')) {
				empty = false
				loadParts(result.data.parts)
			}
			if (result.data.hasOwnProperty('images')) {
				empty = false
				loadImgs(result.data.images)
			}
			if (empty) {
				document.querySelector('#bg').src = bg;
			}
		} else {
			toast(result.msg)
		}
	})
}

function loadParts (_ids) {
	for (let i = 1; i < 20; i++) {
		parts.push({
			id: i,
			src: require('./images/part' + i + '.png'),
			chosen: false
		})
	}

	document.querySelector('#bg').src = bg;

	parts.forEach(part => {
		let img = document.createElement('img')
		img.setAttribute('data-id', part.id)
		img.className = 'img part'
		img.src = part.src
		container.appendChild(img)
	})

	if (/(\^\d+)+\^/.test(_ids)) {
		let ids = _ids.substring(1,_ids.length-1).split('^')
		ids.forEach(item => {
			let img = document.querySelector('img[data-id="'+item+'"]')
			if(img)img.style.display = 'block'
		})
	}
}

function loadImgs (imgs) {
	if (imgs.hasOwnProperty('length')){
		return
	}

	let _imgs=[]
	for (let key in imgs) {
		_imgs.push(imgs[key])
	}
	let template = '<div class="swiper-container"><div class="swiper-wrapper">'
	_imgs.forEach( (item, index) => {
		template += '<div class="swiper-slide" data-index="' + index + '"><img src="' + item + '" class="img" /></div>'
	})
	template +='</div></div>'
	if (_imgs.length > 3) {
		template +='<div class="button_next swiper_button"></div><div class="button_prev swiper_button"></div>'
	}
	document.querySelector('.swiper_con').innerHTML = template

	let swiper = new Swiper('.swiper-container', {
		slidesPerView: 3,
		centeredSlides: _imgs.length < 2,
		spaceBetween: 15
	});

	let btn_next = document.querySelector('.button_next')
	if (btn_next) {
		btn_next.addEventListener('click', function () {
			swiper.slideNext();
		})
	}
	let btn_prev = document.querySelector('.button_prev')
	if (btn_prev) {
		btn_prev.addEventListener('click', function() {
			swiper.slidePrev();
		})
	}
	document.querySelectorAll('.swiper-slide').forEach( item => {
		item.addEventListener('click',function () {
			previewImg({url:_imgs[this.dataset.index]})
		})
	})
}

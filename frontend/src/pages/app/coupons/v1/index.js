/**
 * Created by garvey on 2017/9/6.
 */
require('./css/index.less')
import PullUpDown from './js/PullUpDown'
import Loading from '../../../component/loading'
import toast from '../../../component/toast'
import parseURL from '../../../js/parseURL'
import myAjax from '../../../component/myAjax'
import getApiUrl from '../../../js/getApiUrl'
import formatCouponData from '../../../component/couponList/formatCouponData'
import couponBox from '../../../component/couponList/couponBox.pug'

let loading
let offset = 0
let data = []
let query = {}

init()

function init() {
	document.querySelectorAll('.check_history_url').forEach( function (element) {
		element.addEventListener('click', function () {
			window.location.href = 'history.html' + window.location.search + '&footerColor=f7f7f7'
		})
	})
	document.querySelector('.exchange').addEventListener('click', function () {
		window.location.href = 'exchange.html' + window.location.search+ '&footerColor=f7f7f7'
	})
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
	query.status = 0
	offset = 0
	myAjax.post(getApiUrl('/coupon/list'), query, function (result) {
		loading.destroy()
		if (result.status === 0) {
			if (result.data.length > 0) {
				document.querySelector('.footer').style.display='block'
				data = result.data
				offset = result.data.length
				loadTemplate(data)
				createScroll()
			} else {
				document.querySelector('.empty').style.display = 'block'
				document.querySelector('.check_history_url').style.display = 'inline'
			}
		} else {
			toast(result.msg)
			document.querySelector('.empty').style.display = 'block'
			document.querySelector('.check_history_url').style.display = 'inline'
		}
	})
}

function loadTemplate (data) {
	let str = ''
	data.forEach( item => {
		str += couponBox(formatCouponData(item))
	})
	document.querySelector('.wrapper').style.display = 'block'
	document.querySelector('.list').innerHTML = str
}

function createScroll () {
	let height = window.innerHeight
	let header = document.querySelector('.header')
	let footer = document.querySelector('.footer')

	let pullUpDown = new PullUpDown({
		wrapperHeight:height - header.offsetHeight - footer.offsetHeight,
		pullDownRefresh: function (cb) {
			query.status = 0
			offset = 0
			query.begin = offset
			myAjax.post(getApiUrl('/coupon/list'), query, function (result) {
				if (result.status === 0) {
					if (result.data.length > 0) {
						data = result.data
						offset = result.data.length
						loadTemplate(data)
						cb()
					} else {
						document.querySelector('.empty').style.display = 'block'
						document.querySelector('.check_history_url').style.display = 'inline'
					}
				} else {
					toast(result.msg)
					cb()
				}
			})
		},
		pullUpLoad: function (cb) {
			query.status = 0
			query.begin = offset
			myAjax.post(getApiUrl('/coupon/list'), query, function (result) {
				if (result.status === 0) {
					if (result.data.length > 0) {
						data = data.concat(result.data)
						offset += result.data.length
						loadTemplate(data)
						cb(true)
					} else {
						cb()
					}
				} else {
					toast(result.msg)
					cb(true)
				}
			})
		}
	})
}
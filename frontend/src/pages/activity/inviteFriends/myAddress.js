/**
 * Created by garvey on 2017/9/23.
 */
require('./css/myList.less')
import toast from '../../../component/toast'
import parseURL from '../../../js/parseURL'
import Loading from '../../../component/loading'
import getApiUrl from '../../../js/getApiUrl'
import myAjax from '../../../component/myAjax'
import $ from 'jquery'
require('./js/mockLink')
import format from '../../../js/function/format'
// import templates
import box from './template/box'
import myPrize from './template/myPrize'
import btn from './template/btn'
import apartFromApple from './template/apartFromApple'

let query = parseURL(window.location.href).query
let loading = new Loading()
let first = true

init()

function init() {
	getData()
}

function getData () {
	myAjax.post(getApiUrl('/activity-like-x/address-info'), {
		uuid: query.uuid,
		sign: query.sign
	}, function (data) {
		loading.destroy()
		if (data.status === 0) {
			loadPage(data.data)
		} else {
			toast(data.msg)
		}
	})
}

function loadPage (data) {
	$('.container').append(
		box({
			box_body: getBody(data) + btn({
				type: 'red',
				btn_id: 'back',
				text: '确认'
			}) + btn({
				btn_id:'change',
				text: '更改'
			})
		}, 'box2') + '<p class="app_explain">有任何问题，请致电 400-666-2333</p>'
	);

	(function bindEvent() {
		$('#back').click(function(){
			window.location.href = 'myList.html?' + format.map2url({
					uuid:query.uuid,
					sign:query.sign
				})
		})
		$('#change').click(function(){
			window.location.href = 'editAddress.html?' + format.map2url({
					uuid:query.uuid,
					sign:query.sign
				})
		})
	})()
}

function getBody(data) {
	let _data = Object.assign({
		name:'',
		phone_no:'',
		address:''
	}, data)
	let str = ''
	str+='<div class="title_myList">我们会将您获得的奖品发往</div>'
	str+='<div class="add_con"><p>收件人：'+_data.name+'</p><p>电话：'+_data.phone_no+'</p><p>地址：'+_data.address+'</p></div>'
	return str
}
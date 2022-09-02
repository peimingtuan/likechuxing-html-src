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
	if (!query.hasOwnProperty('uuid') || !query.hasOwnProperty('sign')) {
		toast('抱歉，app开小差了')
		return
	}

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
				btn_id: 'submit',
				text: '提交'
			})
		}, 'box2')
	);

	(function bindEvent() {
		$('#submit').click(function(){
			let _data = {
				uuid:query.uuid,
				sign:query.sign,
				name: $('#name').val().replace(/[<>]/g, ''),
				phone_no: $('#phone').val().replace(/[<>]/g, ''),
				address: $('#address').val().replace(/[<>]/g, ''),
			}
			myAjax.post(getApiUrl('/activity-like-x/edit-address'), _data, function (data){
				if (data.status == 0){
					window.location.href = 'myAddress.html?'+format.map2url({
							uuid: query.uuid,
							sign: query.sign
						})
				} else {
					toast(data.msg)
				}
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
	str+='<div class="title_myList">收件人：<br/><input type="text" id="name" value="'+_data.name+'" /></div>'
	str+='<div class="title_myList">联系电话：<br/><input type="text" id="phone" value="'+_data.phone_no+'"/></div>'
	str+='<div class="title_myList">详细地址：<br/><input type="text" id="address" value="'+_data.address+'"/></div>'
	return str
}
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
import Confirm from '../../../component/confirm'
import AppMutual from '../../../js/AppMutual'
// import templates
import box from './template/box'
import myPrize from './template/myPrize'
import btn from './template/btn'
import apartFromApple from './template/apartFromApple'
import static_template from './template/static'

let query = parseURL(window.location.href).query
let loading = new Loading()
let first = true

init()

function init() {
	if (!query.hasOwnProperty('uuid') || !query.hasOwnProperty('sign')) {
		loading.destroy()
		new Confirm({
			type: 'alert',
			msg: '您需要先登录立刻出行，再进入活动',
			confirmButtonText: '知道了',
			confirmButtonCallback: function () {
				window.location.href = AppMutual.JUMP_TO_APP_MAIN_PAGE
				$('.container').append(box({
					box_body: static_template('logout')
				}, 'box2'));
			}
		})
		return
	}

	getData()
}

function getData () {
	myAjax.post(getApiUrl('/activity-like-x/rank'), {
		uuid: query.uuid,
		sign: query.sign
	}, function (data) {
		loading.destroy()
		if (data.status == 6001){
			$('.container').children().remove()
			$('.container').append(box({
				box_body: static_template('logout')
			}, 'box2'))
			return
		}
		if (data.status === 0) {
			loadPage(data.data)
		} else {
			//toast(data.msg)
			loadPage({error: true})
		}
	})
}

function loadPage (data) {
	$('.container').append(
		box({
			box_body: getBody(data) + btn({
				type: 'red',
				btn_id: 'toAddress',
				text: '我的收货信息'
			}) + btn({
				btn_id:'toListLong',
				text: '查看我的邀请记录'
			}) + btn({
				btn_id:'toDetail',
				text: '活动详情说明'
			})
		}, 'box2') + apartFromApple()
	);

	if (data.no > 167 || data.current_prize == ''){
		$('.btn_con_long.red').remove()
	}

	if (data.error){
		$('.btn_con_long.red').remove()
		$('.btn_con_long').eq(0).remove()
	}

	(function bindEvent() {
		$('.link').on('click', function () {
			window.location.href = 'winnerList.html?' + format.map2url({
					uuid:query.uuid,
					sign:query.sign
				})
		})
		$('#toAddress').on('click', function () {
			window.location.href = 'editAddress.html?' + format.map2url({
					uuid:query.uuid,
					sign:query.sign
				})
		})
		$('#toListLong').on('click', function () {
			window.location.href = 'myListLong.html?' + format.map2url({
					uuid:query.uuid,
					sign:query.sign
				})
		})
		$('#toDetail').on('click', function () {
			window.location.href = 'explain.html?' + format.map2url({
					uuid:query.uuid,
					sign:query.sign,
					inviter_phone:query.inviter_phone
				})
		})
	})()
}

function getBody(data) {
	let str = ''

	if(data.error){
		str+=myPrize({
			my_index:'-',
			prize_name: '未获奖'
		},'myList')
	}else {
		str+='<div class="title_myList">恭喜您获得</div>'
		str+=myPrize({
			my_index:data.no,
			prize_name: data.current_prize == '' ? '未获奖' :data.current_prize
		},'myList')
	}

	return str
}
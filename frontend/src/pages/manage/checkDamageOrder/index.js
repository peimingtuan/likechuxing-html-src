/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey
 Version: 1.0.0
 Date: 2017/10/30-下午1:55
 Description:
 Demo:
 Others:
 *************************************************/
require('./js/common')
require('./css/index.less')
import getUuid from '../../../component/manageApp_getUuidFromLocal'
import $ from 'jquery'
import myAjax from '../../../component/myAjax'
import getApiUrl from './js/getApiUrl'
import toast from '../../../component/toast'

function init() {
	$('.main_btn').click(function() {
		window.location.href = 'list.html?type='+$(this).attr('data-id')
	})

	let login = getUuid()
	myAjax.post(getApiUrl('/car/group-vehicle-failure'),login,function (data){
		if(data.status === 0){
			$('#rearView').text('后视镜有伤 需要立即处理（' +data.data.group1+ '）')
			$('#tyre').text('轮胎有伤 需要立即处理（' +data.data.group2+ '）')
			$('#other').text('其它有伤 需要立即处理（' +data.data.group3+ '）')
			$('#all').text('全部有伤车辆列表（' +data.data.group4+ '）')
		}else{
			toast(data.msg)
		}
	})
}

init()
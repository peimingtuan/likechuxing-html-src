/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey
 Version: 1.0.0
 Date: 2017/10/30-下午2:54
 Description:管理App检查登录信息，未登录跳登录
 Demo:
 Others:
 *************************************************/

export default function () {
	let storage=window.localStorage;
	let uuid=storage.getItem('uuid');
	let sign=storage.getItem('sign');
	let city_id = storage.getItem('city_id') || ''
	if(!uuid || !sign){
		window.location.href="/login.html";
		return false
	}
	return {
		uuid,
		sign,
		city_id
	}
}


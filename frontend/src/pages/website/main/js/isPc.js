/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: isPc
 Author: garvey
 Version: 1.0.0
 Date: 2017/11/10-上午11:30
 Description:
 Demo:
 Others:
 *************************************************/
export default function (){
	const userAgentInfo = navigator.userAgent.toLowerCase();
	const Agents = [
		"android",
		"iphone",
		"symbianos",
		"windows phone",
		"ipad",
		"ipod"
	];
	let flag = true;
	Agents.forEach(function (item){
		if (userAgentInfo.indexOf(item) > -1){
			flag = false
		}
	})
	return flag
}
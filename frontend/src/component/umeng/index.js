/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey
 Version: 1.0.0
 Date: 2017/10/26-下午5:41
 Description:在页面中增加友盟统计代码
 Others:
 Use: let _czc = new Umeng(12645*****)
 *************************************************/
export default class Umeng {
	constructor (id) {
		if (!id){
			console.warn("Module Umeng constructor fail cause of unknown id :" + id)
			return
		}
		this._czc = window._czc = [];
		this._czc.push(["_setAccount", id])
		loadUmengScript(id)
		return this._czc
	}
}

function loadUmengScript(id){
	let script = document.createElement('script')
	script.type = "text/javascript"
	script.src = "https://s22.cnzz.com/z_stat.php?id=" + id + "&web_id=" + id
	let div = document.createElement('div')
	div.style.display = 'none'
	div.appendChild(script)
	document.body.appendChild(div)
}

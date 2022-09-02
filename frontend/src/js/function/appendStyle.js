/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: appendStyle
 Author: garvey
 Version: 1.0.0
 Date: 2017/10/30-下午12:09
 Description:动态往head中插入style
 Demo:
 Others:
 *************************************************/
export default function (opt) {
	if (opt.type === 'link'){
		let link = document.createElement('style')
		link.rel = 'stylesheet'
		link.href = opt.href
		document.head.appendChild(link)
	}else{
		let style = document.createElement('style')
		style.type = 'text/css'
		if(style.styleSheet){       // ie
			style.styleSheet.cssText = opt.style_str
		} else {
			style.appendChild(document.createTextNode(opt.style_str))
		}
		document.head.appendChild(style)
	}
}
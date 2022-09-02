/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: className
 Author: garvey
 Version: 1.0.0
 Date: 2017/10/27-下午7:22
 Description:
 Others:
 *************************************************/
require('../polyfills')
export default {

	addClass: function (ele, cls){
    let ele_class = str2array(ele.className)
		let cls_array = str2array(cls)
		cls_array.forEach(item => {
			if(ele_class.indexOf(item) === -1){
				ele_class.push(item)
			}
		})
		ele.className = ele_class.join(' ')
	},

	removeClass: function (ele, cls){
		let ele_class = str2array(ele.className)
		let cls_array = str2array(cls)
		ele.className = ele_class.filter(item => cls_array.indexOf(item) === -1).join(' ')
	},

	hasClass: function (ele, cls) {
    let ele_class = str2array(ele.className)
		return ele_class.indexOf(cls) > -1
	}
}

function str2array (str){
	str = str || ''
	str = str.replace(/^\s*|\s*$/g, '')
	return str === '' ? [] : str.split(' ')
}


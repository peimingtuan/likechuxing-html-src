/**
 * Created by garvey on 2017/9/22.
 */
require('./index.less')
let box = require('./index.pug')
let box2 = require('./box2.pug')
let box3 = require('./box3.pug')
let connect = require('./connect.pug')

export default function (data, _type) {
	let type = _type || 'box'
	data.img_footer = require('../../images/small_footer.png')
	// 普通模板
	if (type === 'box') {
		data.img_header = require('../../images/small_title.png')
		return box(data)
	}

	if (type === 'box2') {
		data.img_header = require('../../images/small_title_2.png')
		return box2(data)
	}

	if (type === 'box3') {
		data.img_header = require('../../images/small_title_3.png')
		return box3(data)
	}

	//双body
	data.img_header = require('../../images/small_title_2.png')
	data.img_connect = require('../../images/small_connect.png')
	return connect(data)
}
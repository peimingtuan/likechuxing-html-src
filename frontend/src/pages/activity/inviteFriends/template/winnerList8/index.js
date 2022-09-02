/**
 * Created by garvey on 2017/9/23.
 */
require('./index.less')
let winnerList8 = require('./index.pug')
import link from '../link'
import box from '../box'

export default function (data, onlyList) {

	let link_data = {
		link_name:'查看排行榜更多内容'
	}
	let winnerList8_str = winnerList8({
		dead_time: data.dead_time,
		link: link(link_data)
	})

	if (onlyList) {
		return winnerList8_str
	}

	let box_data = {
		title: '获奖实时榜单',
		box_body: winnerList8_str
	}
	return box(box_data)
}
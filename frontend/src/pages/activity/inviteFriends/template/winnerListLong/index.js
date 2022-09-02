/**
 * Created by garvey on 2017/9/23.
 */
require('./index.less')
let winnerListLong = require('./index.pug')
import box from '../box'

export default function (data) {
	let winnerListLong_data = {
		dead_time: data.dead_time,
		img_box_footer: require('../../images/loadMore.png')
	}
	let box_data = {
		title: 'i Like X 排行榜',
		box_body: winnerListLong(winnerListLong_data)
	}
	return box(box_data)
}
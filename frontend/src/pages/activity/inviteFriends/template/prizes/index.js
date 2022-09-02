/**
 * Created by garvey on 2017/9/23.
 */
require('./index.less')
let prizes= require('./index.pug')
import box from '../box'
import text from '../../js/activity_text'

export default function (onlyList) {
	let only_list = onlyList || false
	let prizes_str = prizes({
		prize_list: text.prizeList,
		img_prizes: require('../../images/prizes_03.png'),
		only_list
	})
	if (only_list) {
		return prizes_str
	}

	let box_data = {
		title: '活动奖品',
		box_body: prizes_str
	}
	return box(box_data)
}
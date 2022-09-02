/**
 * Created by garvey on 2017/9/22.
 */
require('./index.less')
let rules = require('./index.pug')
import box from '../box'
import text from '../../js/activity_text'

export default function () {
	let box_data = {
		title: '奖品规则',
		box_body: rules({
			prize_list: text.prizeList,
			img_prizes: require('../../images/prizes_03.png')
		})
	}
	return box(box_data)
}
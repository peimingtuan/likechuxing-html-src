/**
 * Created by garvey on 2017/9/23.
 */
require('./index.less')
let myPrize = require('./index.pug')
import box from '../box'
import btn from '../btn'
import getPrizeUrl from '../myPrize/getPrizeUrl'

export default function (data) {
	let myPrize_data = {
		invite_btn: btn({
			text: '继续邀请',
			type: 'red'
		}),
		dead_time: data.dead_time,
		my_index: data.my_index,
		img_prize: getPrizeUrl(data.prize_name),
		text_desc: data.text_desc,
		img_load_more: data.img_load_more
	}
	let box_data = {
		title: '我的排行榜',
		box_body: myPrize(myPrize_data)
	}
	return box(box_data)
}
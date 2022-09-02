/**
 * Created by garvey on 2017/9/23.
 */
require('./index.less')
let myPrize = require('./index.pug')
let myList = require('./myList.pug')
let myListLong = require('./myListLong.pug')
import link from '../link'
import box from '../box'
import getPrizeUrl from './getPrizeUrl'

export default function (data, type) {
	let myPrize_data_2 = {
		my_index: /\d+/.test(data.my_index) ? data.my_index : '-',
		img_prize: getPrizeUrl(data.prize_name),
	}
	if (type === 'myListLong'){
		return myListLong(myPrize_data_2)
	}
	let link_data_2 = {
		link_name:'查看排行榜更多内容'
	}
	myPrize_data_2.link = link(link_data_2)
	if (type === 'myList') {
		return myList(myPrize_data_2)
	}

	let link_data = {
		link_name:'我的奖品排名'
	}
	let myPrize_data = {
		my_index: /\d+/.test(data.my_index) ? data.my_index : '-',
		img_prize: getPrizeUrl(data.prize_name),
		link: link(link_data)
	}
	let box_data = {
		title: '我的排行榜',
		box_body: myPrize(myPrize_data)
	}
	return box(box_data)
}


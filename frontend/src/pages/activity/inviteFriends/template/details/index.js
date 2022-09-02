/**
 * Created by garvey on 2017/9/23.
 */
require('./index.less')
let details= require('./index.pug')
import box from '../box'

export default function (data) {
	let box_data = {
		title: data.title,
		box_body: details({details: data.details})
	}
	return box(box_data)
}
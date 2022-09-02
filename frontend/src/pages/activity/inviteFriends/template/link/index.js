/**
 * Created by garvey on 2017/9/23.
 */
require('./index.less')
let link = require('./index.pug')

export default function (data) {
	return link(data)
}
/**
 * Created by garvey on 2017/9/25.
 */
let img = require('./index.pug')
export default function () {
	return img({
		img_src: require('../../images/activity_title.png')
	})
}

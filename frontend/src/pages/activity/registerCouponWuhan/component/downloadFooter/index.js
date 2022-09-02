/**
 * Created by garvey on 2017/9/25.
 */
require('./index.less')
let footer = require('./index.pug')
import downloadUrl from '../../../../../component/downloadUrl'

export default function () {
	return footer({
		yybUrl: downloadUrl.yingyongbao
	})
}
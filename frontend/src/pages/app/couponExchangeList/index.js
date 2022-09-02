/**
 * Created by garvey on 2017/9/6.
 */
require('./css/style.less')
import templateReplace from '../../../js/templateReplace'
import toast from '../../../component/toast'
import parseURL from '../../../js/parseURL'
import myAjax from '../../../component/myAjax'
import getApiUrl from '../../../js/getApiUrl'

init()

function init() {
	checkUuid()
}

function checkUuid () {
	let query = parseURL(window.location.href).query
	if (!query.hasOwnProperty('uuid') || !query.hasOwnProperty('sign')) {
		toast('抱歉，app开小差了')
		document.querySelector('.loading').style.display = 'none'
		document.querySelector('.empty').style.display = 'block'
		return
	}

	getData(query)
}

function getData (query) {

	myAjax.post(getApiUrl('/coupon/convert-list'), query, function (result) {		
		document.querySelector('.loading').style.display = 'none'
		if (result.status === 0) {
			if (result.data.length > 0) {
				let template = document.querySelector('#box').innerHTML
				let str = ''
				result.data.sort((a,b)=>{
					return new Date(b.time).getTime() - new Date(a.time).getTime()
				})
				result.data.forEach( item => {
					if (!item.code.match(/输入/)) {
						item.code = '输入 ' + item.code
					}
					if (/1970/.test(item.time)) {
						item.time = ''
					}
					str += templateReplace(template, item)
				})
				document.querySelector('.history_list').innerHTML = str
			} else {
				document.querySelector('.empty').style.display = 'block'
			}
		} else {
			toast(result.msg)
			document.querySelector('.empty').style.display = 'block'
		}
	})
}



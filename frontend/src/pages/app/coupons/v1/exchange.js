/**
 * Created by garvey on 2017/9/12.
 */
require('./css/exchange.less')
import Loading from '../../../component/loading'
import toast from '../../../component/toast'
import parseURL from '../../../js/parseURL'
import myAjax from '../../../component/myAjax'
import getApiUrl from '../../../js/getApiUrl'

let query = {}

init()

function init() {
	checkUuid()
}

function checkUuid () {
	query = parseURL(window.location.href).query
	if (!query.hasOwnProperty('uuid') || !query.hasOwnProperty('sign')) {
		toast('抱歉，app开小差了')
		document.querySelector('.empty').style.display = 'block'
		return
	}

	document.querySelector('.btn').addEventListener('click', function () {
		if (!checkInput()) {
			toast('请输入有效兑换码')
			return
		}

		let loading = new Loading({text: '兑换中...'})
		myAjax.post(getApiUrl('/coupon/convert'), Object.assign({}, query, {code: document.querySelector('.code').value}), function (result) {
			loading.destroy()
      document.querySelector('.code').value = ''
			if(result.status === 0){
				toast('兑换成功')
        setTimeout(function () {
          window.history.back()
        },2000)
			}else{
        toast(result.msg)
			}
		})
	})
}

function checkInput () {
	let code = document.querySelector('.code').value
	return !!code
}
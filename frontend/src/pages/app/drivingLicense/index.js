/**
 * Created by garvey on 2017/9/6.
 */
require('./style.less')
require('../../../js/polyfills')
import getApiUrl from '../../../js/getApiUrl'
import parseURL from '../../../js/parseURL'
import myAjax from '../../../component/myAjax'
import previewImg from '../../../component/previewImg'
import toast from '../../../component/toast'

document.querySelectorAll('.img_con').forEach(function(item){
	item.addEventListener('click',function(){
		let url = this.style.backgroundImage.replace(/(url\(["']?|["']?\))/g,'')
		if (url) {
			previewImg({url: url})
		}
	})
})


let query = parseURL(window.location.href).query

init()

function init () {
	if (!query.plate_no) {
		document.querySelectorAll('.loading')[0].innerText = 'plate_no错误'
		return
	}

	myAjax.post(getApiUrl('/car/driving-license'), {
		uuid: query.uuid,
		sign: query.sign,
		plate_no: decodeURI(query.plate_no)
	}, function (data) {
		document.querySelectorAll('.loading').forEach( item => {
			item.style.display = 'none'
		})
		if (data.status === 0) {
			if (data.data.front_img !== '')
				setImg('front', data.data.front_img);
			if (data.data.side_img !== '')
				setImg('back', data.data.side_img);
		} else {
			toast(data.msg)
		}
	})
}

function setImg (id, url) {
	document.querySelector('#' + id).style.backgroundImage = 'url("' + url + '")'
}






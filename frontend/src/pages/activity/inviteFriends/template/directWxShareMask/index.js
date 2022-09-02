/**
 * Created by garvey on 2017/9/26.
 */
require('./index.less')
export default function () {
	let div = document.createElement('div')
	div.className = 'share_mask'
	div.addEventListener('click', function () {
		document.body.removeChild(div)
	})
	document.body.appendChild(div)
}
/**
 * Created by garvey on 2017/8/28.
 */
import md5 from './md5'

const KEY = '&^%$JDLSoy9-(*LsfalfqwsxLIes%$#@YSLeI'

function filterKey (array) {
	// 排除不签名的字段
	let keys = [
		'sign',
		'verification'
	]
	let values = [
		'',
		undefined,
		null
	]
	return array.filter( item => {
		let cou = item.split('=')
		return keys.indexOf(cou[0]) === -1 && values.indexOf(cou[1]) === -1
	})
}

function calculateKey (data) {
	
	return md5(filterKey(data).sort().join('K') + 'Kkey=' + KEY).toUpperCase()
}

function getVerification (data) {
	let array = []
	if (typeof data === 'string') {
		// 如果是encode好的字符串格式，返回拼好的字符串
		array = data.split('&')
		return data + '&verification=' + calculateKey(array)
	} else {
		// 如果是对象，只返回计算好的值
		for (let key in data) {
			array.push(key + '=' + data[key])
		}
		return calculateKey(array)
	}
}

export default getVerification

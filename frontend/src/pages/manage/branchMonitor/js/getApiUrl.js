/**
 * Created by garvey on 2017/8/10.
 */
import getEnv from '../../../../js/env'

export default function (url){
	let protocol = ''
	let host = getEnv()==='production' ? 'https://admin.likechuxing.com' :  'http://119.23.14.132:6076'
	const route = /^\//.test(url) ? url : '/' + url
	return 'https://admin.likechuxing.com'+route
	//return protocol+host+route
}
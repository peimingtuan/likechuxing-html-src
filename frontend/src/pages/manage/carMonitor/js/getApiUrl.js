/**
 * Created by garvey on 2017/8/10.
 */
import getEnv from '../../../../js/env'

export default function (url){
	let host = getEnv()==='production' ? 'https://admin.likechuxing.com/' :  'https://admintest.likechuxing.com'
	//host = 'https://admin.likechuxing.com/'
	const route = /^\//.test(url) ? url : '/' + url
	return host+route
}
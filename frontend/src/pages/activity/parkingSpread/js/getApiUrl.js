/**
 * Created by garvey on 2017/8/10.
 */
import getEnv from '../../../../js/env'

export default function (url){
	let protocol = 'https://'
	let host = getEnv()==='production' ? 'api.likechuxing.com' :  'apitest2.likechuxing.com'
	const route = /^\//.test(url) ? url : '/' + url
	return protocol+host+route
}
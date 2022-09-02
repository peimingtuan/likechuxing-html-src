/**
 * Created by garvey on 2017/8/10.
 */
import getEnv from './env'

export default function (url){
	const protocol = 'https://'
	const host = getEnv()==='production' ? 'api.likechuxing.com' :  'apitest.likechuxing.com'
	const route = /^\//.test(url) ? url : '/' + url
	return protocol+host+route
}
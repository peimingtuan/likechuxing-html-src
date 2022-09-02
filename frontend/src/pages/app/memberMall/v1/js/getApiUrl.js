/**
 * Created by garvey on 2017/8/10.
 */
import getEnv from './env'

export default function (url){
	const protocol = ''
	let host = getEnv()==='production' ? 'https://api.likechuxing.com' :  'https://apitest.likechuxing.com'
	// todo del
	host = 'http://119.23.14.132:6067'
  const route = /^\//.test(url) ? url : '/' + url
	return protocol+host+route
}
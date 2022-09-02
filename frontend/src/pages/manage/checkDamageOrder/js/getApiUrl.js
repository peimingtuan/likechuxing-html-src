/**
 * Created by garvey on 2017/8/10.
 */
import getEnv from '../../../../js/env'

export default function (url){
	const protocol = getEnv()==='production' ? 'https://' :  'https://'
	const host = getEnv()==='production' ? 'manage.likechuxing.com' :  'managetest.likechuxing.com'
	const route = /^\//.test(url) ? url : '/' + url
	return protocol+host+route
}
/**
 * Created by garvey on 2017/8/10.
 */
import {getAdminUrl as get} from "../../../../../other_modules/url-constructor";

const getApiUrl = function(path){
	//return get(path).replace('https://admintest.likechuxing.com',"http://192.168.0.32")
	return get(path).replace('https://admintest.likechuxing.com',"https://admin.likechuxing.com")
}

export {
	getApiUrl
}
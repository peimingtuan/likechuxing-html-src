/**
 * Created by garvey on 2017/8/10.
 */
import {getActivityApiUrl as get} from "../../../../../other_modules/url-constructor";

const getApiUrl = function(path){
	//return get(path).replace('https://apitest.likechuxing.com',"http://192.168.0.32:8080")
	return get(path)
}

export {
	getApiUrl
}
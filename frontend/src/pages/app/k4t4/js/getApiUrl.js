/**
 * Created by garvey on 2017/8/10.
 */
import {getApiUrl as get} from "../../../../../other_modules/url-constructor";

const getApiUrl = function(path){
	return get(path).replace('https://apitest.likechuxing.com',"https://apitest.likechuxing.com")
	//return get(path)
}

export {
	getApiUrl
}

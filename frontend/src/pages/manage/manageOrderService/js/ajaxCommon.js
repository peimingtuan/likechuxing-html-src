import $ from 'jquery'
import {getOspApiUrl} from '../js/getApiUrl'
//	import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
import myAjax from '../js/withJq.js'
import dd from '../../../../../other_modules/like-manageOrder/ddSDK'
const goAjax = function (param){
	var result;
	$.ajax({
        timeout: 3000,
        type: "post",
        url: getOspApiUrl('/vehicle-repair/operate'),
        data: param,
        async: false,
        success: function (data) {
            result = data;
        },
        error: function (data) {
            result = data;
        }
       })
        return result;
	
}
export {
	goAjax,
}

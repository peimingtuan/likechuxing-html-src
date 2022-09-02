/**
 * Created by garvey on 2017/8/21.
 */
export default function (url) {
	let
		res = {
			query: {}
		},
		reg = /([^?=&]+)=([^?=&]+)/g;

	url.split('#')[0].replace(reg, function () {
		res.query[arguments[1]] = arguments[2];
	})
	let index = url.indexOf('?');
	res.origin = index === -1 ? url : url.substr(0, index);
	//res.host = url.substr(0,/[^:/]\/[^/]/.exec(url) === null?url:url.substr(0,/[^:/]\/[^/]/.exec(url).index+1)
	return res;
}
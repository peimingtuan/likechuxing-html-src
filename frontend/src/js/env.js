/**
 * Created by garvey on 2017/9/11.
 */
const HOST_LIST = {
	production: [
		/h5\.likechuxing\.com/,
		/activity\.likechuxing\.com/,
		/mana\.likechuxing\.com/,
    ///localhost/
	],
	development: [
		/h5test\.likechuxing\.com/,
		/h5test2\.likechuxing\.com/,
    /localhost/
	]
}
let host = window.location.host

function getEnv () {
	let env = 'development'
	for (let key in HOST_LIST) {
		HOST_LIST[key].forEach( item => {
			if (item.test(host))
				env = key
		})
	}
	return env
}

export default getEnv
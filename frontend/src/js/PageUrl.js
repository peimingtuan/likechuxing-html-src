/**
 * Created by garvey on 2017/9/18.
 */
import getEnv from './env'

let HOST = getEnv() === 'production' ? 'https://h5.likechuxing.com' : 'https://h5test.likechuxing.com'

export default {
	CHECK_DAMAGE_SHOW: HOST + '/app/checkDamageShow/index.html'
}
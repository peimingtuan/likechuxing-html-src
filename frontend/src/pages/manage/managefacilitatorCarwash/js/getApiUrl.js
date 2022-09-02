/**
 * Created by garvey on 2017/8/10.
 */
import getEnv from '../../../../js/env'

export default function (url) {
    const protocol = ''
    const host = getEnv() === 'production' ? 'https://opsapi.likechuxing.com' : 'https://opsapitest2.likechuxing.com'
    const route = /^\//.test(url) ? url : '/' + url
    return protocol + host + route
}
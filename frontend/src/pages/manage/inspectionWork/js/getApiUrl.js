/**
 * Created by garvey on 2017/8/10.
 */
import getEnv from '../../../../js/env'

export default function (url) {
    const protocol = ''
    const host = getEnv() === 'production' ? 'https://opsapi.likechuxing.com' : 'https://opsapitest3.likechuxing.com'
    //const host = getEnv() === 'production' ? 'https://opsapi.likechuxing.com' : 'http://119.23.14.132:6073'
    const route = /^\//.test(url) ? url : '/' + url
    return protocol + host + route
}
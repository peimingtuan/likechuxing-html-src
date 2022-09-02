/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: getAppVersion
 Author: garvey
 Version: 1.0.0
 Date: 2017/11/23-上午10:28
 Description:
 Demo:
 Others:
 *************************************************/
import parseURL from './parseURL'
require('./polyfills')

export default function () {
    let query = parseURL(window.location.href).query
    return Object.assign({
        isLogin: Boolean(query.uuid && query.sign),
        uuid: '',
        sign: '',
        user_lat: 0,
        user_lng: 0,
        user_version: null,
        user_sys: /ios/.test(query.user_version) ? 'ios' : 'android',
        user_sys_version: null,
        city_id: null,
        city_name: null,
        app_version: Number(String(query.user_version).replace(/^[a-z]+_/, '')),
        isInApp: /^(ios|android)_\d{4}$/.test(query.user_version)
    }, query)
}

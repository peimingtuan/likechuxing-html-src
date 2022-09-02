/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/5/18-下午9:23
 Description:
 Param:
 Return:
 *************************************************/
import parseURL from './parseURL'
require('../polyfills')

let query = parseURL(decodeURIComponent(window.location.href)).query

let arg = Object.assign({
  login: Boolean(query.uuid && query.sign),
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
  in_app: /likechuxing\/\d{4}/.test(navigator.userAgent) || /^(ios|android)_\d{4}$/.test(query.user_version)
}, query)


export default arg
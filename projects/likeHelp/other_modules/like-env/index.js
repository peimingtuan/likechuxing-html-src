/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/5/10-下午6:12
 Description:
 Param:
 Return:
 *************************************************/

function getEnv() {
  const DEVELOPMENT_HOST = [
    /localhost/,
    /mtest\.likechuxing\.com/,
    /192\.168/
  ]

  let host = window.location.host

  let env = 'production'

  let length = DEVELOPMENT_HOST.length
  for (let i = 0; i < length; i++) {
    if (DEVELOPMENT_HOST[i].test(host)) {
      env = 'development'
      break;
    }
  }
  return env
}

/**
 * @return {boolean}
 */
function IsWeiXin () {
  let ua = navigator.userAgent.toLowerCase()
  return ua.indexOf('micromessenger') > -1
}

/**
 * @return {boolean}
 */
function IsAliPay () {
  let ua = navigator.userAgent.toLowerCase()
  return ua.indexOf('alipayclient') > -1
}

/**
 * @return {boolean}
 */
function IsAndroid () {
  let ua = navigator.userAgent.toLowerCase()
  return ua.indexOf('android') > -1 || ua.indexOf('adr') > -1
}

/**
 * @return {boolean}
 */
function IsIos () {
  let ua = navigator.userAgent
  return !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
}

function IsWxMiniProgram(){
  let ua = navigator.userAgent
  return ua.indexOf('micromessenger') > -1 && ua.indexOf('miniprogram') > -1
}

export default {
  isProduction:getEnv() === 'production',
  isDev: getEnv() === 'development',
  isWeiXin: IsWeiXin(),
  isWxMiniProgram: IsWxMiniProgram(),
  isAliPay: IsAliPay(),
  isAndroid: IsAndroid(),
  isIos: IsIos()
}

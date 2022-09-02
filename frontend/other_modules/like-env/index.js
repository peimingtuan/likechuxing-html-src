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
    // h5test h5test2 mtest  admintest等
    /test\d?\.likechuxing\.com/,
    /localhost/,
    /192\.168/,
    /172\.16/,
    /119\.23\.14\.132/
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

const ua = navigator.userAgent.toLowerCase()

function isPc(){
  let Agents = ["Android", "iPhone",
    "SymbianOS", "Windows Phone",
    "iPad", "iPod"];
  let isPc = true;
  for (let v = 0; v < Agents.length; v++) {
    if (ua.indexOf(Agents[v]) > 0) {
      isPc = false;
      break;
    }
  }
  return isPc
}


/**
 * @return {boolean}
 */
function IsWeiXin () {
  return ua.indexOf('micromessenger') > -1
}

/**
 * @return {boolean}
 */
function IsAliPay () {
  return ua.indexOf('alipayclient') > -1
}

/**
 * @return {boolean}
 */
function IsAndroid () {
  return ua.indexOf('android') > -1 || ua.indexOf('adr') > -1
}

/**
 * @return {boolean}
 */
function IsIos () {
  let ua = navigator.userAgent
  return !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
}

/**
 * @return {boolean}
 */
function IsWxMiniProgram(){
  return ua.indexOf('micromessenger') > -1 && ua.indexOf('miniprogram') > -1
}

/**
 * @return {boolean}
 */
function IsInLike(){
  if(/likechuxing\/\d+/.test(ua)){
    return true
  }else{
    let query = window.location.search
    return /user_version=/.test(query) && /user_lat=/.test(query)
  }
}

function getSafeBottom(){

  let _ua = ua
  let bottom = 0
  _ua.replace(/likesafebottom=\d+/g,function(){
    bottom = Number(arguments[0].replace('likesafebottom=',''))
  })
  return bottom
}

export default {
  isProduction:getEnv() === 'production',
  isDev: getEnv() === 'development',
  isWeiXin: IsWeiXin(),
  isWxMiniProgram: IsWxMiniProgram(),
  isAliPay: IsAliPay(),
  isAndroid: IsAndroid(),
  isIos: IsIos(),
  isInLike:IsInLike(),
  safeBottom:getSafeBottom()
}
/**
 * Created by garvey on 2017/6/23.
 */

function getEnv() {
  const DEVELOPMENT_HOST = [
    /h5test\.likechuxing\.com/,
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
function IsAndriod () {
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

export default {
  isProduction:getEnv() === 'production',
  isDev: getEnv() === 'development',
  isWeiXin: IsWeiXin(),
  isAliPay: IsAliPay(),
  isAndroid: IsAndriod(),
  isIos: IsIos()
}

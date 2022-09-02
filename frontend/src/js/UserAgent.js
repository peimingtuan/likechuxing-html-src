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

/**
 * @return {boolean}
 */
function IsIphoneX () {
    let ua = navigator.userAgent
    return !!ua.match(/iphone/) && screen.height === 812 // ios终端
}

export {IsWeiXin, IsAndriod, IsIos, IsIphoneX}

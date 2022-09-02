/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: getUrl
 Author: garvey
 Version: 1.0.0
 Date: 2017/11/9-下午7:52
 Description:
 Demo:
 Others:
 *************************************************/
const DEVELOPMENT_HOST = [
  /h5test\.likechuxing\.com/,
  /localhost/,
  /192.168.0.123/,
  /119.23.14.132/
]

let host = window.location.host

function getEnv() {
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

export default function (url) {
  const protocol = ''
  const host = getEnv() === 'production' ? 'https://webapi.likechuxing.com' : 'http://119.23.14.132:6086'
  const route = /^\//.test(url) ? url : '/' + url
  return protocol + host + route
}
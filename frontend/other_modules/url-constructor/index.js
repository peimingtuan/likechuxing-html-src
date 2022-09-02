/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/5/29-上午10:18
 Description:
 Param:
 Return:
 *************************************************/
import env from '../like-env'

function formatPath(path) {
  return /^\//.test(path) ? path : '/' + path
}

// app接口
const getApiUrl = function (path) {
  let host = env.isProduction ? 'https://api.likechuxing.com' : 'https://apitest.likechuxing.com'
  return host + formatPath(path)
}

// 活动类接口
const getActivityApiUrl = function (path) {
  let host = env.isProduction ? 'https://activityapi.likechuxing.com' : 'https://apitest.likechuxing.com'
  return host + formatPath(path)
}

// 管理app端
const getManageUrl = function(path){
  let host = env.isProduction ? 'https://manage.likechuxing.com' : 'https://managetest.likechuxing.com'
  //host = 'https://manage.likechuxing.com'
  return host + formatPath(path)
}

// 管理app端
const getOspApiUrl = function(path){
  let host = env.isProduction ? 'https://opsapi.likechuxing.com' : 'https://opsapitest3.likechuxing.com'
  //host = 'https://manage.likechuxing.com'
  return host + formatPath(path)
}
const getOspApi2Url = function(path){
  let host = env.isProduction ? 'https://opsapi.likechuxing.com' : 'https://opsapitest2.likechuxing.com'
  //host = 'https://manage.likechuxing.com'
  return host + formatPath(path)
}
const getOspApi3Url = function(path){
  let host = env.isProduction ? 'https://opsapi.likechuxing.com' : 'https://opsapitest3.likechuxing.com'
  //host = 'https://manage.likechuxing.com'
  return host + formatPath(path)
}

// PC版P端
const getAdminUrl = function(path){
  let host = env.isProduction ? 'https://admin.likechuxing.com' : 'https://admintest.likechuxing.com'
  return host + formatPath(path)
}

// 官网
const getWebUrl = function(path){
  let host = env.isProduction ? 'https://webapi.likechuxing.com' : 'http://119.23.14.132:6066'
  return host + formatPath(path)
}

// h5
const getH5Url = function(path){
  let host = env.isProduction ? 'https://h5.likechuxing.com' : 'https://h5test.likechuxing.com'
  return host + formatPath(path)
}

// activity
const getActivityUrl = function(path){
  let host = env.isProduction ? 'https://activity.likechuxing.com' : 'https://h5test.likechuxing.com'
  return host + formatPath(path)
}

export {
  getApiUrl,
  getActivityApiUrl,
  getManageUrl,
  getOspApiUrl,
  getOspApi2Url,
  getOspApi3Url,
  getAdminUrl,
  getWebUrl,
  getH5Url,
  getActivityUrl
}

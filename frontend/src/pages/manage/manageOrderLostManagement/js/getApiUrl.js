/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: getApiUrl
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/9/4-下午6:04
 Description:
 Param:
 Return:
 *************************************************/
import {getOspApiUrl as getApiUrl} from "../../../../../other_modules/url-constructor";

const getOspApiUrl = function(url){
  //return getApiUrl(url).replace('https://opsapitest.likechuxing.com','http://192.168.0.88:8080')
  return getApiUrl(url)
}

export {
  getOspApiUrl
}

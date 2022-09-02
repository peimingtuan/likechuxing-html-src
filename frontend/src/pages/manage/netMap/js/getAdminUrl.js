/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: getAdminApiUrl
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/9/26-下午7:12
 Description:
 Param:
 Return:
 *************************************************/
import {getAdminUrl as getUrlBase} from "../../../../../other_modules/url-constructor";

const getAdminUrl = function(path){
  //return getUrlBase(path).replace('https://admintest.likechuxing.com','http://119.23.14.132:6063')
  return getUrlBase(path)
}

export {
  getAdminUrl
}
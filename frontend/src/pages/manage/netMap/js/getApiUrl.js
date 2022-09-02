/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: getApiUrl
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/9/13-下午5:48
 Description:
 Param:
 Return:
 *************************************************/
import {getApiUrl as getUrlBase} from "../../../../../other_modules/url-constructor";

const getApiUrl = function(path){
  return getUrlBase(path)
}

export {
  getApiUrl
}

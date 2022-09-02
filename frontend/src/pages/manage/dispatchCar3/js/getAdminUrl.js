/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: getAdminUrl
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/7/31-上午10:29
 Description:
 Param:
 Return:
 *************************************************/
import {getAdminUrl as getUrlBase} from "../../../../../other_modules/url-constructor";

const getAdminUrl = function(path){
  return getUrlBase(path).replace('admintest','admin')
}

export {
  getAdminUrl
}
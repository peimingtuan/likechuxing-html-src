/*************************************************
 * Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 * File name: filterInvalidParams
 * Author: garvey sunjiawei@likechuxing.com
 * Version: 1.0.0
 * Date: 2018-11-30-10:38
 * Description:
 *
 *************************************************/
const invalid_values = [
  undefined,
  NaN,
  null
]

 export default function(params){
  let params_new = {}
  for(let key in params){
    if(invalid_values.includes(params[key])){
      params_new[key] = String(params[key])
    }else{
      params_new[key] = params[key]
    }
  }

  return params_new
}
/*************************************************
 * Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 * File name: index.js
 * Author: garvey sunjiawei@likechuxing.com
 * Version: 1.0.0
 * Date: 2018-11-29-17:33
 * Description:
 *
 *************************************************/
const md5 = require('md5')

const sort = function(params){
  let keys = Object.keys(params).sort()

  let params_new = {}
  keys.forEach(key=>{
    params_new[key] = params[key]
  })

  return params_new
}

const formatParams = function(params) {
  let buff = ''

  for(let key in params){
    if(key !== 'sign' && key !== 'verification' && params[key] !== ''){
      // 服务端验证不会解析多级参数，object自动转成"Array"
      let value = typeof params[key] === 'object' ? 'Array' : params[key]
      buff+=key+'='+value+'K'
    }
  }

  // 为适配服务端验证逻辑问题，php: trim($string, 'K');
  if(/^K/.test(buff))buff=buff.substr(1,buff.length-1)

  return buff.substr(0,buff.length-1)
}

function getVerification(params,key) {
  if(!key) throw new Error('key is required')

  //签名步骤一：按key排序参数
  params = sort(params)

  //签名步骤二：拼串，key1=valKkey2=valKkey3=val(value为''或key为sign的不拼)
  let string = formatParams(params);

  //签名步骤三：在string后加入KEY
  string += ("Kkey=" + key);

  //签名步骤四：MD5加密
  string = md5(string);

  //签名步骤五：所有字符转为大写
  return string.toUpperCase();
}

module.exports = getVerification
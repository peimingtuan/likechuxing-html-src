/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index.js
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/8/27-下午4:50
 Description:
 Param:
 Return:
 *************************************************/
/**
 * Created by garvey on 2017/8/28.
 */
import md5 from 'md5'
import {H5_KEY} from "./KEY";
require('../polyfills/index')

const EXCLUDE_KEY = [
  'sign',
  'verification'
]

const EXCLUDE_VALUE = [
  '',
  null,
  NaN,
  undefined
]

function filterKey(array) {
  // 排除不签名的字段
  return array.filter(item => {
    let cou = item.split('=')
    return !EXCLUDE_KEY.includes(cou[0]) && !EXCLUDE_VALUE.indexOf(cou[1])
  })
}

export default function getVerification(data) {
  let array = []
  for (let key in data) {
    if (!(data[key] instanceof File)) {
      array.push(key + '=' + data[key])
    }
  }
  return md5(filterKey(array).sort().join('K') + 'Kkey=' + H5_KEY).toUpperCase()
}

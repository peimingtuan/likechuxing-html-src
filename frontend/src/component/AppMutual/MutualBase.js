/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: mutualBase
 Author: garvey
 Version: 1.0.0
 Date: 2017/11/23-上午10:52
 Description:app交互基类，进行数据的封装，是否在app中判断，弹出prompt
 Demo:
 Others:
 *************************************************/
import getAppArguments from '../../js/getAppArguments'
import statusCode from '../../js/statusCode'

require('../../js/polyfills')
export default class MutualBase {
  constructor() {
    this.appArguments = getAppArguments()
    this.app_version = this.appArguments.app_version
    this.successJson = getSuccessJson()
    this.failJson = getFailJson()
  }

  sendPrompt(data) {
    for (let k in data) {
      data[k] = String(data[k])
    }
    data.identity = 'like_web'

    let res = window.prompt(JSON.stringify(data))
    if (!res) {
      res = this.failJson
    }
    return res
  }
}

function getFailJson(opt) {
  return JSON.stringify(Object.assign({
    status: statusCode.NORMAL_ERROR,
    msg: '请求失败',
    data: []
  }, opt))
}

function getSuccessJson(opt) {
  return JSON.stringify(Object.assign({
    status: 0,
    msg: '',
    data: []
  }, opt))
}
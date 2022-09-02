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
import appArguments from '../../app-arguments'
import statusCode from '../../../src/js/statusCode'
import AppMutualOld from "./MutualOld";

require('../../polyfills/index.js')

export default class MutualBase {
  constructor() {
    this.appArguments = appArguments
    this.app_version = this.appArguments.app_version
    this.successJson = getSuccessJson()
    this.failJson = getFailJson()
    this.appMutualOld = new AppMutualOld()
  }

  sendPrompt(data) {
    data.identity = 'like_web'

    if(appArguments.in_app){
      let res = window.prompt(JSON.stringify(data))
      if (!res) {
        res = this.failJson
      }
      return res
    }else{
      console.log('app交互参数',data)
    }

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
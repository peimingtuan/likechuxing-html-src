/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: Err
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/7/2-下午5:00
 Description:
 Param:
 Return:
 *************************************************/
const ERRORS = [
  [100,'隐式错误，不做显性提示或在其他步骤已经提示'],
  [101,''],

  [200,'http网络错误'],
  [201,'网络异常','网络异常，请重试'],

  [300,'接口异常'],
  [301,'接口异常','数据异常，请重试'],

  [400,'用户行为异常'],
  [401,'定位未授权','请授权定位']
]

export default class Err {
  constructor(err){

    this.code = 101
    this.msg = ''

    if(err){
      if(/\d{3}/.test(err)){
        this._buildErrFromCode(err)
      }else{
        this._buildErrFromObject(err)
      }
    }
  }

  _getErrByCode(code){

    let err = ERRORS.find(item=>item[0]===code)

    if(err){
      return err
    }else{
      throw '未找到错误代码'+code+'对应的错误类型，请先添加错误类型'
    }
  }

  _buildErrFromCode(code){
    let err = this._getErrByCode(code)

    this.code = code
    this.desc = err[1]
    this.msg = err[2]
  }

  _buildErrFromObject(object){
    this.code = 301
    this.desc = this._getErrByCode(301)[1]
    this.status = object.status
    this.msg = object.msg
    this.data = object.data
  }

}

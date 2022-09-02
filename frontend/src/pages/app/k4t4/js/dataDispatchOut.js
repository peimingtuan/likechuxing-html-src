/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: dataDispatchOut
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/7/18-上午10:11
 Description:
 Param:
 Return:
 *************************************************/
import SessionData from '../../../../component/webStorage/SessionData'

export default class DataDispatchOut extends SessionData {
  constructor(data){
    super({
      name: 'DataDispatchOut',
      keys: [
        'data'
      ]
    })

    this.save(data)
  }
}
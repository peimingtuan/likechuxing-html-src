/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: Lnglat
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/10/11-下午5:46
 Description:
 Param:
 Return:
 *************************************************/
export default class Lnglat {
  constructor (lng, lat){

    if(!lng || !lat)return

    this.lng = Number(lng)

    this.lat = Number(lat)

  }

  getLnglat(){
    return [this.lng, this.lat]
  }
}
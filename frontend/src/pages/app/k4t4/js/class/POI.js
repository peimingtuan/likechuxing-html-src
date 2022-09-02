/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: POI
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/4/8-下午5:26
 Description:
 Param:
 Return:
 *************************************************/
export default class POI {
  constructor(lng,lat){
    this.lng = Number(lng)
    this.lat = Number(lat)
  }

  addDesc(key,value){
    this[key] = value
  }

  getLngLat(){
    return [this.lng, this.lat]
  }

  inChina(){
    return this.lng >73 && this.lng < 135 && this.lat > 4 && this.lat <135
  }
}

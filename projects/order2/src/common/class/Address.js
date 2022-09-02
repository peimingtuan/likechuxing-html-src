/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: Address
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/4/20-下午1:42
 Description:
 Param:
 Return:
 *************************************************/
import POI from './POI'

export default class Address extends POI{
  constructor({lng,lat,name,address}){
    super(lng,lat)
    this.name = name
    this.address = address
  }
}

/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: class.MAP_CALL
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/6/1-下午6:51
 Description:
 Param:
 Return:
 *************************************************/
export default class MAP_CALL {
  // 唤起高德导航
  constructor() {
    this.AMap = window.AMap
    this.AMap.plugin(['AMap.Driving'], function () {
      this.driving = new AMap.Driving({
        policy: AMap.DrivingPolicy.LEAST_TIME
      });
    }.bind(this))
  }

  call(data) {
    this.driving.search(data.origin, data.destination,{}, function (status, result) {
      this.driving.searchOnAMAP({
        origin: result.origin,
        destination: result.destination
      })
    }.bind(this))
  }
}

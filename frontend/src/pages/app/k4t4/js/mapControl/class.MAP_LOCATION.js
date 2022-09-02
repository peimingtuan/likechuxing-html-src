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

    let that = this
    this.AMap.plugin('AMap.Geolocation', function() {
      that.geolocation = new AMap.Geolocation({
        // 是否使用高精度定位，默认：true
        enableHighAccuracy: true,
        // 设置定位超时时间，默认：无穷大
        timeout: 10000,
        showButton:false
      })
    })
  }

  getLocation(cb){
    this.geolocation.getCurrentPosition(cb)
  }
}

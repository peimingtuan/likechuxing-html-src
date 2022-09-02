/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: class.MAP_END_BRANCH_CONFIRM
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/6/1-下午7:03
 Description:
 Param:
 Return:
 *************************************************/
import MAP_BASE from "./class.MAP_BASE";
import MARKER_ICON from './MARKER_ICON'

export default class MAP_END_BRANCH_CONFIRM extends MAP_BASE{
  constructor() {
    super()
  }

  // 绘制/更新用户位置小蓝点
  drawUserLoc(poi, panTo) {
    if(!this.map){
      return
    }

    if (this.user_marker) {
      this.user_marker.setPosition(poi.getLngLat())
    } else {
      this.user_marker = new AMap.Marker({
        icon: MARKER_ICON.CAR,
        offset: new AMap.Pixel(-16, -16),
        position: poi.getLngLat(),
        map: this.map,
        zIndex: 200
      })
    }
    if (panTo) {
      this.map.panTo(poi.getLngLat())
    }
  }
}

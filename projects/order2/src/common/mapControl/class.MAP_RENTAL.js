/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: class.MAP_RENTAL
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/6/1-下午6:59
 Description:
 Param:
 Return:
 *************************************************/
import MAP_BASE from "./class.MAP_BASE";
import MARKER_ICON from './MARKER_ICON'

export default class MAP_RENTAL extends MAP_BASE{
  constructor() {
    super()
    this.city_icon_marker = null

    this.rental_branch_marker = null
    this.rental_start_branch_marker = null
    this.rental_end_branch_marker = null

    this.FLAG_ICON_BOTTOM = 0.6
  }

  destroy() {
    this.city_icon_marker = null
    this.rental_branch_marker = null
    this.rental_start_branch_marker = null
    this.rental_end_branch_marker = null
    super.destroy()
  }

  drawRentalBranch(branch) {
    if (this.rental_branch_marker) {
      this.rental_branch_marker.eachLayer(item => {
        item.setMap(null)
      })
    }
    this.rental_branch_marker = new AMap.LayerGroup([
      this.getBranchMarker(branch),
      this.getBranchCntMarker(branch)
    ])
    this.map.setFitView()
  }

  drawStartBranch(branch) {
    if (this.rental_start_branch_marker) {
      this.rental_start_branch_marker.setMap(null)
    }
    this.rental_start_branch_marker = new AMap.Marker({
      icon: MARKER_ICON.BRANCH.START,
      offset: new AMap.Pixel(-10, -10),
      position: branch.poi.getLngLat(),
      map: this.map
    });
  }

  drawEndBranch(branch) {
    if (this.rental_end_branch_marker) {
      this.rental_end_branch_marker.setMap(null)
    }
    this.rental_end_branch_marker = new AMap.Marker({
      icon: MARKER_ICON.BRANCH.END,
      offset: new AMap.Pixel(-10, -10),
      position: branch.poi.getLngLat(),
      map: this.map
    });
  }
}

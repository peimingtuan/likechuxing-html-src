/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: class.MAIN_MAP.js
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/5/23-下午3:10
 Description:
 Param:
 Return:
 *************************************************/
import MAP_BASE from './class.MAP_BASE'
import POI from "../class/POI";
import {Toast} from '../../../../../../other_modules/vue-plugins/like-base/'

const store = {}

const SHOW_CITY_ICON_ZOOM = 7

export default class MAP_MAIN extends MAP_BASE {
  constructor() {
    super()
    this.city_icon_marker = null

    this.zoom = null
    this.center = null
  }

  initMap(selector, opt) {
    if (this.zoom) {
      opt.zoom = this.zoom
    }
    if (this.center) {
      opt.center = this.center
    }
    super.initMap(selector, opt)

    let that = this
    this.map.on('zoomchange', function () {
      that.zoom = that.map.getZoom()
    })
    this.map.on('moveend', function () {
      that.center = that.map.getCenter()
    })

  }

  destroy() {
    this.city_icon_marker = null
    this.rental_branch_marker = null
    this.rental_start_branch_marker = null
    this.rental_end_branch_marker = null
    super.destroy()
  }

/*  drawBranch(list) {
    let that = this
    super.drawBranch({
      list,
      active_branch: store.state.branch.active_branch,
      marker_click: function (item) {
        if (Number(item.car_cnt) === 0) {
          Toast('暂无车辆，试试别的网点吧')
          store.commit('branch/branchChosenClear')
          that.drawBranch(list)
          return
        }

        store.commit('branch/setActiveBranch', item)
        store.dispatch('branch/getCarList')
        that.drawBranch(list)
      }
    })
  }*/
}

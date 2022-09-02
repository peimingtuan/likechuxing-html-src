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
import store from "../../store/store";
import {Toast} from '../../../other_modules/vue-plugins/like-base/'

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

  drawBranch(list) {
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

    if (this.map.getZoom() < SHOW_CITY_ICON_ZOOM) {
      this.branch_nearBy_marker.hide()
    }
  }

  drawCityIcon(list) {
    let that = this
    if (!this.map) {
      return
    }
    this.city_icon_marker = new AMap.OverlayGroup(list.map(item => {
      let marker = new AMap.Marker({
        icon: new AMap.Icon({
          image: item.icon,
          size: new AMap.Size(60, 60),
          imageSize: new AMap.Size(60, 60)
        }),
        offset: new AMap.Pixel(-30, -30),
        position: [item.lng, item.lat],
        map: this.map
      });

      // 城市icon点击
      marker.on('click', function () {
        // 移动到城市
        that.map.setZoomAndCenter(15, [item.lng, item.lat])
        // 设置大头针位置
        store.commit('branch/setFlagLoc', new POI(item.lng, item.lat))
        // 设置选择的城市id
        store.commit('branch/setChoseCity', item.city_id)
        // 重新获取该城市的branch list
        store.dispatch('branch/getBranchList',{city_id:item.city_id}).then(() => {
          // 绘制附近网点
          that.drawBranch(store.getters['branch/branch_list_nearby'])
        })
      })

      return marker
    }))

    if (this.map.getZoom() >= SHOW_CITY_ICON_ZOOM) {
      this.city_icon_marker.hide()
    }

    this.map.on('zoomchange', () => {
      let zoom = this.map.getZoom()
      if (zoom < SHOW_CITY_ICON_ZOOM) {
        // 当缩放到城市级别，清空所选网点及车辆
        store.commit('branch/setStartBranch', null)
        store.commit('branch/setCarList', [])
        this.city_icon_marker.show()
        this.branch_nearBy_marker.hide()
      } else {
        this.city_icon_marker.hide()
        this.branch_nearBy_marker.show()
      }
    })
  }

/*  // 绑定dragend事件
  onDragend(cb) {
    this.map.on('dragend', () => {
      let center = this.map.getCenter()
      cb(new POI(center.lng, center.lat))
    })
  }*/
}

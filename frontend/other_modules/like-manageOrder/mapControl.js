/*************************************************
 * Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 * File name: mapControl
 * Author: garvey sunjiawei@likechuxing.com
 * Version: 1.0.0
 * Date: 2018-12-21-18:05
 * Description:
 *
 *
 *************************************************/
import {getMarker, markerConfig} from "./getMarker"

require('./css/mapControl.less')

class MapBase {
  constructor () {
    if (!window.AMap) throw new Error('You need import AMap JSSDK first!')

    this.map = null
    this.PointSimplifier = null
    this.Driving = null

    this.markerConfig = markerConfig
  }

  init (elem, conf) {
    return new Promise(resolve => {

      this.map = new AMap.Map(elem, conf);

      this.map.on('complete', resolve)
    })

  }

  loadPointSimplifier () {

    return new Promise(resolve => {
      window.AMapUI.load(['ui/misc/PointSimplifier'], function (PointSimplifier) {
        resolve(PointSimplifier)
      }).then(PointSimplifier => {
        this.PointSimplifier = PointSimplifier
      })
    })

  }

  loadDriving () {
    if (this.Driving) return Promise.resolve()

    return new Promise(resolve => {
      let that = this
      this.map.plugin('AMap.Driving', function (Driving) {
        that.Driving = Driving
        resolve()
      })
    })
  }
}

class MapControl extends MapBase {
  constructor () {
    super()
    this.marker = {} // 地图遮罩marker
  }

  init ({elem, center, loadPointSimplifier = false, showCurrent = false}) {

    if (loadPointSimplifier) this.loadPointSimplifier()

    let conf = {
      //mapStyle: 'amap://styles/whitesmoke',
      zoom: 15,//级别
      center: center
    }

    return super.init(elem, conf).then(() => {
      // 是否画自己的定位
      if (showCurrent) this.drawUserMarker(center)
    })
  }

  // 画自己当前位置
  drawUserMarker (center) {
    if (this.marker.user) {
      this.marker.user.setPosition(center)
    } else {
      this.marker.user = getMarker({
        type: 'user',
        map: this.map,
        poi: center
      })
    }

  }

  // 画单个网点
  drawBranchMarker (branch) {

    let type = Number(branch.biz_type) === 0 ? 'branch_b' : 'branch_b+'

    let marker = getMarker({
      type: type,
      map: this.map,
      poi: [branch.lng, branch.lat],
      zIndex: 20,
      extData: branch
    })

    return marker

  }

  // 画网点组
  drawBranchMarkers (branches) {

    if (this.marker.branchMarkers) this.marker.branchMarkers.setMap(null)

    this.marker.branchMarkers = new AMap.OverlayGroup(branches.map(item => this.drawBranchMarker(item)))
  }

  drawBranchNumMarker (branch) {
    return getMarker({
      type: 'branchNum',
      map: this.map,
      poi: [branch.lng, branch.lat],
      zIndex: 30,
      extData: branch,
      content: this.markerConfig.branchNum.contentTemplate.replace('$num$', branch.car_num || 0)
    })
  }

  drawBranchNumMarkers (branches) {
    if (this.marker.branchNumMarkers) this.marker.branchNumMarkers.setMap(null)

    this.marker.branchNumMarkers = new AMap.OverlayGroup(branches.map(item => this.drawBranchNumMarker(item)))
  }

  drivingOnAmap (opt) {
    this.loadDriving().then(() => {
      let driving = new AMap.Driving({
        policy:AMap.DrivingPolicy.REAL_TRAFFIC
      })
      console.log(driving)
      driving.searchOnAMAP(opt)
    })
  }
}

export default new MapControl()
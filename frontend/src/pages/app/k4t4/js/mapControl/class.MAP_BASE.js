/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: class.BASE_MAP.js
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/5/23-下午3:10
 Description:
 Param:
 Return:
 *************************************************/
import MARKER_ICON from './MARKER_ICON'
import POI from "../class/POI";

export default class BASE_MAP {
  constructor() {
    this.AMap = window.AMap

    this.map = null

    this.user_marker = null

    this.active_branch_last = null
    // 附近网点图标集合
    this.branch_nearBy_marker = null
  }

  initMap(selector, opt) {
    this.map = new AMap.Map(selector, Object.assign({
      resizeEnable: true,
      zoom: 5,
      // 西安，中国中心
      center: [108.894324, 34.285013]
    }, opt));

    // 挂载拖拽结束事件
    if (typeof opt.onDragEnd === 'function') {
      this.map.on('dragend', () => {
        let center = this.map.getCenter()
        opt.onDragEnd(new POI(center.lng, center.lat))
      })
    }

    if(window.AMapUI){
      AMapUI.loadUI(['control/BasicControl'], function (BasicControl) {
        this.map.addControl(new BasicControl.Zoom({
          position: 'lm'
        }));
      }.bind(this));
    }

  }

  destroy() {
    if (this.map) {
      this.map.destroy()
      this.map = null
      this.user_marker = null
      this.active_branch_last = null
      this.branch_nearBy_marker = null
    }
  }

  // 绘制/更新用户位置小蓝点
  drawUserLoc(poi, panTo) {
    if (!this.map) {
      return
    }

    if (this.user_marker) {
      this.user_marker.setPosition(poi.getLngLat())
    } else {
      this.user_marker = new AMap.Marker({
        icon: MARKER_ICON.USER,
        offset: new AMap.Pixel(-10, -10),
        position: poi.getLngLat(),
        map: this.map,
        zIndex: 200
      })
    }
    if (panTo) {
      this.map.panTo(poi.getLngLat())
    }
  }

  _getBranchIcon(branch, active_branch) {
    let icon = ''
    if (active_branch && branch.id === active_branch.id) {
      // 大图
      if (branch.biz_type === '0') {
        icon = branch.car_cnt > 0 ? MARKER_ICON.BRANCH.B.XL.H : MARKER_ICON.BRANCH.B.XL.N
      } else {
        icon = branch.car_cnt > 0 ? MARKER_ICON.BRANCH.BP.XL.H : MARKER_ICON.BRANCH.BP.XL.N
      }
    } else {
      // 普通图
      if (branch.biz_type === '0') {
        icon = branch.car_cnt > 0 ? MARKER_ICON.BRANCH.B.L.H : MARKER_ICON.BRANCH.B.L.N
      } else {
        icon = branch.car_cnt > 0 ? MARKER_ICON.BRANCH.BP.L.H : MARKER_ICON.BRANCH.BP.L.N
      }
    }
    return icon
  }

  _getBranchMarker(item, active_branch) {
    let marker_opt = {
      position: [item.lng, item.lat],
      map: this.map,
      icon: this._getBranchIcon(item, active_branch)
    }
    if (active_branch && Number(item.id) === Number(active_branch.id)) {
      // 大图
      marker_opt.offset = new AMap.Pixel(-30, -60)
      marker_opt.zIndex = 101
    } else {
      // 普通图
      marker_opt.offset = new AMap.Pixel(-21, -44)
      marker_opt.zIndex = 100
    }
    return new AMap.Marker(marker_opt);
  }

  _getBranchCntMarker(item, active_branch) {
    let className = "point_car_cnt"
    if (item.car_cnt === 0) {
      className += ' empty'
    }
    let car_cnt = item.car_cnt > 8 ? '8+' : item.car_cnt
    let offset = new AMap.Pixel(5, -49)
    let zIndex = 100
    if (active_branch && item.id === active_branch.id) {
      className += " xl"
      offset = new AMap.Pixel(6, -64)
      zIndex = 101
    }
    return new AMap.Marker({
      content: '<div class="' + className + '">' + car_cnt + '</div>',
      position: [item.lng, item.lat],
      offset: offset,
      map: this.map,
      zIndex: zIndex
    });
  }

  _diffBranchList(list_new, active_branch_new) {

    // 当前显示的网点id集合
    let ids_last = this.branch_nearBy_marker.getOverlays().map(item => item.branch_id)
    // 要显示的新的网点集合
    let ids_new = list_new.map(item => item.id)

    // 计算需要新绘制的网点集合
    let branch_add = list_new.filter(item => ids_last.indexOf(item.id) === -1)
    // 计算需要删除的网点id集合
    let ids_minus = ids_last.filter(item => ids_new.indexOf(item) === -1)

    // 激活网点永远进行重绘
    if(this.active_branch_last){
      ids_minus.push(this.active_branch_last.id)
      branch_add.push(this.active_branch_last)
    }
    if(active_branch_new){
      ids_minus.push(active_branch_new.id)
      branch_add.push(active_branch_new)
    }
    this.active_branch_last = active_branch_new

    return {
      branch_add,
      ids_minus
    }
  }

  // 绘制list的网点
  drawBranch({list, active_branch, marker_click,hide_cnt}) {
    if(this.branch_nearBy_marker === null)this.branch_nearBy_marker=new AMap.OverlayGroup([])

    let diff = this._diffBranchList(list, active_branch)

    // 对需要删减的marker、cnt_marker进行删除
    this.branch_nearBy_marker.removeOverlays(
      this.branch_nearBy_marker.getOverlays().filter(marker => {
        if (diff.ids_minus.indexOf(marker.branch_id) > -1) {
          marker.setMap(null)
          return true
        } else {
          return false
        }
      })
    )

    // 新增网点，网点图标和网点车辆数捆绑成overlayGroup
    this.branch_nearBy_marker.addOverlays(diff.branch_add.map(item=>{

      // 生成网点图标
      let marker_branch = this._getBranchMarker(item, active_branch)
      marker_branch.marker_type='branch'

      let group = [marker_branch]

      if(!hide_cnt){
        // 生成剩余车辆数图标
        let marker_cnt = this._getBranchCntMarker(item, active_branch)
        marker_cnt.marker_type='cnt'
        group.push(marker_cnt)
      }

      let marker = new AMap.OverlayGroup(group)
      marker.branch_id = item.id
      marker.branch = item

      // 注册点击事件
      marker.on('click', function () {
        marker_click(item)
      })

      return marker
    }))
  }
}

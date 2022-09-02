/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: area.class.js
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/8/2-下午7:28
 Description:
 Param:
 Return:
 *************************************************/

class Rect {
  constructor (id,center,step,countArea){
    this.id = id
    this.center = center

    this.southWest = [this.center[0]-step.lng_diff_half,this.center[1]-step.lat_diff_half]
    this.northEast = [this.center[0]+step.lng_diff_half,this.center[1]+step.lat_diff_half]
    this.bounds = new AMap.Bounds(this.southWest,this.northEast)

    this.hasBranch = false
    this.branches = []
    this.level = 0
    this.areaResult = countArea.map(item=>{
     let bool = AMap.GeometryUtil.isPointInRing(this.center, item.path)
     if(bool && item.level > this.level)this.level = item.level

      return bool
    })
  }

  push(branch){
    if(!this.hasBranch)this.hasBranch = true
    this.branches.push(branch)
  }

}

export default class Area {
  constructor (branches,step,countArea){
    this.branches = branches
    this.step = {
      lng_diff: step.lng_diff,
      lat_diff: step.lat_diff,
      lng_diff_half: step.lng_diff/2,
      lat_diff_half: step.lat_diff/2
    }
    this.col_max = 0
    this.countArea = countArea

    this.bounds = this._getBounds(branches)
    console.time('createRect')
    this.rects = this._createRects(this.bounds)
    console.timeEnd('createRect')

    this._loadBranches(branches)
    //this.rects_data = this.rects.filter(item=>item.hasBranch)
  }

  _getBounds(branches){
    let east = 0
    let south = 0
    let west = 0
    let north = 0

    branches.forEach(item=>{
      if(item.lng > east)east = item.lng
      if(!south || item.lat < south)south = item.lat
      if(!west || item.lng < west)west = item.lng
      if(item.lat > north)north = item.lat
    })

    return new AMap.Bounds([west,south],[east,north])
  }

  _createRects(bounds){
    let rects = []

    let start_lat = bounds.getSouthWest().lat
    let start_lng = bounds.getSouthWest().lng
    let end_lat = bounds.getNorthEast().lat+this.step.lat_diff_half
    let end_lng = bounds.getNorthEast().lng+this.step.lng_diff_half
    let tag_lat = start_lat
    let tag_lng = start_lng

    let col = 0
    let id = 0

    while (tag_lat <= end_lat){
      col = 0
      while(tag_lng <= end_lng){
        rects.push(new Rect(id,[tag_lng,tag_lat], this.step,this.countArea))
        id++
        col++
        tag_lng+=this.step.lng_diff
      }
      tag_lng = start_lng
      tag_lat+=this.step.lat_diff
    }

    this.col_max = col

    return rects
  }

  _loadBranches(branches){
    let southWest = this.bounds.getSouthWest()

    branches.forEach(item=>{
      let row = Math.floor((item.lat - southWest.lat + this.step.lat_diff_half)/this.step.lat_diff)
      let col = Math.floor((item.lng - southWest.lng + this.step.lng_diff_half)/this.step.lng_diff)

      let id = row * this.col_max + col
      item.biz_type = Number(item.biz_type)
      this.rects[id].push(item)
    })
  }
}


/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: makeArea
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/10/11-下午5:16
 Description:
 Param:
 Return:
 *************************************************/
import Bounds from '../../../../../other_modules/like-model/models/Bounds'
import Rect from '../module/class.rect'

const getAreaStep = function (center, width) {
  // 经纬度差
  return {
    lat_diff: width / 111,
    lng_diff: width / (111 * Math.cos(center.lat * Math.PI / 180))
  }
}

const getBoundsByPoints = function(points){
  let east = 0
  let south = 0
  let west = 0
  let north = 0

  points.forEach(item=>{
    if(Number(item.lng) > east)east = Number(item.lng)
    if(!south || Number(item.lat) < south)south = Number(item.lat)
    if(!west || Number(item.lng) < west)west = Number(item.lng)
    if(Number(item.lat) > north)north = Number(item.lat)
  })

  return new Bounds({
    lng:west,
    lat:south
  },{
    lng:east,
    lat:north
  })
}

const getAreas = function (center, bounds) {

  let areas = []

  // 半径500米
  let step = getAreaStep(center, 0.5)

  let left = Math.ceil((center.lng - bounds.southWest.lng - step.lng_diff/2) / step.lng_diff)
  let down = Math.ceil((center.lat - bounds.southWest.lat - step.lat_diff/2) / step.lat_diff)
  let southWestArea = new Rect({
    lng: center.lng - left*step.lng_diff,
    lat: center.lat - down*step.lat_diff
  }, step)

  let top = Math.ceil((bounds.northEast.lat - center.lat - step.lat_diff/2)/step.lat_diff)
  let right = Math.ceil((bounds.northEast.lng - center.lng - step.lng_diff/2)/step.lng_diff)
  let northEastArea = new Rect({
    lng: center.lng + right*step.lng_diff,
    lat: center.lat + top*step.lat_diff
  }, step)

  let row = 0
  let col = 0
  while (southWestArea.getCenter().lat+row*step.lat_diff <= northEastArea.getCenter().lat + step.lat_diff/2){
    col = 0
    while(southWestArea.getCenter().lng+col*step.lng_diff <= northEastArea.getCenter().lng + step.lng_diff/2){
      areas.push(new Rect({
        lng:southWestArea.getCenter().lng+col*step.lng_diff,
        lat:southWestArea.getCenter().lat+row*step.lat_diff
      }, step))
      col++
    }
    row++
  }

  return areas.map((item,index)=>{
    item.id = index+1
    return item
  })
}

export {
  getAreas,
  getBoundsByPoints
}
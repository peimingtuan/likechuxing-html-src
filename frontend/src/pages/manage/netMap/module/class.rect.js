/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: class.area.js
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/10/12-下午6:53
 Description:
 Param:
 Return:
 *************************************************/
import Bounds from '../../../../../other_modules/like-model/models/Bounds'
import Lnglat from '../../../../../other_modules/like-model/models/Lnglat'

export default class Rect extends Bounds {
  constructor (id, data) {

    let southWest = null
    let northEast = null

    // 两种数据格式，传中心和宽度或者传西南和东北两个点
    if (data.hasOwnProperty('center') && data.hasOwnProperty('step')) {
      southWest = new Lnglat(data.center.lng - data.step.lng_diff / 2, data.center.lat - data.step.lat_diff / 2)
      northEast = new Lnglat(data.center.lng + data.step.lng_diff / 2, data.center.lat + data.step.lat_diff / 2)
    } else if (data.hasOwnProperty('southWest') && data.hasOwnProperty('northEast')) {
      southWest = new Lnglat(data.southWest.lng, data.southWest.lat)
      northEast = new Lnglat(data.northEast.lng, data.northEast.lat)
    } else {
      console.warn('实例化Rect时数据格式错误', data)
    }

    super(southWest, northEast)

    this.id = id
    this.branches = []
    // 统计area，和手绘的area不是一个area
    this.areaResult = []
    this.color = 'blue'
    this.color_border = 'blue'

    this.area_id = null
    // [背景色，边框色]
    this.area_color = [null,null]
  }

  getCountAreaResult (countArea) {
    let center = this.getCenter()
    this.areaResult = countArea.map(item => {
      let bool = AMap.GeometryUtil.isPointInRing([center.lng, center.lat], item.path)
      if (bool && item.level > this.level) this.level = item.level

      return bool
    })
  }

  setArea(area){
    this.area_id = Number(area.id)
    this.area_color = [area.color, area.color_border]
  }

  removeArea(){
    this.area_id = null
    this.area_color = [null,null]
  }

  getColor(){
    let color = this.area_color[0] || this.color
    let color_border = this.area_color[1] || this.color_border
    return [color,color_border]
  }

}
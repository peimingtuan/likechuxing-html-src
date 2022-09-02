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
import Bounds from './Bounds'
import Lnglat from './Lnglat'

export default class Rect extends Bounds{
   constructor (center, step){

     let southWest = new Lnglat(center.lng - step.lng_diff / 2, center.lat - step.lat_diff / 2)
     let northEast = new Lnglat(center.lng + step.lng_diff / 2, center.lat + step.lat_diff / 2)

     super(southWest, northEast)

     this.branches = []
     this.areaResult = []
     this.color = 'blue'
     this.color_border = 'blue'
   }

   getCountAreaResult(countArea){
     let center = this.getCenter()
     this.areaResult = countArea.map(item=>{
       let bool = AMap.GeometryUtil.isPointInRing([center.lng,center.lat], item.path)
       if(bool && item.level > this.level)this.level = item.level

       return bool
     })
   }


}
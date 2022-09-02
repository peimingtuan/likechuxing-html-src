/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: Bounds
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/10/11-下午5:27
 Description:
 Param:
 Return:
 *************************************************/
import Lnglat from './Lnglat'

 export default class Bounds {
   constructor (southWest, northEast){

     if(!southWest instanceof Lnglat || !northEast instanceof Lnglat) throw 'new Bounds 收到非Lnglat参数'

     this.southWest = southWest

     this.northEast = northEast

   }

   getCenter(){

     let lng_diff = this.northEast.lng - this.southWest.lng
     let lat_diff = this.northEast.lat - this.southWest.lat

     return {
       lng:this.southWest.lng + lng_diff/2,
       lat: this.southWest.lat + lat_diff/2
     }
   }

   inBounds(point){
     if(!point instanceof Lnglat)throw 'inBounds 收到非Lnglat参数'

     if(point.lng < this.southWest.lng)return false
     if(point.lng > this.northEast.lng)return false
     if(point.lat < this.southWest.lat)return false
     if(point.lat > this.northEast.lat)return false
     return true
   }
}
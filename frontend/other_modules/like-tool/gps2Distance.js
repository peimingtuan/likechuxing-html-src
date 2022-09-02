/*************************************************
 * Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 * File name: Gps2Distance
 * Author: garvey sunjiawei@likechuxing.com
 * Version: 1.0.0
 * Date: 2019-01-05-11:52
 * Description:
 *
 *
 *************************************************/
 module.exports = new class Gps2Distance {
   constructor(){
     this.EARTH_RADIUS = 6371
   }

   distance(point1,point2){
     let lng1 = this.ConvertDegreesToRadians(point1[0])
     let lat1 = this.ConvertDegreesToRadians(point1[1])
     let lng2 = this.ConvertDegreesToRadians(point2[0])
     let lat2 = this.ConvertDegreesToRadians(point2[1])

     let vLon = Math.abs(lng1 - lng2);
     let vLat = Math.abs(lat1 - lat2);

     //h is the great circle distance in radians, great circle就是一个球体上的切面，它的圆心即是球心的一个周长最大的圆。
     let h = this.HaverSin(vLat) + Math.cos(lat1) * Math.cos(lat2) * this.HaverSin(vLon);
     return 2 * this.EARTH_RADIUS * Math.asin(Math.sqrt(h));
   }

   HaverSin(theta) {
     let v = Math.sin(theta / 2);
     return v * v;
   }

   ConvertDegreesToRadians(degrees){
     return degrees * Math.PI / 180;
   }

   ConvertRadiansToDegrees(radian) {
     return radian * 180.0 / Math.PI;
   }
 }
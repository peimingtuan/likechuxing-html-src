/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: gps2distance
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/18-下午12:23
 Description:根据经纬度计算两点间直线距离
 Param:
 Return:
 *************************************************/

export default class Gps2Distance {
    constructor(){
        this.EARTH_RADIUS = 6371
    }

    distance(points){
        let lng1 = this._ConvertDegreesToRadians(points[0][0])
        let lat1 = this._ConvertDegreesToRadians(points[0][1])
        let lng2 = this._ConvertDegreesToRadians(points[1][0])
        let lat2 = this._ConvertDegreesToRadians(points[1][1])

        let vLon = Math.abs(lng1 - lng2);
        let vLat = Math.abs(lat1 - lat2);

        //h is the great circle distance in radians, great circle就是一个球体上的切面，它的圆心即是球心的一个周长最大的圆。
        let h = this._HaverSin(vLat) + Math.cos(lat1) * Math.cos(lat2) * this._HaverSin(vLon);
        return 2 * this.EARTH_RADIUS * Math.asin(Math.sqrt(h));
    }

    _HaverSin(theta)
    {
        var v = Math.sin(theta / 2);
        return v * v;
    }

    _ConvertDegreesToRadians(degrees){
        return degrees * Math.PI / 180;
    }

    _ConvertRadiansToDegrees(radian)
    {
        return radian * 180.0 / Math.PI;
    }
}
 
/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: ObjectWithGPS
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/2/1-上午10:51
 Description:
 Param:
 Return:
 *************************************************/
import GPS2Distance from '../../../../../js/function/gps2distance'
const gps2distance = new GPS2Distance()
export default class ObjectWithGPS {
    constructor({lng,lat}){
        this.lng = Number(lng)
        this.lat = Number(lat)
    }

    inChina(){
        return this.lng >73 && this.lng < 135 && this.lat > 4 && this.lat <135
    }

    getGPSArray(){
        return [this.lng, this.lat]
    }

    distance(point){
        if(!point instanceof ObjectWithGPS && (!point.hasOwnProperty('lng') || !point.hasOwnProperty('lat'))){
            console.warn('计算两点间距离出错，其中一个点无经纬度')
            return NaN
        }

        return gps2distance.distance([[this.lng, this.lat], [point.lng, point.lat]])
    }

    isSame(point){
        if(!point instanceof ObjectWithGPS && (!point.hasOwnProperty('lng') || !point.hasOwnProperty('lat'))){
            console.warn('两点比较出错，其中一个点无经纬度')
            return false
        }

        return this.lng === point.lng && this.lat === point.lat
    }
}
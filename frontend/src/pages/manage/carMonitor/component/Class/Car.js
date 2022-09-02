/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: Car
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/2/1-上午11:12
 Description:
 Param:
 Return:
 *************************************************/
import ObjectWithGPS from './ObjectWithGPS'
export default class Car extends ObjectWithGPS{
    constructor(object){
        super({
            lng: object.lng,
            lat: object.lat
        })
        this.id = object.id
        this.city_id = object.city_id
        this.plate_no = object.plate_no
        this.vin = object.vin
        this.status = object.status
        this.speed = object.speed
        this.max_km = object.max_km //最大里程
        this.soc = object.soc // 剩余百分比
        this.remain = Number(object.max_km)*Number(object.soc)/100 //计算剩余里程
        this.tbox_time = object.tbox_time
        this.direction = 0 //正北为0，顺时针
        this.Lnglat_log = []
    }

    equal(car){
        if(!car instanceof Car){
            return false
        }

        return this.id === car.id
    }

    match(search){
        let result = [true]
        if(search.city_id !== '0'){
            result.push(search.city_id == this.city_id)
        }
        if(search.status !== ''){
            result.push(search.status == this.status)
        }
        if(search.plate_no !== ''){
            result.push(new RegExp(search.plate_no,'i').test(this.plate_no))
        }
        if(search.vin !== ''){
            result.push(new RegExp(search.vin, 'i').test(this.vin))
        }
        return result.every(item=>item)
    }

    update(car){
        this.Lnglat_log.push({
            lng:this.lng,
            lat:this.lat,
            tbox_time:this.tbox_time
        })
        this.status = car.status
        this.speed = car.speed
        this.soc = car.soc // 剩余百分比
        this.remain = Number(car.max_km)*Number(car.soc)/100 //计算剩余里程
        this.tbox_time = car.tbox_time

        let dis_north = car.lat-this.lat
        let dis_east =car.lng-this.lng
        if(!this.isSame(car)){
            this.direction = Math.atan2(dis_east,dis_north)*180/Math.PI
            if(this.direction === -0)this.direction = 0
            if(this.direction < 0)this.direction+=360
        }
        this.lng = car.lng
        this.lat = car.lat
    }
}
/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: Fence
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/2/26-上午11:01
 Description:
 Param:
 Return:
 *************************************************/
import {translateCity} from '../../../../../js/function/translateCity'

export default class Fence{
    constructor(object){
        this.city_id = object.city_id
        this.city_name = translateCity.getCityByCityId(Number(object.city_id)).name
        this.name = object.fence_name
        this.id = object.id
        this.status = object.status || 0
        this.status_desc = ['未启用','启用'][Number(this.status)]

        this.fence_type = object.fence_type || '0'
        this.fence_type_desc = ['驶入报警','驶出报警','驶入驶出报警'][Number(this.fence_type)]
        this.coord_ids = object.coord_ids || ''
        this.fence_points = object.points || []
        this.start_time = object.start_time || 0
        this.end_time = object.end_time || 86400
    }

    getFencePoints(){
        if(this.fence_points.length > 0){
            return this.fence_points
        }

        let _str = this.coord_ids.replace(/"/g,'')
        let points =  _str.split(';').map(item=>{
            let _point = item.split(',')
            return [_point[1],_point[0]]
        })
        if(points.length > 0){
            this.fence_points = points
            return this.fence_points
        }

        return []
    }

    getCoordIds(){
        return JSON.stringify(this.getFencePoints().map(item=>item.lat+','+item.lng))
    }
}
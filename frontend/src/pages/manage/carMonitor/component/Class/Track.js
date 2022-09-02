/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: Track
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/2/5-上午11:55
 Description:
 Param:
 Return:
 *************************************************/
import ObjectWithGPS from './ObjectWithGPS'

class TrackPoint extends ObjectWithGPS{
    constructor(point){
        super({
            lng: point.longitude,
            lat: point.latitude
        })
        this.soc = point.soc
        this.loc_time = point.loc_time
        this.create_time = point.create_time
    }
}

export default class Track {
    constructor(data){
        data = Object.assign({
            staycount: 0,
            staypoint: [],
            track: []
        }, data)
        this.staycount = Number(data.staycount)
        this.staypoint = data.staypoint
        this.points = data.track.map(point => new TrackPoint(point))
        this.init()
    }

    append(track){
        if(!track instanceof Track){
            return
        }

        this.staycount += track.staycount
        this.staypoint = this.staypoint.concat(track.staypoint)
        this.points = this.points.concat(track.points)
        this.init()
    }

    init(){
        // 升序
        this.points.sort((a, b) => a.loc_time - b.loc_time)


        if(this.points.length < 2){
            this.continual = []
            return
        }
        // 两点间距离小于x公里认为没有移动
        let distance = 0.01
        let array = []
        let _begin = null
        let _point = this.points[0]

        this.points.forEach(item=>{
            if((item.distance(_point)) >= distance){
                if(!_begin){
                    _begin = item
                }
            }else{
                if(_begin){
                    array.push([_begin, item])
                    _begin = null
                }
            }
            _point = item
        })
        if(_begin){
            array.push([_begin, this.points[this.points.length - 1]])
        }
        this.continual = array

        /*
        // 间隔超过600秒认为是轨迹中断，绘制不连续的蓝色bar
        let step = 600
        let array = [[this.points[0]]]
        let _point = this.points[0]

        let last_point = this.points.pop()
        this.points.forEach(item=>{
            if((item.loc_time - _point.loc_time) > step){
                array[array.length - 1].push(_point)
                array.push([item])
            }
            _point = item
        })
        array[array.length - 1].push(last_point)
        this.continual = array
        */
    }

    getSpeed(index){
        let pre_speed = 0
        let aft_speed = 0
        let _distance, _time
        if(index > 0){
            _distance = this.points[index].distance(this.points[index-1])
            _time = (this.points[index].loc_time - this.points[index-1].loc_time)/3600
            pre_speed = _distance/_time
        }
        if(index < (this.points.length-1)){
            _distance = this.points[index].distance(this.points[index+1])
            _time = (this.points[index+1].loc_time - this.points[index].loc_time)/3600
            aft_speed = _distance/_time
        }
        return Math.round((pre_speed+aft_speed)/2)
    }
}
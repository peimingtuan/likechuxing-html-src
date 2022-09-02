import loading from '../component/loading'
import {Toast} from "../component/LikeAlert";
import {CommonActions} from "./CommonStore";
const coordtransform = require('coordtransform');

/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: BMapLocation
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/23-上午10:04
 Description:
 Param:
 Return:
 *************************************************/
export default function (cb){
    loading.show()
    let geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition(function(r){
        loading.hide()
        if(this.getStatus() == BMAP_STATUS_SUCCESS){
            let point = coordtransform.bd09togcj02(r.point.lng,r.point.lat)
            CommonActions.changeState({
                user_lng:point[0],
                user_lat:point[1]
            })
            cb()
        }
        else {
            // 原本是弹出提示，但弹提示也无济于事，索性取app返回的经纬度
            cb()
        }
    },{enableHighAccuracy: true})
}
/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: location
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/18-上午10:30
 Description:
 Param:
 Return:
 *************************************************/

require('./location.less')
import React from 'react'
import Reflux from 'reflux'
import $ from 'jquery'
import {CarStore} from "../../js/CarStore";
const coordtransform = require('coordtransform');
import AppMutual from '../../../../../component/AppMutual'
const appMutual = new AppMutual()

export default class Location extends Reflux.Component {
    constructor() {
        super()
        this.state = {
            car_location_desc:''
        }
        this.store = CarStore
        this.storeKeys = [
            'car_lng',
            'car_lat'
        ]
    }

    componentDidMount() {
        appMutual.sendUpdateTitle('新春大吉')
        $('#map').height(window.innerHeight)

        let that = this

        let car_point_array = coordtransform.gcj02tobd09(this.state.car_lng,this.state.car_lat)
        let car_point = new BMap.Point(car_point_array[0], car_point_array[1])
        let map = new BMap.Map("map");    // 创建Map实例
        map.centerAndZoom(car_point, 15);
        map.enableScrollWheelZoom()
        // 中心点
        let marker = new BMap.Marker(car_point,{
            icon: new BMap.Icon(require('../../images/icon_car.png'), new BMap.Size(36,36),{
                imageSize:new BMap.Size(36,36),
                anchor:new BMap.Size(18,18),
            })
        });
        map.addOverlay(marker)
    }

    render() {
        return <div className="Location">
            <div id='map' />
        </div>
    }
}


 
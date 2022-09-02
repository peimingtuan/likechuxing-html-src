
/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: navigation
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/23-下午9:28
 Description:
 Param:
 Return:
 *************************************************/
require('./navigation.less')
import React from 'react'
import Reflux from 'reflux'
import $ from "jquery";
const coordtransform = require('coordtransform');
import AppMutual from '../../../../../component/AppMutual'
const appMutual = new AppMutual()

export default class navigation extends React.Component {
    constructor() {
        super()
    }

    componentDidMount() {
        appMutual.sendUpdateTitle("新春大吉")
        $('#map').height(window.innerHeight)

        let user = Reflux.GlobalState.common
        let user_point_array = coordtransform.gcj02tobd09(user.user_lng,user.user_lat)
        let user_point = new BMap.Point(user_point_array[0], user_point_array[1])

        let rental = Reflux.GlobalState.rental
        let rental_point_array = coordtransform.gcj02tobd09(rental.end_branch_lng,rental.end_branch_lat)
        let rental_point = new BMap.Point(rental_point_array[0], rental_point_array[1])

        let map = new BMap.Map("map");    // 创建Map实例
        map.centerAndZoom(user_point, 15);
        let driving = new BMap.DrivingRoute(map, {
            renderOptions: {
                map: map,
                autoViewport: true
            }
        });

        driving.search(user_point, rental_point);
    }

    render() {
        return <div className="Navigation">
            <div id='map' />
        </div>
    }
}


 
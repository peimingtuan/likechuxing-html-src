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
import {appMutual} from '../../../../../../other_modules/app-mutual'

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
        let user = Reflux.GlobalState.common
        
        appMutual.send.updateTitle('车辆定位')
        $('#map').height(window.innerHeight)

        let that = this
        let user_point = coordtransform.gcj02tobd09(user.user_lng,user.user_lat)
        let car_point_array = coordtransform.gcj02tobd09(this.state.car_lng,this.state.car_lat)
 
        let map_point = new BMap.Point(user_point[0],user_point[1]);
        let map = new BMap.Map("map");    // 创建Map实例
  
        map.centerAndZoom(map_point, 15);
        map.enableScrollWheelZoom()
        // 中心点
        let marker = new BMap.Marker(map_point,{
            icon: new BMap.Icon(require('../../images/icon_car.png'), new BMap.Size(36,36),{
                imageSize:new BMap.Size(36,36),
                anchor:new BMap.Size(18,18),
            })
        });
        map.addOverlay(marker)
        
        let p1 = new BMap.Point(user_point[0],user_point[1]);
        let p2 = new BMap.Point(car_point_array[0],car_point_array[1]);
        var walking = new BMap.WalkingRoute(map, {renderOptions:{map: map, autoViewport: true}});
        walking.search(p2, p1);
        // walking.setSearchCompleteCallback(function(){
        //     var pts = walking.getResults().getPlan(0).getRoute(0).getPath();    
        //     walking.clearResults();   
        //     var polyline = new BMap.Polyline(pts, { strokeColor: "#333", strokeWeight: 6, strokeOpacity: 1 });     
        //     map.addOverlay(polyline);
            
        //     setTimeout(function(){
        //         map.setViewport(p2, p1);          //调整到最佳视野
        //     },1000);
            
        // });
    }

    render() {
        return <div className="Location">
            <div id='map' />
        </div>
    }
}


 
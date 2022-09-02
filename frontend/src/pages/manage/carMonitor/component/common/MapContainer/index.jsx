/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2017/11/29-下午2:08
 Description:
 Param:
 Return:
 *************************************************/
require('./index.less')
import React from 'react'

export default class MapContainer extends React.Component {
    constructor() {
        super()
    }

    componentDidMount() {
        window.mapControl.initMap()
    }

    componentWillUnmount(){
        window.mapControl.destroy()
    }

    render() {
        return <div id="mapContainer" />
    }
}
 
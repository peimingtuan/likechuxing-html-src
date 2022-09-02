/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2017/11/29-下午2:38
 Description:
 Param:
 Return:
 *************************************************/
require('./index.less')
import React from 'react'
import Reflux from 'reflux'
import TrackSearchActions from '../../Stores/TrackSearchActions'
import MapContainer from '../../common/MapContainer'
import TrackControlBox from '../TrackControlBox'
import TrackSettings from '../TrackSettings'
import TimeLine from '../TimeLine'

export default class index extends Reflux.Component {
    constructor() {
        super()
    }

    componentDidMount() {
        TrackSearchActions.getCityList()
    }

    render() {
        return <div className="TrackContent">
            <MapContainer/>
            <TrackControlBox/>
            <TrackSettings/>
            <TimeLine/>
        </div>
    }
}
 
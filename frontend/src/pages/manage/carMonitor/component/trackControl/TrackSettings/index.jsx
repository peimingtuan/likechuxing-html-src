/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2017/11/30-下午7:02
 Description:
 Param:
 Return:
 *************************************************/
require('./index.less')
import React from 'react'
import Reflux from 'reflux'
import Layer from './Layer'
import Setting from './Setting'
import Optimize from './Optimize'
import Track from './Track'
import Stay from './Stay'
import Cutline from './Cutline'

export default class TrackSettings extends Reflux.Component {
    constructor() {
        super()
    }

    componentDidMount() {
    }

    componentDidUpdate() {
    }

    render() {
        return <div className="TrackSettings boxShadow">
            <Optimize/>
            <Layer/>
            {/*<Setting/>*/}

            <Stay/>
            <Cutline/>
           {/* <Track/>*/}
        </div>
    }
}
 
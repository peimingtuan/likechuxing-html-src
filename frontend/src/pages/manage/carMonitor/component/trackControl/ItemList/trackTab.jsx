/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2017/11/30-下午12:46
 Description:
 Param:
 Return:
 *************************************************/
require('./trackTab.less')
import React from 'react'
import Reflux from 'reflux'
import TrackSearchStore from '../../Stores/TrackSearchStore'
import TrackSearchActions from '../../Stores/TrackSearchActions'

export default class TrackTab extends Reflux.Component {
    constructor() {
        super()
        this.store = TrackSearchStore
        this.storeKeys = [
            'carListType'
        ]
    }

    render() {
        return <div className="TrackTab">
            <div className="tab_con">
                <div className="tab"><span className="pointer" onClick={() => TrackSearchActions.switchCarListType('0')}>实时位置</span></div>
                <div className="tab"><span className="pointer" onClick={() => TrackSearchActions.switchCarListType('1')}>轨迹查询</span></div>
            </div>
            <div className={"chooseFlag" + (this.state.carListType === '0' ? ' left' : ' right')} />
        </div>
    }
}
 
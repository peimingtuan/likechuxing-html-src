/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2017/12/4-下午5:07
 Description:
 Param:
 Return:
 *************************************************/
require('./index.less')
import React from 'react'
import Reflux from 'reflux'
import TrackSearchStore from '../../Stores/TrackSearchStore'
import TrackSearchActions from '../../Stores/TrackSearchActions'
import CarActions from '../../Stores/CarActions'
import DatePicker from '../../base/DatePicker'
import Time from '../../../../../../js/function/Time'

export default class trackDatePicker extends Reflux.Component {
    constructor() {
        super()
        this.store = TrackSearchStore
        this.storeKeys = [
            'carListType',
            'track_start_time',
            'track_end_time'
        ]
    }

    changeDate(type, value){
        CarActions.changeActiveCar({})
        TrackSearchActions.setTrackTime(type, value)
    }

    render() {
        let start = this.state.track_start_time > 1 ? new Time(this.state.track_start_time).getTime('YYYY-MM-DD HH:mm') : ''
        let end = this.state.track_end_time > 1 ? new Time(this.state.track_end_time).getTime('YYYY-MM-DD HH:mm') : ''
        return (
            <div className={"TrackDatePicker " + (this.state.carListType === '1' ? '': 'hidden')}>
                <DatePicker
                    value={start}
                    placeholder="起始时间"
                    className="picker"
                    onChange={(value)=>this.changeDate.call(this, 'start', value)}
                />
                <DatePicker
                    value={end}
                    placeholder="结束时间"
                    className="picker"
                    onChange={(value)=>this.changeDate.call(this, 'end', value)}
                />
            </div>
        )
    }
}
 
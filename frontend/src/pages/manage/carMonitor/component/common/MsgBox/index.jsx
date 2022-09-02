/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2017/12/8-上午10:53
 Description:
 Param:
 Return:
 *************************************************/
require('./index.less')
import React from 'react'
import Reflux from 'reflux'
import HeaderStore from '../../Stores/HeaderStore'
import SettingStore from '../../Stores/SettingStore'
import ReportFenceStore from '../../Stores/ReportFenceStores'
import Loading from './Loading'
import Timer from './Timer'
import Alarm from './Alarm'

export default class MsgBox extends Reflux.Component {
    constructor() {
        super()
        this.stores = [
          HeaderStore,
          SettingStore,
          ReportFenceStore
        ]
        this.storeKeys = [
          'setting_performance_autoRefresh',
          'autoRefreshCars_clock_point_deg',
          'alarmList_show'
        ]
    }

    render() {
        return <div className="MsgBox">
            <Loading/>
            {this.state.setting_performance_autoRefresh?<Timer/>:""}
            <Alarm/>
        </div>
    }
}
 
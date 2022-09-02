import ConfigStore from "../../Stores/ConfigStore";

/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2017/11/29-下午3:03
 Description:
 Param:
 Return:
 *************************************************/
require('./index.less')
import React from 'react'
import Reflux from 'reflux'

import ReportStore from '../../Stores/ReportStore'
import Menu from '../../base/Menu'
import Route from '../../base/Route'
import FenceReport from '../FenceReport'
import TrackStopReport from '../TrackStopReport'
import ReportActions from "../../Stores/ReportActions";

export default class ReportContent extends React.Component {
    constructor() {
        super()
    }

    render() {
        return <div className="ReportContent">
            <Menu
                store={ReportStore}
                actions={ReportActions}
            />
            <div className="contents">
                <Route store={ReportStore} pathname='/report/fence' component={<FenceReport/>}/>
                <Route store={ReportStore} pathname='/report/stop' component={<TrackStopReport/>}/>
            </div>
        </div>
    }
}
 
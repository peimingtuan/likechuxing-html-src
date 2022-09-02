/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2017/12/11-上午10:34
 Description:
 Param:
 Return:
 *************************************************/
require('./index.less')
import React from 'react'
import Reflux from 'reflux'
import ReportStore from '../store/ReportStore'
import ReportAction from '../action/ReportActions.js'
import Table from '../../base/Table/Table'
import $ from '../../../../../../../other_modules/jquery&ui/jquery&ui'

export default class TrackStopReport extends Reflux.Component {
    constructor() {
        super()
        this.state = {
            trackStopPointHeader: [
                {key:'index', name:'序号'},
                {key:'stay_time',name:'起止时间'},
                {key:'duration',name:'停留时长'},
                {key:'address',name:'位置'}
            ]
        }
        this.store = ReportStore
    }

    componentDidMount() {
        $('#trackStop_date').datepicker({
            dateFormat: "yy-mm-dd",
            maxDate: "+0d",
            monthNames: [ "一月", "二月", "三月", "四月l", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月" ],
            dayNames: [ "周日", "周一", "周二", "周三", "周四", "周五", "周六" ],
            dayNamesMin: [ "日", "一", "二", "三", "四", "五", "六" ]
        }).on('change',function(e){
            ReportAction.changeTrackStopDate(e.currentTarget.value)
        });
    }

    componentDidUpdate() {
    }

    changeDate(){
    }

    handleKeyBoard(e){
        // 监听回车
        if(e.key === 'Enter' && this.state.trackStop_queryString!==''){
            ReportAction.searchTrackStop()
        }
    }

    render() {
        return <div className={"TrackStopReport " + (this.state.activeMenuIndex === '1' ? '' : 'hidden')}>
            <div className="query_con">
                <label className="trackStop_date">
                    日期：
                    <input type="text" id="trackStop_date" value={this.state.trackStop_date} onChange={this.changeDate} />
                </label>
                <label className="trackStop_queryString">
                    车辆：
                    <input type="text" placeholder="车牌号" value={this.state.trackStop_queryString} onKeyPress={this.handleKeyBoard.bind(this)} onChange={(e) => ReportAction.changeTrackStopQueryString(e.currentTarget.value)} />
                </label>
                <span className={"search_btn pointer" + (this.state.trackStop_queryString === ''? ' hidden' : '')} onClick={ReportAction.searchTrackStop} />
            </div>
            <div className="table_con">
                <Table
                    title="停留点列表"
                    header={this.state.trackStopPointHeader}
                    list={this.state.track_stopPoints}
                />
            </div>
        </div>
    }
}
 
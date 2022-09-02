/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2017/12/11-上午10:33
 Description:
 Param:
 Return:
 *************************************************/
require('./index.less')
import React from 'react'
import Reflux from 'reflux'
import $ from 'jquery'
import FenceStore from "../../Stores/FenceStore";
import ReportFenceStore from '../../Stores/ReportFenceStores'
import ReportFenceActions from '../../Stores/ReportFenceActions'
import ReportStore from '../store/ReportStore'
import ReportAction from '../action/ReportActions.js'
import toast from "../../../../../../component/toast/index";
import LabelInput from '../../base/LabelInput'
import AlarmList from './alarmList'
import DatePicker from '../../base/DatePicker'
import Time from '../../../../../../js/function/Time'

export default class FenceReport extends Reflux.Component {
  constructor() {
    super()
    this.state = {
    }
    this.stores = [
      FenceStore,
      ReportFenceStore
    ]
    this.storeKeys = [
      'fence_cityList',
      'alarm_time_start',
      'alarm_time_end'
    ]
  }

  changeDate(type, value){
    ReportFenceActions.changeState({
      ['alarm_time_'+type]: value
    })
  }

  getAlarmList(){
    if(!this.checkQuery()){
      return
    }

    ReportFenceActions.getAlarmList()
  }

  saveAlarmList(){
    if(!this.checkQuery()){
      return
    }

    ReportFenceActions.saveAlarmList()
  }
  
  checkQuery(){
    if(this.state.alarm_time_start === '' || this.state.alarm_time_end === ''){
      toast('查询时段不能为空')
      return false
    }
    if(new Date(this.state.alarm_time_start).getTime() > new Date(this.state.alarm_time_end).getTime()){
      toast('起始时间不能大于结束时间')
      return false
    }
    return true
  }
  
  

  render() {
    return <div className="FenceReport">
      <div className="content-right">
        <div className="top">
          <div>
            <label>围栏城市：
              <select className="city" value={this.state.alarm_city_id} onChange={(e)=>ReportFenceActions.changeState({alarm_city_id: $(e.target).val()})}>
                <option value='0'>全部</option>
                {this.state.fence_cityList.map(item => <option
                  key={item.city_id}
                  value={item.city_id}
                >{item.name}</option>)}
              </select>
            </label>
            <label>类型：
              <select className="fence-state" value={this.state.alarm_type} onChange={(e)=>ReportFenceActions.changeState({alarm_type: $(e.target).val()})}>
                <option value='0'>全部</option>
                <option value='1'>驶入报警</option>
                <option value='2'>驶出报警</option>
              </select>
            </label>
            <LabelInput opt={{
              labelClassName: 'fence-name',
              labelText: '车牌：',
              changeCallback: (value) => ReportFenceActions.changeState({alarm_plate_no: value})
            }}/>
            <button className="btn-button" onClick={this.getAlarmList.bind(this)}>查询</button>
            <button className="btn-button" onClick={this.saveAlarmList.bind(this)}>导出</button>
          </div>
          <div>
            <label>查询时段：
              <DatePicker
                value={this.state.alarm_time_start}
                placeholder="起始时间"
                className="picker inline"
                onChange={(value) => this.changeDate.call(this, 'start', value)}
              />
            </label>
            <label>至：
              <DatePicker
                value={this.state.alarm_time_end}
                placeholder="结束时间"
                className="picker inline"
                onChange={(value) => this.changeDate.call(this, 'end', value)}
              />
            </label>
          </div>
        </div>
        <div className="bottom">
          <AlarmList/>
        </div>
      </div>
    </div>
  }
}
 
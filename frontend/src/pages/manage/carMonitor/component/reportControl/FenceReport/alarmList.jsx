/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: AlarmList
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/3/1-下午4:10
 Description:
 Param:
 Return:
 *************************************************/
require('./alarmList.less')
import React from 'react'
import Reflux from 'reflux'
import Table from '../../base/Table/Table'
import ReportFenceStore from "../../Stores/ReportFenceStores";
import Time from '../../../../../../js/function/Time'

export default class AlarmList extends Reflux.Component {
  constructor() {
    super()
    this.stores = [
      ReportFenceStore
    ]
    this.storeKeys = [
      'alarmList'
    ]
  }

  render() {
    let list = this.state.alarmList.map((item, index)=>{
      item.index = index+1
      item.alarm_action_desc = ['驶入报警','驶出报警'][item.alarm_action]
      item.alarm_time_hum = new Time(item.alarm_time).getTime('YYYY-MM-DD HH:mm:ss')
      return item
    })
    return <div className="AlarmList">
      <Table
        title="电子围栏"
        header={[{key:'index',name:'序号'},{key:'plate_no',name:'车牌'},{key:'fence_name',name:'触发围栏'},{key:'alarm_action_desc',name:'类别'},{key:'alarm_time_hum',name:'触发时间'}]}
        list={list}
        items={15}
      />
    </div>
  }
}


 
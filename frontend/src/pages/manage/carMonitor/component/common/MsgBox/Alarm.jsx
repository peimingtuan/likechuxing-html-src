/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: Alarm
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/3/2-上午10:57
 Description:
 Param:
 Return:
 *************************************************/
import ReportFenceStore from "../../Stores/ReportFenceStores";
require('./Alarm.less')
import React from 'react'
import Reflux from 'reflux'
import AlarmWindowList from '../../reportControl/FenceReport/alarmWindowList'

export default class Alarm extends Reflux.Component {
  constructor() {
    super()
    this.state = {
      showContainer:false
    }
    this.store = ReportFenceStore
    this.storeKeys = [
      'alarmWindowList'
    ]
  }

  toggleShow(){
    this.setState({
      showContainer: !this.state.showContainer
    })
  }

  render() {
    return <div className="Alarm" onClick={this.toggleShow.bind(this)}>
      <i className={"iconfont icon-tongzhi " + (this.state.alarmWindowList.length > 0 ? 'info' : '')}/>
      <div className={"container " + (this.state.showContainer ? 'show':'')} onClick={(e)=>e.stopPropagation()}>
        <i className="iconfont icon-guanbi1" onClick={this.toggleShow.bind(this)}/>
        <AlarmWindowList/>
      </div>
    </div>
  }
}


 
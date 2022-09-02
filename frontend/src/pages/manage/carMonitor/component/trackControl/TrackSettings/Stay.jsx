/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: Detaine
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2017/12/11-下午2:40
 Description:
 Param:
 Return:
 *************************************************/
import React from 'react'
import Reflux from 'reflux'
import CarActions from '../../Stores/CarActions'
import CarStore from '../../Stores/CarStore'
import SettingStore from '../../Stores/SettingStore'
import SettingActions from '../../Stores/SettingActions'
import TrackSearchStore from '../../Stores/TrackSearchStore'
import TrackSearchActions from '../../Stores/TrackSearchActions'
import toast from '../../../../../../component/toast'

export default class Stay extends Reflux.Component {
  constructor() {
    super()
    this.state = {
      menuList: [
        {key: 'setting_Detained_showTrackStopPoints', name: '显示停留点'}
      ]
    }
    this.stores = [TrackSearchStore, CarStore, SettingStore]
    this.storeKey = [
      'track',
      'carListType',
      'setting_Detained_showTrackStopPoints'
    ]
  }

  switchLayer(type, value) {
    if (value && this.state.track.staycount == 0) {
      toast('当前轨迹没有停留点可供显示')
      return
    }

    SettingActions.changeSettings(type, value)
  }

  render() {
    return <div className={"Settings Layer" + (this.state.carListType === '0' ? ' hidden' : '')}>
      <i className="iconfont icon-tingchechang setting_icon"/>
      <ul className="menu boxShadow">
        <li className="title">停留点-共{this.state.track.staycount}处</li>
        {this.state.menuList.map(item => (
            <li className="item" key={item.key}>
              <label>
                <input type="checkbox" onChange={() => this.switchLayer(item.key, !this.state[item.key])}
                       checked={this.state[item.key]}/>
                {item.name}
              </label>
            </li>
          )
        )}
      </ul>
    </div>
  }
}

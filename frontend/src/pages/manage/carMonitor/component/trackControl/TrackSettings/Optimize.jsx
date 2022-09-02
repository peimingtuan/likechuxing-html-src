/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: Optimize
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2017/12/1-下午6:30
 Description:
 Param:
 Return:
 *************************************************/
import React from 'react'
import Reflux from 'reflux'
import TrackSearchStore from '../../Stores/TrackSearchStore'
import SettingStore from "../../Stores/SettingStore";
import SettingActions from '../../Stores/SettingActions'

export default class Optimize extends Reflux.Component {
  constructor() {
    super()
    this.state = {
      menuList: [
        {key: 'setting_layer_useCarIcon', name: '车形图标'},
        {key: 'setting_layer_showPlateNo', name: '显示车牌'},
        {key: 'setting_performance_autoRefresh', name: '自动刷新'},
      ]
    }
    this.stores = [SettingStore, TrackSearchStore]
    this.storeKeys = [
      'carListType',
      'setting_layer_useCarIcon',
      'setting_layer_showPlateNo',
      'setting_performance_autoRefresh',
    ]
    this.store = TrackSearchStore
  }

  componentDidMount() {
  }

  componentDidUpdate() {
  }

  switchOption(type, value) {
    SettingActions.changeSettings(type, value)
  }

  render() {
    return <div className={"Settings Optimize" + (this.state.carListType === '1' ? ' hidden' : '')}>
      <i className="iconfont icon-huojian setting_icon"/>
      <ul className="menu boxShadow">
        <li className="title">性能优化</li>
        {this.state.menuList.map(item => (
            <li className="item" key={item.key}>
              <label>
                <input type="checkbox" onChange={() => this.switchOption(item.key, !this.state[item.key])}
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
 
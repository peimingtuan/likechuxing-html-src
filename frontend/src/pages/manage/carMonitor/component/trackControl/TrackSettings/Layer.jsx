/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: Layer
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2017/11/30-下午7:04
 Description:
 Param:
 Return:
 *************************************************/
import React from 'react'
import Reflux from 'reflux'
import SettingStore from '../../Stores/SettingStore'
import SettingActions from '../../Stores/SettingActions'
import TrackSearchStore from '../../Stores/TrackSearchStore'

export default class Layer extends Reflux.Component {
  constructor() {
    super()
    this.state = {
      menuList: [
        {key: 'setting_layer_showAllCars', name: '显示车辆'},
        {key: 'setting_layer_showPlateNo', name: '显示车牌'},
        {key: 'setting_layer_showBranch', name: '显示网点'}
      ]
    }
    this.stores = [SettingStore, TrackSearchStore]
    this.storeKeys = [
      'carListType',
      'setting_layer_showAllCars',
      'setting_layer_showPlateNo',
      'setting_layer_showBranch',
    ]
  }

  switchLayer(type, value) {
    SettingActions.changeSettings(type, value)
  }

  render() {
    return <div className="Settings Layer">
      <i className="iconfont icon-tuceng setting_icon"/>
      <ul className="menu boxShadow">
        <li className="title">图层</li>
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
 
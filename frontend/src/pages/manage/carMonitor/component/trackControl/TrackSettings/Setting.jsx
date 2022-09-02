/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: Setting
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2017/12/1-上午11:21
 Description:
 Param:
 Return:
 *************************************************/
import React from 'react'
import Reflux from 'reflux'
import TrackSearchStore from '../../Stores/TrackSearchStore'
import TrackSearchActions from '../../Stores/TrackSearchActions'

export default class Setting extends Reflux.Component {
  constructor() {
    super()
    this.state = {
      menuList: [
        {key: 'setting_layer_useCarIcon', name: '车形图标'}
      ]
    }
    this.store = TrackSearchStore
  }

  switchSetting(type, value) {
    TrackSearchActions.changeSettings(type, value)
  }

  render() {
    return <div className={"Settings Setting" + (this.state.carListType === '1' ? ' hidden' : '')}>
      <i className="iconfont icon-shezhi setting_icon"/>
      <ul className="menu boxShadow">
        <li className="title">设置</li>
        {this.state.menuList.map(item => (
            <li className="item" key={item.key}>
              <label>
                <input type="checkbox" onChange={() => this.switchSetting(item.key, !this.state[item.key])}
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
 
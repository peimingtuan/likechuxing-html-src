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
      showList: [
        {src:require('../../../images/icon_car_blue.png'),text:'长租中'},
        {src:require('../../../images/icon_car_green.png'),text:'租赁中'},
        {src:require('../../../images/icon_car_gray.png'),text:'空闲'},
        {src:require('../../../images/icon_car_yellow.png'),text:'其它'},
        {src:require('../../../images/point_icon_b.png'),text:'B类网点'},
        {src:require('../../../images/point_icon_b+.png'),text:'B+网点'}
      ]
    }
  }

  switchLayer(type, value){
    SettingActions.changeSettings(type, value)
  }

  render() {
    return <div className="Settings Cutline">
      <i className="iconfont icon-tishi setting_icon"/>
      <ul className="menu boxShadow">
        <li className="title">图例</li>
        {this.state.showList.map(item => (
            <li className="item" key={item.text}>
              <img src={item.src} className="img"/>
              <span className="tip">{item.text}</span>
            </li>
          )
        )}
      </ul>
    </div>
  }
}
 
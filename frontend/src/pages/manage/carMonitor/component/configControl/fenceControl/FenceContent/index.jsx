/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2017/11/29-下午3:04
 Description:
 Param:
 Return:
 *************************************************/

require('./index.less')
import React from 'react'
import Reflux from 'reflux'
import LabelInput from '../../../base/LabelInput/index'
import FenceStore from '../../../Stores/FenceStore'
import FenceActions from '../../../Stores/FenceActions'
import AuthStore from '../../../Stores/AuthStore'
import FenceList from '../FenceList/index'
import ConfigActions from '../../../Stores/ConfigActions'
import toast from "../../../../../../../component/toast/index";

export default class FenceContent extends Reflux.Component {
  constructor() {
    super()
    this.stores = [
      FenceStore,
      AuthStore
    ]
    this.storeKeys = [
      'fence_cityList',

      'selectfenceList',
      'carstateListShow',

      'auth_edit_fence'
    ]
  }

  componentDidMount() {
    FenceActions.getCitys()
  }

  newFence() {
    if (!this.state.auth_edit_fence) {
      toast('当前账号无此权限')
      return
    }

    FenceActions.changeState('fenceShowType', 'new')
    FenceActions.clearFence()
    ConfigActions.changeCurrentPath('/fence/show')
  }

  render() {
    return <div className="FenceContent">
      <div className="content-right">
        <div className="top">
          <div>
            <label>城市：</label>
            <select className="city" onChange={(e) => FenceActions.changeFilter('city_id', $(e.target).val())}>
              <option value='0'>全部</option>
              {this.state.fence_cityList.map(item => <option key={item.city_id}
                                                             value={item.city_id}>{item.name}</option>)}
            </select>
            <label>围栏状态：</label>
            <select className="fence-state"
                    onChange={(e) => FenceActions.changeFilter('fence_status', $(e.target).val())}>
              <option value='0'>全部</option>
              <option value='1'>停用</option>
              <option value='2'>启用</option>
            </select>
            <LabelInput opt={{
              labelClassName: 'fence-name',
              labelText: '围栏名称:',
              inputPlaceholder: '围栏名称',
              changeCallback: (value) => FenceActions.changeFilter('fence_name', value)
            }}/>
            <button className={"btn-button blue_btn " + (this.state.auth_edit_fence ? '' : 'disabled')}
                    onClick={this.newFence.bind(this)}>新建围栏
            </button>
          </div>
        </div>
        <div className="bottom">
          <FenceList/>
        </div>
      </div>
    </div>
  }
}

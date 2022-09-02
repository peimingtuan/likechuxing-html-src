/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/2/26-上午10:19
 Description:
 Param:
 Return:
 *************************************************/
import ConfigActions from "../../../Stores/ConfigActions";

require('./index.less')
import React from 'react'
import Reflux from 'reflux'
import FenceStore from '../../../Stores/FenceStore'
import FenceActions from '../../../Stores/FenceActions'
import Table from '../../../base/Table/Table'
import toast from "../../../../../../../component/toast/index";
import AuthStore from '../../../Stores/AuthStore'
import AuthActions from '../../../Stores/AuthActions'

class Operate extends Reflux.Component {
  constructor() {
    super()
    this.store = AuthStore
    this.storeKeys = [
      'auth_edit_fence',
      'auth_option_fence',
      'auth_edit_fenceCar'
    ]
  }

  viewFence() {
    FenceActions.getFenceDetail(this.props.data.id, function () {
      FenceActions.changeState('fenceShowType', 'view')
      ConfigActions.changeCurrentPath('/fence/show')
    })
  }

  editFence() {
    if (!this.state.auth_edit_fence) {
      toast('当前账号无此权限')
      return
    }

    FenceActions.getFenceDetail(this.props.data.id, function () {
      FenceActions.changeState('fenceShowType', 'edit')
      ConfigActions.changeCurrentPath('/fence/show')
    })
  }

  toggleEnableFence() {
    if (!this.state.auth_option_fence) {
      toast('当前账号无此权限')
      return
    }

    if(this.props.data.status === '0'){
      FenceActions.enableFence(this.props.data.id)
    }else{
      FenceActions.disableFence(this.props.data.id)
    }
  }

  manageFence() {
    if (!this.state.auth_edit_fenceCar) {
      toast('当前账号无此权限')
      return
    }

    FenceActions.changeState('currentFence', this.props.data)
    ConfigActions.changeCurrentPath('/fence/manage')
  }

  render() {
    return (
      <div className="Operate">
        <button className="operate_btn blue_btn" onClick={this.viewFence.bind(this)}>查看</button>
        <button className={"operate_btn blue_btn " + (this.state.auth_edit_fenceCar ? '' : 'disabled')}onClick={this.manageFence.bind(this)}>管理车辆</button>
        <button className={"operate_btn blue_btn "+ (this.state.auth_option_fence ? '' : 'disabled')} onClick={this.toggleEnableFence.bind(this)}>{this.props.data.status === '0' ? '启用' : '停用'}</button>
        <button className={"operate_btn blue_btn " + (this.state.auth_edit_fence ? '' : 'disabled')} onClick={this.editFence.bind(this)}>编辑</button>
      </div>
    )
  }
}

export default class FenceList extends Reflux.Component {
  constructor() {
    super()
    this.state = {
      fenceListLength: 10
    }
    this.stores = [
      FenceStore
    ]
    this.storeKeys = [
      'fenceList'
    ]
  }

  render() {
    let list = this.state.fenceList.map((item, index) => {
      item.index = index + 1
      item.name_show = item.name.length > 20 ? item.name.substr(0, 20) + '...' : item.name
      item.status_desc = <span className="Tag"><i
        className={"StatusDesc iconfont icon-deng " + (item.status === '1' ? 'lkgreen' : 'lkred')}/>{(item.status === '1' ? '启用' : '停用')}</span>
      item.operate = <Operate data={item}/>
      return item
    })
    return <div className="FenceList">
      <Table
        title="电子围栏"
        header={[{key: 'index', name: '序号'}, {key: 'name_show', name: '围栏名称'}, {
          key: 'city_name',
          name: '城市'
        }, {key: 'status_desc', name: '状态'}, {key: 'operate', name: '操作'}]}
        list={list}
        items={this.state.fenceListLength}
      />
    </div>
  }
}


 
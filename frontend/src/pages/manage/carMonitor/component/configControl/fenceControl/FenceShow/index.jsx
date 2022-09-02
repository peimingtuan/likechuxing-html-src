/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: NewFence
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/2/26-上午11:23
 Description:
 Param:
 Return:
 *************************************************/

require('./index.less')
import $ from 'jquery'
import React from 'react'
import Reflux from 'reflux'
import MapFence from '../MapFence/index'
import LabelInput from '../../../base/LabelInput/index'
import SwitchUpDown from '../../../base/SwitchUpDown'
import TimePicker from '../../../base/TimePicker/index'
import FenceActions from '../../../Stores/FenceActions'
import ConfigActions from '../../../Stores/ConfigActions'
import toast from "../../../../../../../component/toast/index";
import FenceStore from '../../../Stores/FenceStore'

export default class FenceShow extends Reflux.Component {
  constructor() {
    super()
    this.state = {
      isEditing: false,
      boxOpen: false
    }
    this.store = FenceStore
    this.storeKeys = [
      'fence_cityList',

      'currentFence',

      'fence_name',
      'fence_cityId',
      'fence_type',
      'fence_time_start',
      'fence_time_end',
      'fence_remark',
      'fence_points',

      'fenceShowType',
    ]
  }

  componentDidMount() {
    if (this.state.fenceShowType !== 'new') {
      console.log(this.state.currentFence)
      window.mapControl.drawPolygon(this.state.currentFence.getFencePoints())
    }
  }

  componentWillUnmount() {
    window.mapControl.map_fence.destroy()
    super.componentWillUnmount()
  }

  //鼠标绘制面
  drawMap() {
    this.foldBox()
    this.setState({
      isEditing: true
    })
    window.mapControl.drawPolygon(this.state.fence_points)
    window.mapControl.editPolygon()
  }

  //结束鼠标绘制面
  drawEnd() {
    this.openBox()
    this.setState({
      isEditing: false
    })
    FenceActions.changeState('fence_points', window.mapControl.editPolygonEnd())
  }

  //清除鼠标绘制的画面
  clearPolygon() {
    this.setState({
      isEditing: false
    })
    FenceActions.changeState('fence_points', [])
    window.mapControl.clearPolygon()
  }

  save() {
    if (this.state.isEditing) {
      toast('请先结束绘制')
      return
    }
    if (this.state.fence_name === '') {
      toast('请输入围栏名称')
      return
    }
    if (this.state.fence_cityId === '0') {
      toast('请选择所属城市')
      return
    }
    if (this.state.fence_remark === '') {
      toast('请输入备注')
      return
    }
    if (!/^\d{2}:\d{2}$/.test(this.state.fence_time_start)) {
      toast('起始时间格式错误，请按照如08:30格式修改')
      return
    }
    if (!/^\d{2}:\d{2}$/.test(this.state.fence_time_end)) {
      toast('结束时间格式错误，请按照如08:30格式修改')
      return
    }
    if (this.state.fence_points.length === 0) {
      toast('请先绘制围栏')
      return
    }
    FenceActions.save()
  }

  switchBox() {
    this.setState({
      boxOpen: !this.state.boxOpen
    })
    $(this.refs.box).slideToggle(400)
  }

  foldBox(){
    this.setState({
      boxOpen: false
    })
    $(this.refs.box).slideUp(400)
  }

  openBox(){
    this.setState({
      boxOpen: true
    })
    $(this.refs.box).slideDown(400)
  }

  render() {
    let title = {
      'new': '新建围栏',
      'view': '查看围栏',
      'edit': '编辑围栏'
    }[this.state.fenceShowType]
    let use = this.state.fenceShowType === 'view' ? '' : <p className="use">请点击右下角【开始】绘制围栏区域，绘制【结束】后再【保存】围栏</p>
    return <div className="NewFence">
      <MapFence/>
      <div className="new-top">
        <div className="title">
          {title}
          <SwitchUpDown opt={{
            className: 'switchBox',
            open: this.state.boxOpen,
            switchCallback: this.switchBox.bind(this)
          }}/>
        </div>
        <div className="box" ref="box">
          <div className="container">
            <LabelInput opt={{
              labelClassName: 'fence_name',
              labelText: '围栏名称',
              value: this.state.fence_name,
              inputPlaceholder: '',
              readonly: this.state.fenceShowType === 'view',
              changeCallback: (value) => FenceActions.changeState('fence_name', value)
            }}/>
            {this.state.fenceShowType === 'view' ? <LabelInput opt={{
              labelClassName: '',
              labelText: '报警类别',
              value: this.state.currentFence.fence_type_desc,
              readonly: true,
              changeCallback: (value) => FenceActions.changeState('fence_name', value)
            }}/> : <label>
              报警类别
              <select value={this.state.fence_type}
                      onChange={(e) => FenceActions.changeState('fence_type', $(e.target).val())}>
                <option value='0'>驶入报警</option>
                <option value='1'>驶出报警</option>
                <option value='2'>驶入驶出报警</option>
              </select>
            </label>}

          </div>
          <div className="container">
            {this.state.fenceShowType === 'view' ? <LabelInput opt={{
              labelClassName: '',
              labelText: '所属城市',
              value: this.state.currentFence.city_name,
              readonly: true,
              changeCallback: (value) => FenceActions.changeState('fence_name', value)
            }}/> : <label>
              所属城市
              <select value={this.state.fence_cityId}
                      onChange={(e) => FenceActions.changeState('fence_cityId', $(e.target).val())}>
                <option value='0'>请选择</option>
                {this.state.fence_cityList.map(item => <option key={item.city_id}
                                                               value={item.city_id}>{item.name}</option>)}
              </select>
            </label>}
          </div>
          <div className="container">
            <LabelInput opt={{
              labelClassName: 'policetime-start',
              labelText: '报警时段',
              value: this.state.fence_time_start,
              inputPlaceholder: '',
              readonly: this.state.fenceShowType === 'view',
              changeCallback: (value) => FenceActions.changeState('fence_time_start', value)
            }}/>
            <LabelInput opt={{
              labelClassName: 'policetime-end',
              labelText: '至',
              value: this.state.fence_time_end,
              inputPlaceholder: '',
              readonly: this.state.fenceShowType === 'view',
              changeCallback: (value) => FenceActions.changeState('fence_time_end', value)
            }}/>
          </div>
          <div className="container">
            <label className="police-remark">报警备注</label>
            <textarea value={this.state.fence_remark} readOnly={this.state.fenceShowType === 'view'}
                      onChange={(e) => FenceActions.changeState('fence_remark', $(e.target).val())}/>
          </div>
          {use}
          <div className="container btn_con">
            {this.state.fenceShowType === 'view' ? '' :
              <button className={"btn dark_btn " + (this.state.isEditing ? 'disabled' : '')}
                      onClick={this.save.bind(this)}>保存</button>}
            <button className="btn white_btn" onClick={() => ConfigActions.changeCurrentPath('/fence')}>返回</button>
          </div>
        </div>

      </div>
      {this.state.fenceShowType === 'view' ? '' : <div className="Tool">
        <div className="polygon btn pointer" onClick={this.drawMap.bind(this)}>开始</div>
        <div className="polygon-end btn pointer" onClick={this.drawEnd.bind(this)}>结束</div>
        <div className="clear-polygon btn pointer" onClick={this.clearPolygon.bind(this)}>清除</div>
      </div>}
    </div>
  }
}


 
/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/2/28-下午2:47
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
import LabelInput from '../../../base/LabelInput/index'
import $ from 'jquery'
import toast from "../../../../../../../component/toast/index";

export default class FenceCars extends Reflux.Component {
  constructor() {
    super()
    this.state = {
      height: 2,
      type: '',
      city_id: '0',
      supplier: '0',
      plate_no: '',
      chosen: [],
      flag_id: 0,
      show_way:false
    }
    this.store = FenceStore
    this.storeKeys = [
      'currentFence',
      'fence_cityList',
      'fence_supplier',
      'fenceCarsList'
    ]
  }

  componentDidMount() {
    this.setState({
      height: this.refs.FenceCars.offsetHeight - this.refs.search.offsetHeight - this.refs.save.offsetHeight
    })
  }

  changeSearchString(data) {
    this.setState(data)
  }

  getSearchString() {
    this.setState({
      chosen: []
    })

    let data = {
      fence_id: this.state.currentFence.id
    }
    if (this.state.city_id !== '0') {
      data.city_id = this.state.city_id
    }
    if (this.state.supplier !== '0') {
      data.supplier_id = this.state.supplier
    }
    if (this.state.plate_no !== '') {
      data.plate_no = this.state.plate_no
    }
    return data
  }

  getCarsNotInFence() {
    this.setState({
      type: 'add'
    })
    let data = this.getSearchString()
    data.option_type = '1'
    FenceActions.getFenceCars(data)
  }

  getCarsInFence() {
    this.setState({
      type: 'remove'
    })
    let data = this.getSearchString()
    data.option_type = '0'
    FenceActions.getFenceCars(data)
  }

  toggleChosen(e, id) {
    if (e.shiftKey) {
      if (this.state.flag_id === 0) {
        this.setState({
          flag_id: id
        })
      } else {
        let last_id = this.state.flag_id
        let last_index = this.state.fenceCarsList.findIndex(item => item.id === last_id)
        let this_index = this.state.fenceCarsList.findIndex(item => item.id === id)
        let ids = []
        let max = this_index, min = last_index
        if (max < min) {
          max = last_index
          min = this_index
        }
        for (let i = min; i <= max; i++) {
          ids.push(this.state.fenceCarsList[i].id)
        }
        this.addCarToChosen(ids)
        this.setState({
          flag_id: 0
        })
      }
    }
    else {
      this.addCarToChosen([id])
    }
  }

  addCarToChosen(ids) {
    let new_chosen = this.state.chosen
    ids.forEach(id => {
      let index = this.state.chosen.indexOf(id)
      if (index > -1) {
        new_chosen.splice(index, 1)
      } else {
        new_chosen.push(id)
      }
    })
    this.setState({
      chosen: new_chosen
    })
  }

  componentWillUnmount() {
    FenceActions.changeState('fenceCarsList', [])
    super.componentWillUnmount()
  }

  save() {
    let data = {
      fence_id: this.state.currentFence.id,
      carIds: JSON.stringify(this.state.chosen),
      option_type: this.state.type === 'add' ? '0' : '1'
    }
    let that = this
    FenceActions.saveFenceCars(data, function () {
      if (that.state.type === 'add') {
        that.getCarsNotInFence()
      } else {
        that.getCarsInFence()
      }
    })
  }

  toggleShow(){
    this.setState({
      show_way:!this.state.show_way
    })
  }

  render() {
    return <div className="FenceCars" ref="FenceCars">
      <div className="search" ref="search">
        <div className="title">围栏：{this.state.currentFence.name}</div>
        <label>城市：
          <select className="city" onChange={(e) => this.changeSearchString({city_id: $(e.target).val()})}>
            <option value='0'>全部</option>
            {this.state.fence_cityList.map(item => <option key={item.city_id}
                                                           value={item.city_id}>{item.name}</option>)}
          </select>
        </label>
        <label>供应商：
          <select className="supplier" onChange={(e) => this.changeSearchString({supplier: $(e.target).val()})}>
            <option value='0'>全部</option>
            {this.state.fence_supplier.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </label>
        <LabelInput opt={{
          labelClassName: 'plate_no',
          labelText: '车牌号:',
          value: this.state.plate_no,
          inputPlaceholder: '车牌号',
          changeCallback: (value) => this.changeSearchString.call(this, {plate_no: value})
        }}/>
        <span>查询</span>
        <button className="btn blue_btn" onClick={this.getCarsNotInFence.bind(this)}>可添加的车辆</button>
        <button className="btn blue_btn" onClick={this.getCarsInFence.bind(this)}>围栏中的车辆</button>
      </div>
      <div className="car_con" style={{height: this.state.height + 'px'}}>
        <div className="car_header">
          <span className="tip">
            按住shift单击车牌可复选
            <i className="iconfont icon-wenhao" onClick={this.toggleShow.bind(this)}/>
            <div className={"choose_way " + (this.state.show_way ? 'show':'')}>
              <p>
                第一步：按住shift选择某辆车，显示黄绿色外边框：
                <span className="flag">京Q12345</span>
              </p>
              <p>
                第二步：按住shift选择领一辆车，自动将第一步选择的车到当前车之间的所有这辆点选
              </p>
            </div>
          </span>已选择：{this.state.chosen.length} / {this.state.fenceCarsList.length}</div>
        <div className="carList">
          {this.state.fenceCarsList.map(item => <span
            onClick={(e) => this.toggleChosen.call(this, e, item.id)}
            className={"car_item pointer " + (this.state.chosen.indexOf(item.id) > -1 ? "active " : '') + (this.state.flag_id === item.id ? 'flag' : '')}
            key={item.id}
          >{item.plate_no}</span>)}
        </div>
      </div>
      <div className="save_con" ref="save">
        <button className="btn white_btn" onClick={() => ConfigActions.changeCurrentPath('/fence')}>返回</button>
        {this.state.type === '' ? '' : <button onClick={this.save.bind(this)}
                                               className="btn blue_btn">{this.state.type === "add" ? '添加' : '解除'}选中车辆</button>}
      </div>
    </div>
  }
}


 
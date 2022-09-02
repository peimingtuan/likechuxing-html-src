/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: editRental
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/4-下午3:23
 Description:
 Param:
 Return:
 *************************************************/
require('./editRental.less')
import React from 'react'
import Reflux from 'reflux'

const EventEmitter = require('events').EventEmitter;
const emitter = new EventEmitter();
import {umeng}from '../../js/umeng'
import {IndexActions, IndexStore} from "../../js/IndexStore";

import ToLongRentalExplain from '../../component/ToLongRentalExplain'
import {appMutual} from '../../../../../../other_modules/app-mutual'
import createHistory from 'history/createHashHistory'
import { IsAndriod } from "../../../../../js/UserAgent.js";

const history = createHistory()
import {Toast} from "../../component/LikeAlert/index";

import tool from '../../js/tool'

class ChooseTime extends Reflux.Component {
  constructor (props) {
    super(props);
  }

  dateClick (type) {

    if(!this.props.dataReady) return
    IndexActions.initEditRental()
    if (this.props.event) emitter.emit('dateClick', type);
  }

  render () {
    let duration = Math.round((this.props.endTime - this.props.startTime) / 86400)

    return <div className="ChooseTime">
      <div onClick={() => this.dateClick('get')}><span>取 </span>{tool.getMonthDay(this.props.startTime)}</div>
      <div className="duration">
        <span className="day">{duration}天</span>
      </div>
      <div onClick={() => this.dateClick('return')}><span>还 </span>{tool.getMonthDay(this.props.endTime - 86400)}</div>
    </div>
  }
}

class DayBox extends Reflux.Component {
  constructor (props) {
    super(props)
    // 春假放假
    let chunjie = [1549209600, 1549814400]

    // 必选
    let need = [1548950400, 1549814400]

    this.state = {
      need: need,
      holiday: props.data.time >= chunjie[0] && props.data.time < chunjie[1],
      during_need: (props.data.time > need[0] && props.data.time < (need[1] - 86400) ||props.data.time<tool.getToday(props.serverTime)+ 86400*3) 
    }
  }

  getDay (timeStamp) {
    return new Date(timeStamp * 1000).getDate()
  }

  dayClick () {
    if (this.state.during_need) {
      if(this.props.data.time<tool.getToday(this.props.serverTime)+ 86400*3){
        new Toast('只能预订3天后的车辆')
      }else{
        new Toast('2月1日-2月10日为必选租车时间')
      }
    } else {
      if (this.props.data.time <= this.state.need[0]) {
        emitter.emit('setStartTime', this.props.data.time);
      } else {
        emitter.emit('setEndTime', this.props.data.time + 86400);
      }

    }
  }

  render () {

    let is_get = this.props.data.time === this.props.startTime
    let is_end = this.props.data.time === (this.props.endTime - 86400)

    let box_class = this.state.holiday ? 'date-box holiday' : 'date-box'
    if (this.props.data.is_selected) box_class += ' selected'
    if (is_get) box_class += ' get'
    if (is_end) box_class += ' end'
    let holiday_box = this.state.holiday ? <div className="holiday-box active"/> : <div className="holiday-box"/>

    let offset = {}
    if(this.props.index === 0){
      let step =window.innerWidth*0.142857
      offset.marginLeft = new Date(this.props.data.time*1000).getDay()*step + 'px'
    }

    return <div className={box_class} style={offset} onClick={this.dayClick.bind(this)}>
      <div className="day">
        {is_get ? <span className="float-flag get">取</span> : null}
        {this.getDay(this.props.data.time)}
        {is_end ? <span className="float-flag end">还</span> : null}
      </div>
      {holiday_box}
      <div className='price'>¥{this.props.data.price}</div>
    </div>
  }

}

class DatePicker extends Reflux.Component {
  constructor (props) {
    super(props)
    let start_available_time = 1548345600
    let end_available_time = 1550592000

    // 广州且捷达，可选日期缩短
    if(props.jieda){
      start_available_time = 1548864000
      end_available_time = 1550160000
    }
    let days_data = []
    for (let time = start_available_time; time < end_available_time; time += 86400) {
      days_data.push({
        time: time
      })
    }
    this.state = {
      startTime: props.startTime,
      endTime: props.endTime,
      total_day: Math.round((props.endTime - props.startTime) / 86400),
      days_data: days_data
    }
    this.store = IndexStore
    this.storeKeys = [
      'rig_startTime',
      'rig_endTime',
      'bef_price',
      'rig_price',
      'aft_price',
      'serverTime'
    ]
  }

  componentDidMount () {
    umeng.addEvent(['datePicker','show',this.props.cityId])
    this.startEvent = this.setStartTime.bind(this)
    this.endEvent = this.setEndTime.bind(this)

    emitter.on('setStartTime', this.startEvent);//注册事件
    emitter.on('setEndTime', this.endEvent);//注册事件

    // 向history压入当前，如此可借用设备返回按钮关闭预览
    window.history.pushState(null, null, document.URL);

    const popStateCallback = function () {
      emitter.emit('closeDatePicker', '');
      window.removeEventListener("popstate", popStateCallback)
    }
    window.addEventListener("popstate", popStateCallback, false);

  }

  componentWillUnmount () {
    emitter.removeListener('setStartTime', this.startEvent);//取消事件
    emitter.removeListener('setEndTime', this.endEvent);//取消事件
  }

  setStartTime (time) {
    this.setState({
      startTime: time,
      total_day: Math.round((this.state.endTime - time) / 86400),
    })
  }

  setEndTime (time) {
    this.setState({
      endTime: time,
      total_day: Math.round((time - this.state.startTime) / 86400),
    })
  }

  changeTime () {
    umeng.addEvent(['datePicker','confirm',this.props.cityId])
    window.history.go(-1)
    IndexActions.setDuration({
      startTime: this.state.startTime,
      endTime: this.state.endTime
    })

    emitter.emit('closeDatePicker', '');
  }

  render () {
    let days = this.state.days_data.map(item => {
      if (item.time < this.state.rig_startTime) {
        item.price = this.state.bef_price
      } else if (item.time >= this.state.rig_endTime) {
        item.price = this.state.aft_price
      } else {
        item.price = this.state.rig_price
      }

      item.is_selected = (item.time >= this.state.startTime && item.time < this.state.endTime)
      return item
    })
    let days_elem = days.map((item, index) => <DayBox key={index} data={item} index={index} startTime={this.state.startTime}
                                                      endTime={this.state.endTime} serverTime={this.state.serverTime}/>)

    let total = 0
    days.forEach(item => {
      if (item.is_selected) total += item.price
    })
    return (
      <div className="longRental-date-picker">
        <div className="header">
          <ChooseTime
            startTime={this.state.startTime}
            endTime={this.state.endTime}
          />
        </div>

        <div className="calendar-box">
          <div className="month">2019/1 - 2019-2</div>
          <div className="week">
            <div>日</div>
            <div>一</div>
            <div>二</div>
            <div>三</div>
            <div>四</div>
            <div>五</div>
            <div>六</div>
          </div>
          <div className="days">
            {days_elem}
          </div>

          <div className="cal-tips">
            <div>
              <span className="selected"/>
              已选
            </div>
            <div>
              <span className="holiday"/>
              春节假期
            </div>
          </div>
        </div>

        <div className="cal-tips2">（2月1日-2月10日为必选租车时间）</div>

        <div className="btn-con">
          <div className="total">
            共计：
            <span className="day">{this.state.total_day}</span>
            <span className="day-text">天</span>
            (租金
            <span>{total}</span>
            )
          </div>
          <div className="btn" onClick={this.changeTime.bind(this)}>确定</div>
        </div>
      </div>
    )
  }
}

export default class EditRental extends Reflux.Component {
  constructor (props) {
    super(props)

    this.state = {
      show_tips: true,
      datePicker_show: false,

      buy_insurance: true
    }
    this.store = IndexStore
    this.storeKeys = [
      'modelList',
      'currentModelId',
      'startTime',
      'endTime',
      'startPoint',
      'endPoint',
      'rent_fee',
      'deposit',
      'actual_fee',
      'baseActual',
      'currentCityId',
      'discount',
      'rent_insurance',
      'coupon',
      "discount",
      'fee_total_insurance',
      'price_insurance',
      'insurance_service',
      'serverTime'
    ]
  }

  componentDidMount () {
    if(/from=index/.test(this.props.location.search)){
      umeng.addEvent(['createRental','show',this.state.currentCityId])
    }
    appMutual.send.updateTitle('日期及网点选择')
    IndexActions.initEditRental()
    IndexActions.getCost()

    this.showPicker = (msg) => {
      // console.log(msg)// get or return
      this.setState({
        datePicker_show: true
      })
    }
    emitter.on('dateClick', this.showPicker);

    this.hidePicker = () => {
      this.setState({
        datePicker_show: false
      })
      IndexActions.getCost()
    }
    emitter.on('closeDatePicker', this.hidePicker)
  }

  componentWillUnmount () {
    emitter.removeListener('dateClick', this.showPicker);
    emitter.removeListener('closeDatePicker', this.hidePicker)
  }

  chooseBranch (type) {
    history.push({
      pathname: '/chooseBranch/index',
      search: '?type=' + type + '&from=edit'
    })
  }

  toggleInsurance () {
    IndexActions.toggleInsuranceService()
  }

  toPay () {
    if (this.getFinishBoolean.call(this)) {
      IndexActions.createRental()
    }
  }

  hideTips () {
    this.setState({
      show_tips: false
    })
  }

  IsAndriod () {
    let ua = navigator.userAgent.toLowerCase()
    return ua.indexOf('android') > -1 || ua.indexOf('adr') > -1
  }

  getPointComponent () {
    let point = [
      <div className="point_name dark">请选择取车网点</div>,
      <div className="point_name dark">请选择还车网点</div>
    ]
    if (this.state.startPoint) {
      point[0] = <div className="point_name">{this.state.startPoint.branch_name}</div>
    }
    if (this.state.endPoint) {
      point[1] = <div className="point_name">{this.state.endPoint.branch_name}</div>
    }
    return point
  }

  getFinishBoolean () {
    let state = this.state
    return state.startTime && state.endTime && state.startPoint && state.endPoint && state.actual_fee
  }

  goExplains (value) {
    history.push('/explains/fee'+"?type=" + value)
  }

  render () {
    let car = this.state.modelList.find(item => item.model_id === this.state.currentModelId && item.discount === this.state.discount)

    let yueA = null

    if ([197,202, 214, 213].includes(Number(this.state.currentCityId) )) {
      yueA = <p className="p">该车型为非粤A车牌</p>
    }
    if (Number(this.state.currentCityId) === 197 && !/捷达/.test(car.model_name)) {
      yueA = null
    }

    let point = this.getPointComponent.call(this)
    let finish = this.getFinishBoolean.call(this)
    let couponDom = this.state.coupon.free_money && this.state.discount === 0 ?
      <div>优惠
        <div className='item'><span className="redColor float-right">-{this.state.coupon.free_money}</span>元</div>
      </div> : null

    let is_197_jieda = Boolean(Number(this.state.currentCityId) === 197 && /捷达/.test(car.model_name))
    let datePicker = this.state.datePicker_show ?
      <DatePicker startTime={this.state.startTime} endTime={this.state.endTime} jieda={is_197_jieda} cityId={this.state.currentCityId} /> : null

    let title = <div className="name">{car.model_name}</div>
    if(/捷达16/.test(car.model_name)){        
        title = <div className="title">{car.model_name.replace(/16款/,'质惠版')}</div>
    }
    if(/捷达17/.test(car.model_name)){

        title = <div className="title">{car.model_name.replace(/17款/,'时尚版')}</div>
    }
    return <div className="EditRental">
      <div className="editContent">
        <div className="carInfo">
          <div className="desc">
            {title}
            <div className="price"><span className="fs18 money">{car.day_price}</span>元/天起</div>
            {yueA}
          </div>
          <img className="img" src={car.car_img}/>
        </div>

        <ChooseTime
          startTime={this.state.startTime}
          endTime={this.state.endTime}
          event={true}
          dataReady={this.state.serverTime}
        />

        <div className="ChooseAddress">
          <div className="branch_select">
            <div className="start_point point fs14" onClick={() => this.chooseBranch.call(this, 0)}>
              <div className="label labelRed">取车网点：</div>
              {point[0]}
            </div>
          </div>
        </div>
        <div className="ChooseAddress">
          <div className="branch_select">
            <div className="end_point point fs14" onClick={() => this.chooseBranch.call(this, 1)}>
              <div className="label labelGre">还车网点：</div>
              {point[1]}
            </div>
          </div>
        </div>
        <div className="getprice">
          <div>不计免赔<span className={"goExplains " + (IsAndriod()? 'androidbg2':'')}
                         onClick={this.goExplains.bind(this, 'insurance')}> ({this.state.price_insurance}元/天)</span>

            <span onClick={this.toggleInsurance.bind(this)} className={'insurance-switch float-right' + (this.state.insurance_service?' active':'')}>{this.state.fee_total_insurance}元</span>
          </div>
          <div>车辆租金<span className="float-right">{this.state.rent_fee}元</span></div>
          <div>保障服务费<span className={"goExplains " + (IsAndriod()? 'androidbg2':'')}
                          onClick={this.goExplains.bind(this, 'feeInsurance')}></span><span className="float-right">{this.state.rent_insurance}元</span></div>
          {couponDom}
          <div>基本费用合计
            <div className='item'><span className='redColor2 className="float-right"'>{this.state.baseActual}</span>元</div>
          </div>
        </div>
        <div className="depositWrap">长租保证金<span className="float-right">{this.state.deposit}元</span></div>
        <ToLongRentalExplain/>
        <div className="toPay ">
          <div>需支付金额 <span>{this.state.actual_fee}</span> 元</div>
          <a className={"PayBtn " + (finish ? '' : 'disabled')} onClick={this.toPay.bind(this)}>支付费用</a>
        </div>
      </div>
      {datePicker}
    </div>
  }
}


 
/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/3-下午1:24
 Description:
 Param:
 Return:
 *************************************************/

require('./index.less')
import React from 'react'
import Reflux from 'reflux'
import {IndexActions, IndexStore} from "../../js/IndexStore";
import {appMutual} from '../../../../../../other_modules/app-mutual'
import {Select} from "../../component/Select/index";
import createHistory from 'history/createHashHistory'
import {IsAndriod} from "../../../../../js/UserAgent.js";
import {umeng} from '../../js/umeng'

const history = createHistory()

class CarBox extends React.Component {
  constructor () {
    super()
  }

  bookCar (value, e) {
    umeng.addEvent(['carType',this.props.carName,this.props.cityId])

    e.stopPropagation()
    if (this.props.isShowBtn == 1 && value == 'box') return
    if (!this.props.num) return;
    IndexActions.changeState({currentModelId: this.props.id, discount: this.props.discount})
    history.push({
      pathname:'/main/editRental',
      search:'?from=index'
    })
  }

  translateCarName (name) {
    let car_name = name
    if (/捷达16/.test(car_name)) car_name = car_name.replace(/16款/, '质惠版')
    if (/捷达17/.test(car_name)) car_name = car_name.replace(/17款/, '时尚版')
    return <div className="title">{car_name}</div>
  }

  render () {
    let payBtn = this.props.isShowBtn > 1 ? <a className="payBtn">立刻抢订</a> : ""
    let payBtnLong = this.props.isShowBtn == 1 ?
      <a className={"payBtnLong " + (this.props.num ? '' : 'rentOver')}
         onClick={this.bookCar.bind(this, 'longBtn')}>立刻抢订</a> : ""
        //  console.log(this.props.is_hot);
         
    let hot = this.props.is_hot ? <div className="hot"></div> : null
    let title = this.translateCarName(this.props.carName)
    let mask = this.props.num ? null : <div className="mask"></div>
    return (
      <div className="CarBox" onClick={this.bookCar.bind(this, "box")}>
        {mask}
        <div className='carBoxContent'>
          <div className="title">{title}</div>
          <div className="price"><span>{Number(this.props.day_price)}</span>元/天起</div>
          {payBtn}
        </div>
        <img src={this.props.carImg}/>
        {hot}
        {payBtnLong}
      </div>
    )
  }
}

export default class Index extends Reflux.Component {
  constructor () {
    super()
    this.store = IndexStore

    IndexActions.setDuration({
      startTime: 1548950400,
      endTime: 1549814400
    })
  }

  componentDidMount () {
    umeng.addEvent(['mainIndex', 'show',this.state.currentCityId])
    appMutual.send.updateTitle('2019春节长租')
    IndexActions.initIndex()
    IndexActions.changeState({insurance_service: 1})
  }

  changeCity () {
    new Select({
      name: '',
      options: this.state.cityList.map(item => {
        return {
          id: item.id,
          name: item.city,
        }
      }),
      initIndex: this.state.cityList.findIndex(item => item.id == this.state.currentCityId),
      callback: function (item) {
        IndexActions.changeState({'currentCityId': item.id, noChangeCity: false})
        IndexActions.updateModelList()
      }
    })
  }

  toExplain () {
    history.push('/explains')
  }

  render () {
    let city = this.state.cityList.find(item => item.id == this.state.currentCityId)
    let cityName = city ? city.city : ''
    return <div className="Index">
      <div className="city_select" onClick={this.changeCity.bind(this)}>
        <span className="icon_location"/>
        <span className={"cityName " + (IsAndriod() ? "andStyle" : "")}>{cityName}</span>
        <span className="icon_rightArrow"/>
      </div>
      <div className="main_header"/>
      <div className="content_bg">
        <div className="carList">


          {this.state.modelList.map((item, index) => (
            <CarBox
              key={index}
              cityId={this.state.currentCityId}
              carName={item.model_name}
              price={item.car_price}
              carImg={item.car_img}
              id={item.model_id}
              discount={item.discount}
              day_price={item.day_price}
              is_hot={Number(this.state.currentCityId) ===235 && (Number(item.model_id) === 11 || Number(item.model_id)===27)}
              isShowBtn={this.state.modelList.length}
              num={item.left_num}
            />
          ))}
        </div>
      </div>
      <div className="toEditRental " onClick={this.toExplain.bind(this)}></div>
    </div>
  }
}

 
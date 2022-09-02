import {RentalActions} from "../../js/RentalStore";

/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: realName
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/9-下午6:51
 Description:
 Param:
 Return:
 *************************************************/
require('./realName.less')
import React from 'react'
import Reflux from 'reflux'
import myAjax from '../../component/myAjax/withJq'
import getApiUrl from '../../../../../js/getApiUrl'
import {Alert, Toast, Confirm} from "../../component/LikeAlert/index";
import ToLongRentalExplain from '../../component/ToLongRentalExplain'
import {appMutual} from '../../../../../../other_modules/app-mutual'
import Time from '../../../../../js/function/Time'

export default class RealName extends React.Component{
  constructor () {
    super()
    this.state = {
      address: [],
      phone_no: '',
      work_time: ''
    }
  }

  componentDidMount () {
    appMutual.send.updateTitle('待线下认证')
    this.getTime()
  }

  getTime () {
    let that = this
    let user = Reflux.GlobalState.common
    let rental = Reflux.GlobalState.rental
    myAjax.post(getApiUrl('long-rental/name-auth'), {
      uuid: user.uuid,
      sign: user.sign,
      city_id: rental.rental_city_id || 0,
      activity_id: 1
    }, function (res) {
      if (res.status === 0) {
        that.setState(res.data)
      }
    })
  }

  cancelRental () {
    this.getTime()
    if (!this.state.server_time || !this.state.fetch_car_time) return;
    let moreThan3 = (this.state.fetch_car_time - this.state.server_time) / 86400 >= 3
    let msg = '<div class="cancelOrder"><span>确认取消订单吗？</span><br/>当前取消订单将收取您<span class="hint">10%</span>长租租金</div>'
    if (moreThan3) {
      msg = '<div class="cancelOrder"><span>确认取消订单吗？</span><br/>当前取消订单可退还您全部押金与租金</div>'
    }
    new Confirm({
      msg: msg,
      confirmButtonCallback: function () {
        RentalActions.cancel()
      }
    })
  }

  showActionSheet (data) {
    let user = Reflux.GlobalState.common
    appMutual.send.callNavigation({
      lng_start: user.user_lng,
      lat_start: user.user_lat,
      lng_des: data.lng,
      lat_des: data.lat,
      policy: 0,
      destination: data.name
    })
  }

  render () {
    let addBox = <div className="loading">正在加载办理地点...</div>
    if (this.state.address.length > 0) {

      let tips = "请至少提前一天进行线下认证"
      // let now = Math.floor(new Date().getTime()/1000)
      // let that_day = 1545580800
      // if(now < that_day)tips = '下周一（12月24日）开始认证'
      addBox = (<div>
        <div className="add-list">
          {this.state.address.map((item, index) => (
            <div className="add-item" key={index} onClick={this.showActionSheet.bind(this, item)}>
              <div className="add-item-in">{item.name}</div>
            </div>
          ))}
        </div>

        <div className="adds"><span>工作时间：</span>{this.state.work_time}</div>
        <div className="adds"><span>联系电话：</span>{this.state.phone_no}</div>
        <div className="adds colorRed"><span>温馨提示：</span>{tips}</div>
      </div>)
    }
    let title = this.state.model_name
    if(/捷达16/.test(this.state.model_name)){
        
        title = this.state.model_name.replace(/16款/,'质惠版')
    }
    if(/捷达17/.test(this.state.model_name)){

        title = this.state.model_name.replace(/17款/,'时尚版')
    }
    let time = (this.state.fetch_car_time && this.state.rental_end_time)? new Time(this.state.fetch_car_time).getTime('YYYY 年 M 月 D 日')+' - '+ new Time(this.state.rental_end_time-1).getTime('YYYY 年 M 月 D 日'):''
    let rentalInfo =this.state.model_name? <div className="realNameBox3">
        <p className="rental"><b>订单信息</b></p>
        <div className="rentalInfo"><span>取还时间：</span>{time}</div>
        <div className="rentalInfo lastInfo"><span>租赁车型：</span>{title}</div>
      </div>  : ''
    return (
        <div className="RealName">
          <div className="realNameBox1">
            <p className="p1"><b>请您携带以下证件：</b></p>
            <img className="idCard" src={require('../../images/realname2.png')}/>
            <p className="orange fs12">需本人前往，进行线下认证。谢绝非本人！</p>
          </div>
          <div className="realNameBox2">
            <p className="address"><b>请您前往以下地点办理线下认证</b></p>
            {addBox}
          </div>
          {/* <p className="hint">未办理线下认证将无法取车<br/>请至少提前一天进行线下认证</p> */}
         {rentalInfo}
          <a className='btn_short yellow fs16' onClick={this.cancelRental.bind(this)}>取消订单</a>
          <ToLongRentalExplain/>
        </div>
      )
    }
  }


 

require('./renew.less')
import React from 'react'
import Reflux from 'reflux'
import {appMutual} from '../../../../../../other_modules/app-mutual'
import tool from '../../js/tool'
import {RentalStore,RentalActions} from '../../js/RentalStore'
import {CarActions} from '../../js/CarStore'
import {IndexActions, IndexStore} from "../../js/IndexStore";
import createHistory from 'history/createHashHistory'
import { IsAndriod } from "../../../../../js/UserAgent.js";
import { Toast ,Confirm} from '../../component/LikeAlert';
const EventEmitter = require('events').EventEmitter;
const emitter = new EventEmitter();
const history = createHistory()


class ChooseTime extends Reflux.Component {
    constructor (props) {
        super(props);
    }
    render () {
        let duration = Math.round((this.props.endTime - this.props.startTime) / 86400)
        return <div className="ChooseTime">
            <div><span>取 </span>{tool.getMonthDay(this.props.startTime)}</div>
            <div className="duration">
            <span className="day">{duration}天</span>
            </div>
            <div><span>还 </span>{tool.getMonthDay(this.props.endTime - 86400)}</div>
        </div>
    }
  }

  class DayBox extends Reflux.Component {
    constructor (props) {
      super(props)
      // 春假放假
        let chunjie = [1549209600, 1549814400] 
        this.state = {
            limitTime :props.serverTime>props.startTime?props.data.time<tool.getToday(props.serverTime) &&props.startTime<=props.data.time:false,
            choose: props.data.time>=props.select.start && props.data.time<props.select.end,
            holiday: props.data.time >= chunjie[0] && props.data.time < chunjie[1],
            during_need: (props.data.time<props.startTime ||props.data.time>1550505600)  // 不可选时间  小于 2.11  大于 2.19
        }      
          
    }
    getDay (timeStamp) {
      return new Date(timeStamp * 1000).getDate()
    }
    dayClick () {
        if (this.state.during_need||this.state.limitTime ) { //
            if(this.state.limitTime) new Toast('延期还车天数必选')
            return
        } else {
            emitter.emit('setEndTime', this.props.data.time + 86400);
        }
    }
    
    render () {                              
        let is_get = this.props.data.time === this.props.select.start  
        let is_end = this.props.data.time === (this.props.endTime - 86400)
    
        let box_class = this.state.holiday ? 'date-box holiday' : 'date-box'
        if (this.props.data.is_selected) box_class += ' chooseData'
        if (this.state.choose) box_class += ' selected'
        if (is_get) box_class += ' get'
        if (is_end) box_class += ' end'
        let holiday_box = this.state.holiday ? <div className="holiday-box active"/> : <div className="holiday-box"/>
    
        let offset = {}
        if(this.props.index === 0){
            let step =window.innerWidth*0.142857
            offset.marginLeft = new Date(this.props.data.time*1000).getDay()*step + 'px'
        }
                
        return <div className={box_class} style={offset} onClick={this.dayClick.bind(this)}>
            <div className={'day'+ (this.state.during_need ||this.state.limitTime ? ' dataGray':'')}>
            {is_get ? <span className="float-flag get">取</span> : null}
            {this.getDay(this.props.data.time)}
            {is_end ? <span className="float-flag end">还</span> : null}
            </div>
            {holiday_box}
            {(this.props.data.time>1550505600 ||this.props.data.time<this.props.select.start )?'':<div className={'price'+ (this.state.during_need||this.state.limitTime ? ' dataGray':'')}>¥{this.props.data.price}</div>}
        </div>
    }
  
  }


  class DatePicker extends Reflux.Component {
    constructor (props) {
      super(props)      
      let start_available_time = tool.getAllDate(this.props.startTime) 
      let end_available_time = 1550851200   // 1.23   
    //   console.log(start_available_time);
      
      let days_data = []
      for (let time = start_available_time; time <= end_available_time; time += 86400) {
        days_data.push({
          time: time
        })
      }
      this.state = {
        startTime: props.endTime,   
        endTime: props.endTime +86400,
        total_day: 1,   // 租用天数
        days_data: days_data    // 日期
      }

      this.stores = [IndexStore,RentalStore]
      this.storeKeys = [
        'rig_startTime',
        'rig_endTime',
        'bef_price',
        'rig_price',
        'aft_price',
        'price_insurance',
        'insurance_service',
        'price_service',
        'server_time',
        'model_name',
        'currentCityId',
        'isShowAlet',
        'chooseTime'
      ]
      
    }
    componentDidMount () {          
        this.endEvent = this.setEndTime.bind(this)
        emitter.on('setEndTime', this.endEvent);//注册事件
        IndexActions.getCost()      
        if((this.state.server_time - this.state.startTime) > 0){
            let endTime = tool.getToday(this.state.server_time) + 86400            
            emitter.emit('setEndTime',endTime);  
        }        
        if(/捷达/.test(this.state.model_name)&&this.state.currentCityId===197 &&this.state.isShowAlet){
            new Confirm({
                msg: '您所选长租车型为非粤A车牌，续租时请注意限行日期',
                Abutton:true
            })
        }  
        console.log(this.state.chooseTime);
        
        if(this.state.chooseTime){            
            this.setState({
                endTime: this.state.chooseTime,
                total_day: Math.round((this.state.chooseTime - this.state.startTime) / 86400),
            })
        }     
    }
  
    componentWillUnmount () {
      emitter.removeListener('setEndTime', this.endEvent);//取消事件
    }
  
    setEndTime (time) {
        RentalActions.changeState({chooseTime:time})
        this.setState({
            endTime: time,
            total_day: Math.round((time - this.state.startTime) / 86400),
        })
    }
    goExplains (value) {
        RentalActions.changeState({isShowAlet:false})
        history.push('/explains/fee'+"?type=" + value)
    }
    toggleInsurance () {
        IndexActions.toggleInsuranceService()
    }
    toPay(money){
        CarActions.toPay({
            begin_time:this.state.startTime,
            end_time:this.state.endTime,
            insurance_service:this.state.insurance_service,
            client_total_money:money
        })        
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
            endTime={this.state.endTime} select={{start:tool.getToday(this.props.startTime),end:this.props.endTime}} 
            serverTime={this.state.server_time}/>)
                                                                                        
        let total = 0
            days.forEach(item => {
                    if (item.is_selected) total += item.price
            })
        let price ={
                price_insurance:this.state.price_insurance?this.state.price_insurance*this.state.total_day:'-',
                price_service:this.state.price_service?this.state.price_service*this.state.total_day:'-',
                totalMoney:this.state.price_insurance&&this.state.price_service&&total?total+(this.state.price_insurance+this.state.price_service)*this.state.total_day:'-',
            }
            if(!this.state.insurance_service){
                price.totalMoney = total+this.state.price_service*this.state.total_day
            }
        return (
          
        <div className="longRental-date-picker">
          <div className="header">
            <ChooseTime
                startTime={this.state.startTime}
                endTime={this.state.endTime}
            />
          </div>
  
          <div className="calendar-box">
            <div className="month">2019/1 - 2019-3</div>
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
                    <span className="holiday"/>
                    春节假期
                </div>
                <div>
                    <span className="selected"/>
                    已选
                </div>
                <div>
                    <span className="selected renewData"/>
                    续租
                </div>
            </div>
          </div>
            <div className="getprice">
                <div>不计免赔<span className={"goExplains " + (IsAndriod()? 'androidbg2':'')}
                                onClick={this.goExplains.bind(this, 'insurance')}> ({this.state.price_insurance}元/天)</span>

                    <span onClick={this.toggleInsurance.bind(this)} className={'insurance-switch float-right' + (this.state.insurance_service?' active':'')}>{price.price_insurance}元</span>
                </div>
                <div>车辆租金<span className="float-right">{total}元</span></div>
                <div>保障服务费<span className={"goExplains " + (IsAndriod()? 'androidbg2':'')}
                                onClick={this.goExplains.bind(this, 'feeInsurance')}></span><span className="float-right">{price.price_service}元</span></div>
            </div>
          <div className="cal-tips2">不需额外缴纳押金，续租成功后可延长还车时间</div>
  
          <div className="btn-con">
            <div className="total">
                总计：
                <span className="day">{price.totalMoney}</span>
                <span className="day-text">元</span>
                (续租{this.state.total_day}天)
                </div>
                <div className="btn" onClick={this.toPay.bind(this,price.totalMoney)}>确定</div>
            </div>
        </div>
      )
    }
}



export default class Renew extends Reflux.Component {
    constructor() {
        super()
        this.store = RentalStore
        this.storeKeys = [
            'fetch_car_time',
            'return_car_time'
        ]
    }

    componentDidMount() {
        appMutual.send.updateTitle('选择续租时间')        
        window.toRenew = () => {
            RentalActions.changeState({isShowAlet:false})
            history.push('/explains/renew')
        }
        appMutual.send.updateHeaderRight("续租规则", "toRenew")
        IndexActions.initEditRental()   // 日期价格
    }
    render() {        
        return <div className="Renew">
            <DatePicker startTime={this.state.fetch_car_time} endTime={this.state.return_car_time}/>
        </div>
    }
}


 
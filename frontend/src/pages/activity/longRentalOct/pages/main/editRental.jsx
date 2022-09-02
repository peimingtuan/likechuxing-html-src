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
import {IndexActions, IndexStore} from "../../js/IndexStore";
import format from '../../../../../js/function/format'
import AppMutual from '../../../../../component/AppMutual'
import ToLongRentalExplain from '../../component/ToLongRentalExplain'
const appMutual = new AppMutual()
import createHistory from 'history/createHashHistory'
const history = createHistory()
import {Toast} from "../../component/LikeAlert/index";
import myAjax from '../../component/myAjax/withJq'
import getApiUrl from '../../../../../js/getApiUrl'


import {Select} from "../../component/Select2/index";
import tool from '../../js/tool'

class TimeSelect extends Reflux.Component {
    constructor() {
        super()
        this.store = IndexStore
        this.storeKeys = ['duration', 'startTime', 'endTime',"isShowTime","serverTime","timeHour"]
    }
    selectDate(){
        if(!this.state.serverTime) return;
        myAjax.post(getApiUrl('/time/get'), {
        }, function (res) { 
            let serverTime = JSON.parse(res).data.timestamp
            console.log(serverTime)
            if(1546185600 - serverTime <=0){
                new Toast('因为春节影响，暂时无法订车');
                return
            }
            new Select({
                name: '',
                options:tool.initDatePickerData(tool.timestampToTime2(serverTime)).map((item,index)=>{
                    return {
                        id:item.id,
                        name:item.name,
                    }
                }),
                options2:tool.getHour().map((item,index)=>{
                    // console.log(item);
                    return {
                        id:item.id,
                        name:item.name,
                    }
                }),
                initIndex:0,
                callback:function(data,time){
                    // console.log(data,time);
                    
                    let start = data.id+" " + time.name + ":00"
                    let end = tool.getEndTime(data.id) + " "+time.name + ":00"
                    // console.log(tool.timeToTimestamp(start),tool.timeToTimestamp(end));                  
                    IndexActions.changeState({
                        startTime: tool.timeToTimestamp(start),
                        endTime: tool.timeToTimestamp(end),
                        timeHour:time.name 
                    })                
                    IndexActions.changeState({isShowTime:1})
                }
            }) 
        })                 
    }

    render() {                
        return (
            <div className="date-select_wrap">
                <div onClick={this.selectDate.bind(this)}>
                    <span className={"timeSpan "+(this.state.isShowTime?"color":"")}>{this.state.isShowTime?tool.timestampToTime(this.state.startTime,this.state.timeHour).des:"请选择取车时间"}</span> 
                </div>
                <div className="line"><span></span></div>
                <div> 
                    <span className={"timeSpan "+(this.state.isShowTime?"color":"")}>{this.state.isShowTime?tool.timestampToTime(this.state.endTime,this.state.timeHour).des:"请选择还车时间"}</span> 
                </div>
            </div>
        )
    }
}

export default class EditRental extends Reflux.Component {
    constructor() {
        super()
        this.state = {
            show_tips: true
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
            'currentCityId',
            'discount',
            'rent_insurance',
            'coupon',
            "discount"
        ]
    }

    componentDidMount() {
        appMutual.sendUpdateTitle('日期及网点选择')
        IndexActions.initEditRental()
        IndexActions.getCost()
    }

    chooseBranch(type) {
        history.push({
            pathname:'/chooseBranch/index',
            search:'?type='+type+'&from=edit'
        })
    }

    toPay() {
        if (this.getFinishBoolean.call(this)) {
            IndexActions.createRental()
        }
    }

    hideTips() {
        this.setState({
            show_tips: false
        })
    }
    IsAndriod () {
        let ua = navigator.userAgent.toLowerCase()
        return ua.indexOf('android') > -1 || ua.indexOf('adr') > -1
    }

    getPointComponent() {
        let point = [
            <div className="point_name red">请选择取车网点</div>,
            <div className="point_name red">请选择还车网点</div>
        ]
        if (this.state.startPoint) {
            point[0] = <div className="point_name dark">{this.state.startPoint.branch_name}</div>
        }
        if (this.state.endPoint) {
            point[1] = <div className="point_name dark">{this.state.endPoint.branch_name}</div>
        }
        return point
    }

    getCostComponent() {
        // console.log(this.state);
        
        let fee = {
            actual: '-',
            rent: '-',
            deposit: '-',
            save:"-",
            insurance:"-",
            coupon:"-"
        }
        
        if (this.state.actual_fee > 0) {
            fee = {
                actual: format.money(this.state.actual_fee) - format.money(this.state.coupon.free_money),
                rent: format.money(this.state.rent_fee),
                deposit: format.money(this.state.deposit),
                save: format.money(this.state.save_fee),
                insurance: format.money(this.state.rent_insurance),
                coupon:-format.money(this.state.coupon.free_money)
            }
        }
        
        return fee
    }

    getFinishBoolean() {
        let state = this.state
        return state.startTime && state.endTime && state.startPoint && state.endPoint && state.actual_fee
    }

    render() {        
        let car = this.state.modelList.find(item => item.model_id === this.state.currentModelId && item.discount === this.state.discount)
        // console.log(car);
        
        let point = this.getPointComponent.call(this)
        let fee = this.getCostComponent.call(this)                
        let finish = this.getFinishBoolean.call(this)   
        // console.log(this.state.coupon,"coupon");
             
        let insuranceDom = this.state.discount === 0 ?  <div className="item fs13">保障服务费：{fee.insurance} 元</div> : ""
        let couponDom = this.state.coupon.free_money && this.state.discount === 0 ?  <div className="item fs13">月租优惠：{fee.coupon} 元<span className="icon_discount" /></div> : ""
        // console.log(this.state.currentCityId);
        
        // console.log(Number(this.state.currentCityId) === 197 ||Number(this.state.currentCityId) === 202||Number(this.state.currentCityId) === 214 ||Number(this.state.currentCityId) === 213)
        return <div className="EditRental">           
                <div className="editContent">
                    <div className="carInfo">
                        <div className="desc">
                            <div className="name">{car.model_name}</div>
                            <div className="price"><span className="fs18 money">{car.car_price}</span>元/月
                            </div>
                        </div>
                        <img className="img" src={car.car_img}/>
                        <p>{ Number(this.state.currentCityId) === 197 ||Number(this.state.currentCityId) === 202||Number(this.state.currentCityId) === 214 ||Number(this.state.currentCityId) === 213? "所有车辆均为非粤A车牌" : ""}</p>
                    </div>
                    <div className="ChooseTime">
                        <p>请选择月租日期</p>
                        <div>租赁时长<span className="day">30天</span></div>
                        <TimeSelect/>
                    </div>
                    <div className="ChooseAddress">
                        <p>请选择月租网点</p>
                        <div className="branch_select">
                            <div className="start_point point fs14" onClick={() => this.chooseBranch.call(this, 0)}>
                                <div className="label">取车网点：</div>
                                {point[0]}
                            </div>
                            <div className="end_point point fs14" onClick={() => this.chooseBranch.call(this, 1)}>
                                <div className="label">还车网点：</div>
                                {point[1]}
                            </div>
                        </div>
                    </div>
                    <div className="getprice">
                        <p>收费标准</p>
                        <div className="cost">
                            <div className="total fs14 fb">
                                <span>需支付金额：{fee.actual} 元</span>
                                <span className="qa" onClick={() => {
                                    history.push('/explains')
                                }}/>
                            </div>
                            <div className="item fs13">月租费用：{fee.rent} 元</div>
                            {insuranceDom}
                            <div className={"item fs13 depositIcon " + (this.IsAndriod()?"andTop":"")}>保证金费用：{fee.deposit} 元</div>
                            {couponDom}
                        </div>
                    </div>
                    <div className="toPay ">
                        <a className={"btn_long fs16 " + (finish ? '' : 'disabled')} onClick={this.toPay.bind(this)}>支付月租费用</a>
                    </div>
                    <ToLongRentalExplain />
                </div>
        </div>
    }
}


 
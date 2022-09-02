/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: chooseCar
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/12-下午2:22
 Description:
 Param:
 Return:
 *************************************************/
require('./chooseCar.less')
import React from 'react'
import Reflux from 'reflux'
import {RentalStore, RentalActions} from '../../js/RentalStore'
import {CarActions} from "../../js/CarStore";
import MainBox from '../../component/MainBox'
import ContentBox from '../../component/ContentBox'
import Time from '../../../../../js/function/Time'
import createHistory from 'history/createHashHistory'
const history = createHistory()
import $ from 'jquery'
import ToLongRentalExplain from '../../component/ToLongRentalExplain'
import AutoHeight from '../../js/AutoHeight'
const setCss = new AutoHeight()
import {Alert, Toast, Confirm} from "../../component/LikeAlert/index";
import AppMutual from '../../../../../component/AppMutual'
const appMutual = new AppMutual()

class ChooseCarBox extends React.Component{
    constructor(){
        super()
    }

    pickCar(){
        CarActions.changeState({
            car_id:this.props.data.car_id
        })
        history.push('/rental/carDetail')
    }

    render(){
        return (
            <div className="ChooseCarBox" onClick={this.pickCar.bind(this)}>
                <img src={this.props.img} />
                <div className="car_info">
                    <p className="fs15">{this.props.data.plate_no || '京Q12345'}</p>
                    <p className="fs13">楼层：{this.props.data.current_parking_floor}</p>
                    <p className="fs13">车位：{this.props.data.current_parking_no}</p>
                </div>
            </div>
        )
    }
}

class Prepare extends Reflux.Component {
    constructor() {
        super()
        this.marginTop = 0
        this.store = RentalStore
    }

    jumpToView(){
        window.location.href = this.state.walk_overall_view
        /*
        history.push({
            pathname:'/main/iframe',
            search:'?url='+encodeURIComponent(this.state.walk_overall_view)
        })
        */
    }

    componentDidUpdate(){
        setCss.auto('.btn_short')
    }

    render() {
        let pan = this.state.walk_overall_view ? <span onClick={this.jumpToView.bind(this)} className="icon pan"/> : ''
        return (
            <div className="Prepare">
                <ContentBox title="取车时间" className="no_paddingTop">
                    <p style={{
                        paddingTop:'0.1rem'
                    }}>{new Time(this.state.fetch_car_time).getTime('YYYY 年 M 月 D 日')}</p>
                </ContentBox>
                <ContentBox title="取车地点">
                    <p className="branchName fs14">{this.state.begin_branch_name}{pan}</p>
                    <p className="fs13">{this.state.branch_walk_addr}</p>
                    <p className="fs13">{this.state.branch_walk_remark}</p>
                </ContentBox>
            </div>
        )
    }
}

class Choose extends Reflux.Component {
    constructor() {
        super()
        this.store = RentalStore
    }

    componentDidUpdate(){
        if(this.state.car_list.length === 0){
            appMutual.sendUpdateTitle('待系统准备车辆')
        }else{
            appMutual.sendUpdateTitle('待取车')
        }
        setCss.auto('.btn_short')
    }

    render() {
        if (this.state.car_list.length === 0) {
            return (
                <div className="Choose">
                    <p className="tips fs12">您预定的车型：{this.state.model_name}</p>
                    <p className="red fs16">车辆正在准备中...</p>
                </div>
            )
        }else{
            let list = <div className="carList">
                    {this.state.car_list.map(item=>(
                        <ChooseCarBox key={item.car_id} data={item} img={this.state.model_img}/>
                    ))}
                </div>

            return (
                <div className="Choose">
                    <ContentBox title={"您预订的车型 " + this.state.model_name} className="no_border">
                        {list}
                    </ContentBox>
                </div>
            )
        }
    }
}

export default class ChooseCar extends Reflux.Component {
    constructor() {
        super()
        this.store = RentalStore
        this.storeKeys = [
            'fetch_car_time',
            'server_time',
            'has_change_car'
        ]
    }

    componentDidMount() {
        RentalActions.initChooseCar()
    }

    cancel(){
        if(this.state.has_change_car){
            return
        }

        let moreThan3 = (this.state.fetch_car_time - this.state.server_time )/86400  >= 3
        let msg = '当前距离取车时间小于3天，可退还90%的长租费用，保证金可正常退还'
        if(moreThan3){
            msg = '确认取消？<br/>长租费用及保证金将按原路退还'
        }
        new Confirm({
            msg:msg,
            confirmButtonCallback:function(){
                RentalActions.cancel()
            }
        })
    }

    render() {
        return <div className="ChooseCar">
            <MainBox>
                <div className="chooseCar">
                    <Prepare/>
                    <Choose/>
                    <a className={"btn_short yellow " + (this.state.has_change_car ? 'hidden' :'')} onClick={this.cancel.bind(this)}>取消订单</a>
                </div>
            </MainBox>
            <ToLongRentalExplain />
        </div>
    }
}





 
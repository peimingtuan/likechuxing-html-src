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
import Time from '../../../../../js/function/Time'
import createHistory from 'history/createHashHistory'
const history = createHistory()
import ToLongRentalExplain from '../../component/ToLongRentalExplain'
import {Alert, Toast, Confirm} from "../../component/LikeAlert/index";
import {appMutual} from '../../../../../../other_modules/app-mutual'


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
        // setCss.auto('.btn_short')
    }
    showActionSheet(){
        console.log(this)

        let user = Reflux.GlobalState.common
        appMutual.send.callNavigation({
            lng_start:user.user_lng,
            lat_start:user.user_lat,
            lng_des:this.state.drive_lng,
            lat_des:this.state.drive_lat,
            policy:0,
            destination:this.state.begin_branch_name,
            overall_view:this.state.walk_overall_view
        })
    }
    render() {
        // let pan = this.state.walk_overall_view ? <span onClick={this.jumpToView.bind(this)} className="icon pan"/> : ''
        let time = (this.state.fetch_car_time && this.state.return_car_time)?<p style={{
            paddingTop:'0.1rem'
            }}>{new Time(this.state.fetch_car_time).getTime('YYYY 年 M 月 D 日')+' - '+ new Time(this.state.return_car_time-1).getTime('YYYY 年 M 月 D 日')}</p>:""        
            return (
            <div className="Prepare">
                <div className="chooseCarBox1">
                    <p>取还车日期</p>
                    {time}
                </div>
                <div className="chooseCarBox1">
                    <p>取车地点</p>
                    <p className="branchName fs14" onClick={this.showActionSheet.bind(this)}>
                        <span>{this.state.begin_branch_name}</span>
                        <i className="icon-location"></i>
                    </p>
                    <p className="branchNameF">{this.state.branch_walk_addr}</p>
                    {/* <p className="branchNameF">{this.state.branch_walk_remark}</p> */}
                </div>
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
            appMutual.send.updateTitle('待系统准备车辆')
        }else{
            appMutual.send.updateTitle('待取车')
        }
        // setCss.auto('.btn_short')
    }

    render() {
        let title = this.state.model_name
        if(/捷达16/.test(this.state.model_name)){
            
            title = this.state.model_name.replace(/16款/,'质惠版')
        }
        if(/捷达17/.test(this.state.model_name)){

            title = this.state.model_name.replace(/17款/,'时尚版')
        }
        if (this.state.car_list.length === 0) {
            return (
                <div className="Choose paddingStyle1">
                    <p className="tips fs12">您预定的车型：{title}</p>
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
                <div className="Choose paddingStyle2">
                    <div className="no_border">
                    <p>您预定的车型：{title}</p>
                        {list}
                    </div>
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
            'has_change_car',
            'isShow',
            'return_car_time'
        ]
    }

    componentDidMount() {
        RentalActions.initChooseCar()
    }

    cancel(){
        if(this.state.has_change_car){
            return
        }
        if(!this.state.server_time || !this.state.fetch_car_time) return;
        let moreThan3 = (this.state.fetch_car_time - this.state.server_time )/86400 >= 3
        let msg = '<div class="cancelOrder"><span>确认取消订单吗？</span><br/>当前取消订单将收取您<span class="hint">10%</span>长租租金</div>'
        if(moreThan3){
            msg = '<div class="cancelOrder"><span>确认取消订单吗？</span><br/>当前取消订单可退还您全部押金与租金</div>'
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
            <div className="chooseCar">
                <Prepare/>
                <Choose/>
                <div className="chooseCarBtn">
                    <button className={"btn_short_chooseCar " + (this.state.has_change_car ? 'hidden' :'')} onClick={this.cancel.bind(this)}>取消订单</button>
                </div>
            </div>
            <ToLongRentalExplain />
        </div>
    }
}





 
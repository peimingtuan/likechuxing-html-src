/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: CarDetail
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/17-上午11:41
 Description:
 Param:
 Return:
 *************************************************/
require('./carDetail.less')
import React from 'react'
import Reflux from 'reflux'
import {RentalStore} from '../../js/RentalStore'
import {CarActions, CarStore} from "../../js/CarStore";
import createHistory from 'history/createHashHistory'
const history = createHistory()
import ToLongRentalExplain from '../../component/ToLongRentalExplain'
import {appMutual} from '../../../../../../other_modules/app-mutual'

export default class CarDetail extends Reflux.Component {
    constructor() {
        super()
        this.stores = [RentalStore, CarStore]
    }

    componentDidMount() {
        CarActions.initCarDetails()
        
    }

    componentDidUpdate() {
        appMutual.send.updateTitle(this.state.car_plate_no)
    }

    openDoor(){
        history.replace({
            pathname:'/carDamage/chooseDamage',
            search:'?type=pre'
        })
    }

    carLocation(){
        history.push('/car/location')
    }
    showActionSheet(){
        
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

    jumpToPanorama(){
        window.location.href = this.state.car_panorama
        /*
        history.push({
            pathname:'/main/iframe',
            search:'?url='+encodeURIComponent(this.state.car_panorama)
        })
        */
    }

    jumpToView(){
        window.location.href = this.state.walk_overall_view
    }

    render() {
        let car_guide = this.state.car_panorama ?  <button onClick={this.jumpToPanorama.bind(this)} className="car_guide">使用指南</button> : ''
        // let pan = this.state.walk_overall_view ? <span onClick={this.jumpToView.bind(this)} className="icon pan"/> : ''
        // console.log(1,this.state.car_panorama,1);
        let title = <div className="price fs14">{this.state.car_model_name}</div>
        if(/捷达16/.test(this.state.car_model_name)){            
            title = <div className="title">{this.state.car_model_name.replace(/16款/,'质惠版')}</div>
        }
        if(/捷达17/.test(this.state.car_model_name)){

            title = <div className="title">{this.state.car_model_name.replace(/17款/,'时尚版')}</div>
        }
        return <div className="CarDetail">
                <div className="carDetail">
                    <div className="car_info">
                        <div className="desc">
                            <div className="name fs20">{this.state.car_plate_no}{car_guide}</div>
                            {title}
                        </div>
                        <img className="img" src={this.state.car_img}/>
                    </div>
                    <div className="branchBox">
                        <p>停车场位置</p>
                        <p className="branchName fs14" onClick={this.showActionSheet.bind(this)}>
                            <span>{this.state.begin_branch_name}</span>
                            <i className="icon-location"></i>
                        </p>
                        <p className="fs12">楼层：{this.state.car_parking_floor}</p>
                        <p className="fs12">车位：{this.state.car_parking_no}</p>
                    </div>
                    <div className="openBox">
                        <a className="btn_long fs16" onClick={this.openDoor.bind(this)}>开车门</a>
                        <div className='link fs13' onClick={this.carLocation.bind(this)}>查看车辆定位</div>
                    </div>
                </div>
            <ToLongRentalExplain/>
        </div>
    }
}


 
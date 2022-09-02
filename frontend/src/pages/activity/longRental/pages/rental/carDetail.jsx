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
import MainBox from '../../component/MainBox'
import ContentBox from '../../component/ContentBox'
import $ from 'jquery'
import createHistory from 'history/createHashHistory'
const history = createHistory()
import ToLongRentalExplain from '../../component/ToLongRentalExplain'
import AppMutual from '../../../../../component/AppMutual'
const appMutual = new AppMutual()

export default class CarDetail extends Reflux.Component {
    constructor() {
        super()
        this.stores = [RentalStore, CarStore]
    }

    componentDidMount() {
        CarActions.initCarDetails()
    }

    componentDidUpdate() {
        appMutual.sendUpdateTitle(this.state.car_plate_no)
        let window_height = window.innerHeight
        let height = $('body').height()
        if(height < window_height){
            $('.btn_long').css('margin-top',window_height - height)
        }
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
        /*
        history.push({
            pathname:'/main/iframe',
            search:'?url='+encodeURIComponent(this.state.walk_overall_view)
        })
        */
    }

    render() {
        let car_guide = this.state.car_panorama ? <span onClick={this.jumpToPanorama.bind(this)} className="icon car_guide"/> : ''
        let pan = this.state.walk_overall_view ? <span onClick={this.jumpToView.bind(this)} className="icon pan"/> : ''
        return <div className="CarDetail">
            <MainBox>
                <div className="carDetail">
                    <ContentBox className="car_info no_paddingTop no_border">
                        <div className="desc">
                            <div className="name fs20">{this.state.car_plate_no}{car_guide}</div>
                            <div className="price fs14">{this.state.car_model_name}</div>
                        </div>
                        <img className="img" src={this.state.car_img}/>
                    </ContentBox>
                    <ContentBox title="停车场位置" className="branch no_border">
                        <p className="branchName fs14">{this.state.begin_branch_name}{pan}</p>
                        <p className="fs12">楼层：{this.state.car_parking_floor}</p>
                        <p className="fs12">车位：{this.state.car_parking_no}</p>
                        <a className="btn_long fs16" onClick={this.openDoor.bind(this)}>开车门</a>
                        <div className='link fs13' onClick={this.carLocation.bind(this)}>查看车辆定位</div>
                    </ContentBox>
                </div>
            </MainBox>
            <ToLongRentalExplain/>
        </div>
    }
}


 
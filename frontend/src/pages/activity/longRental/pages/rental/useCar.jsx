/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: useCar
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/17-下午6:24
 Description:
 Param:
 Return:
 *************************************************/
import $ from "jquery";
require('./useCar.less')
import React from 'react'
import Reflux from 'reflux'
import MainBox from '../../component/MainBox'
import ContentBox from '../../component/ContentBox'
import {RentalStore, RentalActions} from '../../js/RentalStore'
import {CommonActions} from "../../js/CommonStore"
import {CarActions, CarStore} from "../../js/CarStore";
import createHistory from 'history/createHashHistory'
const history = createHistory()
import {Alert, Toast, Confirm} from "../../component/LikeAlert/index";
import ToLongRentalExplain from '../../component/ToLongRentalExplain'
import BMapLocation from '../../js/BMapLocation'
import AppMutual from '../../../../../component/AppMutual'
const appMutual = new AppMutual()

export default class useCar extends Reflux.Component {
    constructor() {
        super()
        this.autoMargin = true
        this.stores = [RentalStore, CarStore]
        this.storeKeys = [
            'car_plate_no',
            'car_model_name',
            'car_img',
            'end_branch_name',
            'car_panorama'
        ]
    }

    componentDidMount() {
        appMutual.sendUpdateTitle('新春大吉')
        CarActions.initCarDetails()
    }

    componentDidUpdate() {
        if(this.autoMargin){
            let window_height = window.innerHeight
            let height = $('body').height()
            if(height < window_height){
                $('.tips').css('margin-top',window_height - height)
            }
            this.autoMargin = false
        }
    }

    willFinishCar(){
        BMapLocation(function(){
            history.push('/rental/willFinish')
        })
    }

    openDoor(){
        CarActions.openDoor()
    }

    lockDoor(){
        CarActions.lockDoor()
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

    changeEndBranch(){
        history.push({
            pathname:'/chooseBranch/index',
            search:'?type=1&from=fetch'
        })
    }

    panToEndBranch(){
        history.push('/main/navigation')
    }

    damageOrder(){
        history.push({
            pathname:'/carDamage/review',
            search:'?type=pre'
        })
    }

    render() {
        let car_guide = this.state.car_panorama ? <span onClick={this.jumpToPanorama.bind(this)} className="icon car_guide"/> : ''
        return <div className="UseCar">
            <MainBox>
                <div className="useCar">
                    <ContentBox className="car_info no_paddingTop">
                        <div className="desc">
                            <div className="name fs20">{this.state.car_plate_no}{car_guide}</div>
                            <div className="price fs14">{this.state.car_model_name}</div>
                        </div>
                        <img className="img" src={this.state.car_img}/>
                    </ContentBox>
                    <ContentBox title="还车网点" className="branch">
                        <div className="branchName fs14">
                            {this.state.end_branch_name}
                            <span className="red change_end_point" onClick={this.changeEndBranch.bind(this)}>修改</span>
                        </div>
                    </ContentBox>
                    <div className="tips fs12">
                        <p>请检查是否有钥匙、行驶本、灭火器、</p>
                        <p>三脚架、拖车钩、保单复印件</p>
                    </div>
                    <div className="btn_con fs14">
                        <a className="btn_short big" onClick={this.openDoor.bind(this)}>开车门</a>
                        <a className="btn_square" onClick={this.willFinishCar.bind(this)}><p>我要<br/>还车</p></a>
                        <a className="btn_short big" onClick={this.lockDoor.bind(this)}>锁车门</a>
                    </div>
                    <div className="link_con fs13">
                        <div className="link" onClick={this.carLocation.bind(this)}>查看车辆定位</div>
                        <div className="link mid" onClick={this.damageOrder.bind(this)}>查看取车验车单</div>
                        <div className="link" onClick={this.panToEndBranch.bind(this)}>还车网点导航</div>
                    </div>
                </div>
            </MainBox>
            <ToLongRentalExplain/>
        </div>
    }
}


 
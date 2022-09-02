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
require('./useCar.less')
import React from 'react'
import Reflux from 'reflux'
import {RentalStore, RentalActions} from '../../js/RentalStore'
import {CarActions, CarStore} from "../../js/CarStore";
import createHistory from 'history/createHashHistory'
const history = createHistory()
import ToLongRentalExplain from '../../component/ToLongRentalExplain'
import BMapLocation from '../../js/BMapLocation'
import AppMutual from '../../../../../component/AppMutual'
import { appMutual as appNewMutual } from '../../../../../../other_modules/app-mutual'
const appMutual = new AppMutual()
import Time from '../../../../../js/function/Time'

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
            'car_panorama',
            "endTime",
            "forbid",
            "drive_lng",
            "drive_lat",
            "begin_branch_name",
            "walk_overall_view"
        ]
    }

    componentDidMount() {
        appMutual.sendUpdateTitle('全新月租上线')
        CarActions.initCarDetails()
        RentalActions.initChooseCar();
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

    showActionSheet(){        
        // console.log(this.state.drive_lat,this.state.drive_lng,this.state.end_branch_name,this.state.walk_overall_view);
        let user = Reflux.GlobalState.common
        appNewMutual.send.callNavigation({
            lng_start:user.user_lng,
            lat_start:user.user_lat,
            lng_des:this.state.drive_lng,
            lat_des:this.state.drive_lat,
            policy:0,
            destination:this.state.end_branch_name,
            overall_view:this.state.walk_overall_view
        })
    }

    render() {           
        let car_guide = this.state.car_panorama ? <button onClick={this.jumpToPanorama.bind(this)} className="car_guide">使用指南</button> : ''
        let time = this.state.endTime? new Time(this.state.endTime+1).getTime('YYYY 年 M 月 D 日 HH:00'):''
        return <div className="UseCar">
                <div className="useCar">
                    <div className="car_info">
                        <div className="desc">
                            <div className="name fs20">{this.state.car_plate_no}{car_guide}</div>
                            <div className="price fs14">{this.state.car_model_name}</div>
                        </div>
                        <img className="img" src={this.state.car_img}/>
                    </div>
                    <div className="branch">
                        <p>还车网点</p>
                        <div className="branchName fs14">
                            {this.state.end_branch_name}
                            <span className="red change_end_point" onClick={this.changeEndBranch.bind(this)}>修改</span>
                        </div>
                    </div>
                    <div className="branch">
                        <p>还车时间</p>
                        <div className="branchName fs14">
                            {time}
                        </div>
                    </div>
                    {this.state.forbid.length>0?<div className="branch">
                        <p>广州限行提示</p>
                        <div className="branchName fs14">
                            {this.state.forbid.map((item,index)=>(
                            <span className={"onLimit "+(item.limit!=0 ? "color":"")} key={index}>{item.day}</span>
                            ))}
                        </div>
                    </div>:""}
                    <div className="tips fs12">
                        <p>请检查是否有钥匙、行驶本、灭火器、</p>
                        <p>三脚架、拖车钩、保单复印件</p>
                    </div>
                    <div className="btn_con fs14">
                        <a className="btn_short big" onClick={this.openDoor.bind(this)}>开车门</a>
                        <a className="btn_short big" onClick={this.lockDoor.bind(this)}>锁车门</a>
                    </div>
                    <div className="btn_square_m">
                        <a onClick={this.willFinishCar.bind(this)}>我要还车</a>
                    </div>
                    <div className="link_con fs13">
                        <div className="link" onClick={this.carLocation.bind(this)}>查看车辆定位</div>
                        <div className="link mid" onClick={this.damageOrder.bind(this)}>查看取车验车单</div>
                        <div className="link" onClick={this.showActionSheet.bind(this)}>还车网点导航</div>
                        {/* onClick={this.panToEndBranch.bind(this) */}
                    </div>
                </div>
            <ToLongRentalExplain/>
        </div>
    }
}


 
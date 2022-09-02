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
import {IndexStore} from "../../js/IndexStore";
import createHistory from 'history/createHashHistory'
const history = createHistory()
import ToLongRentalExplain from '../../component/ToLongRentalExplain'
import BMapLocation from '../../js/BMapLocation'
import {appMutual} from '../../../../../../other_modules/app-mutual'
import Time from '../../../../../js/function/Time'

export default class useCar extends Reflux.Component {
    constructor() {
        super()
        this.autoMargin = true
        this.stores = [RentalStore, CarStore,IndexStore]
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
            "walk_overall_view",
            "staTime",
            'begin_time',
            'fetch_car_time',
            'server_time',
            'currentCityId',
            'isShowRenew'
        ]
    }

    componentDidMount() {
        appMutual.send.updateTitle('2019春节长租')
        CarActions.initCarDetails()
        RentalActions.initChooseCar();
        appMutual.send.updateHeaderRight("")
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
    toRenew(){                
        if(!this.state.fetch_car_time) return
        RentalActions.changeState({isShowAlet:true,chooseTime:0})
        history.push('/rental/renew')
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
        appMutual.send.callNavigation({
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
        let title = <div className="price fs14">{this.state.car_model_name}</div>
        if(/捷达16/.test(this.state.car_model_name)){            
            title = <div className="title">{this.state.car_model_name.replace(/16款/,'质惠版')}</div>
        }
        if(/捷达17/.test(this.state.car_model_name)){

            title = <div className="title">{this.state.car_model_name.replace(/17款/,'时尚版')}</div>
        }
        let time = (this.state.begin_time && this.state.endTime)? new Time(this.state.begin_time).getTime('YYYY 年 M 月 D 日')+' - '+new Time(this.state.endTime-1).getTime('YYYY 年 M 月 D 日'):''  
        return <div className="UseCar">
                <div className="useCar">
                    <div className="car_info">
                        <div className="desc">
                            <div className="name fs20">{this.state.car_plate_no}{car_guide}</div>
                            {title}
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
                        <p>取还车日期</p>
                        <div className="branchName fs14">
                            {time}
                            {this.state.isShowRenew?<span className="red change_end_point" onClick={this.toRenew.bind(this)}>续租</span>:''}
                        </div>
                    </div>
                    {/* {this.state.forbid.length>0?<div className="branch">
                        <p>广州限行提示</p>
                        <div className="branchName fs14">
                            {this.state.forbid.map((item,index)=>(
                            <span className={"onLimit "+(item.limit!=0 ? "color":"")} key={index}>{item.day}</span>
                            ))}
                        </div>
                    </div>:""} */}                    
                    {this.state.isShowRenew?<p className="tipRenew">若您需继续用车，请点击续租按钮延长用车时间。
                        {(this.state.currentCityId===197 &&/捷达/.test(this.state.car_model_name))?<p>非粤A车牌续租请注意限行状态</p>:''}</p>:''
                    }
                    <div className="tips fs12">
                        <p>请检查是否有钥匙、行驶本、灭火器、三脚架、拖车钩、保单复印件</p>
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


 
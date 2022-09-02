/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: finish
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/20-下午8:28
 Description:
 Param:
 Return:
 *************************************************/


require('./finish.less')
import React from 'react'
import Reflux from 'reflux'
import {RentalStore, RentalActions} from '../../js/RentalStore'
import {CarActions} from "../../js/CarStore";
import createHistory from 'history/createHashHistory'
const history = createHistory()
import ToLongRentalExplain from '../../component/ToLongRentalExplain'
import parseURL from '../../../../../js/parseURL'
import AppMutual from '../../../../../component/AppMutual'
const appMutual = new AppMutual()
import Time from '../../../../../js/function/Time'
import $ from "jquery";
import {appMutual as newAppMutual} from '../../../../../../other_modules/app-mutual'

class FinishBox extends React.Component {
    constructor(props){
        super()
        this.state = {
            type:props.type,
            title:props.title,
            msg:props.msg
        }
    }

    render() {
        return (
            <div className={"FinishBox " + this.state.type}>
                <img
                    src={this.state.type === 'success' ? require('../../images/icon_success.png') : require('../../images/icon_fail2.png')}
                    className="big_icon"/>
                <div className={"title fs24 "+(this.state.type === 'fail'?"failColor":"")}>{this.state.title}</div>
                <div className="msg fs13">{this.state.msg}</div>
            </div>
        )
    }
}

class FailBox extends Reflux.Component{
    constructor() {
        super()
        this.store = RentalStore
        this.storeKeys = [
            "peccancy",
            'self_pay'
        ]
    }
    // onClick={()=>CarActions.getPeccancy(item.id)}
    jumpPeccancy(){
        newAppMutual.jump.peccancy({
            destroy_current: 0
        })
    }
    selfService(){
        newAppMutual.jump.selfService({
            destroy_current: 0
        })
    }


    render(){
        let num_self
        if(this.state.peccancy.length > 0){
            num_self = "02"
        }else{
            num_self = "01"
        }
        let wz_title = this.state.peccancy.length > 0 ? '01 您有违章未处理!' :''
        let self_title = this.state.self_pay >0 ? num_self +' 您有自助缴费单未处理!' : ""
        return <div className="FailBox">
            <div className="box">
                <div className="failWrap">
                <div className="title fs13" onClick={this.jumpPeccancy.bind(this)}>{wz_title}<span>详情</span></div>
                    {this.state.peccancy.map(item=><div key={item.id}  className="wz_box fs14">
                        <p><span className="label">违章时间：</span>{new Time(item.happen_time).getTime('YYYY年MM月DD日  星期W hh:mm')}</p>
                        <p><span className="label">违章地点：</span>{item.happen_addr}</p>
                        <p><span className="label">违章行为：</span>{item.happen_behavior}</p>
                        <p><span className="label">处罚措施：</span>扣分 {item.score} 罚款 {item.fee}</p>
                    </div>)}
                </div>
            </div>
            {self_title ?<div className="selfBox"><div className="title fs13" onClick={this.selfService.bind(this)}>{self_title}<span>详情</span></div></div>  : ""}
        </div>
    }
}

export default class finish extends React.Component {
    constructor() {
        super()
        this.list = [
            {
                type:'success',
                title:'还车成功！',
                msg:'保证金，将于20个工作日后原路退还，请耐心等待'
            },
            {
                type:'success',
                title:'退款成功！',
                msg:'保证金已退，具体到账时间以银行为准'
            },
            {
                type:'fail',
                title:'退款失败！',
                msg:''
            },
        ]
    }

    componentDidMount() {
        let type = parseURL(this.props.location.search).query.type
        // 
        if(type===0){
            appMutual.sendUpdateTitle('还车成功')
        }
        if(type===1){
            appMutual.sendUpdateTitle('退款成功')
        }
        if(type===2){
            appMutual.sendUpdateTitle('退款失败')
        }
        let window_height = window.innerHeight
        let height = $('body').height()
        if(height < window_height){
            $('.Finish').css('padding-bottom',window_height - height + 10)
        }
        
    }

    componentDidUpdate(){
        let window_height = window.innerHeight
        let height = $('body').height()
        if(height < (window_height - 10)){
            $('.Finish').css('padding-bottom',window_height - height + 10)        
        }
    }

    damageOrderPre(){
        history.push({
            pathname:'/carDamage/review',
            search:'?type=pre'
        })
    }

    damageOrderAft(){
        history.push({
            pathname:'/carDamage/review',
            search:'?type=aft'
        })
    }

    refund(){
        RentalActions.refund()
    }

    

    render() {
        let type = parseURL(this.props.location.search).query.type
        let text = this.list[type]
        let failBox = type == 2 ? <FailBox /> : ''
        let btn = type == 2 ? <div className="btn_con"><a className={"fs16 btn_long "} onClick={this.refund.bind(this)}>申请退款</a></div> : <div className="link_con fs13">
            <div className="link mid" onClick={this.damageOrderPre.bind(this)}>查看取车验车单</div>
            <div className="link" onClick={this.damageOrderAft.bind(this)}>查看还车验车单</div>
        </div>
        return <div className={"Finish " +( text.type === "fail" ? "failPadding":"")}>
                <FinishBox
                    type={text.type}
                    title={text.title}
                    msg={text.msg}
                />
                
                {failBox}
                {btn}
            {text.type==="success"?<ToLongRentalExplain />:""}
        </div>
    }
}


 
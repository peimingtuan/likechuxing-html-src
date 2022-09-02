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
import MainBox from '../../component/MainBox'
import ContentBox from '../../component/ContentBox'
import {RentalStore, RentalActions} from '../../js/RentalStore'
import {CarActions} from "../../js/CarStore";
import createHistory from 'history/createHashHistory'
const history = createHistory()
import {Alert, Toast, Confirm} from "../../component/LikeAlert/index";
import ToLongRentalExplain from '../../component/ToLongRentalExplain'
import AutoHeight from '../../js/AutoHeight'
import parseURL from '../../../../../js/parseURL'
import AppMutual from '../../../../../component/AppMutual'
const appMutual = new AppMutual()
import Time from '../../../../../js/function/Time'

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
                    src={this.state.type === 'success' ? require('../../images/icon_success.png') : require('../../images/icon_fail.png')}
                    className="big_icon"/>
                <div className="title fs24">{this.state.title}</div>
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

    render(){
        let wz_title = this.state.peccancy.length > 0 ? '您有违章未处理' :''
        let self_title = this.state.self_pay > 0 ? '您有自助缴费单未处理' : ""
        return <div className="FailBox">
            <div className="box">
                <div className="title fs13">{wz_title}</div>
                {this.state.peccancy.map(item=><div key={item.id} onClick={()=>CarActions.getPeccancy(item.id)} className="wz_box fs14">
                    <p><span className="label">违章时间：</span>{new Time(item.happen_time).getTime('YYYY年MM月DD日  星期W hh:mm')}</p>
                    <p><span className="label">违章地点：</span>{item.happen_addr}</p>
                    <p><span className="label">违章行为：</span>{item.happen_behavior}</p>
                    <p><span className="label">处罚措施：</span>扣分 {item.score} 罚款 {item.fee}</p>
                </div>)}
                <div className="title fs13">{self_title}</div>
            </div>
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
                msg:'保证金，将于15日内原路退还，请耐心等待'
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
        const setCss = new AutoHeight()
        appMutual.sendUpdateTitle('新春大吉')
        setCss.auto('.link_con,.btn_con')
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
        return <div className="Finish">
            <MainBox>
                <FinishBox
                    type={text.type}
                    title={text.title}
                    msg={text.msg}
                />
                {failBox}
                {btn}
            </MainBox>
            <ToLongRentalExplain/>
        </div>
    }
}


 
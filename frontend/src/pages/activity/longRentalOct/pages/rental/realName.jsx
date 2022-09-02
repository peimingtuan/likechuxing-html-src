import {RentalActions} from "../../js/RentalStore";

/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: realName
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/9-下午6:51
 Description:
 Param:
 Return:
 *************************************************/
require('./realName.less')
import React from 'react'
import Reflux from 'reflux'
import myAjax from '../../component/myAjax/withJq'
import getApiUrl from '../../../../../js/getApiUrl'
import {Alert, Toast, Confirm} from "../../component/LikeAlert/index";
import ToLongRentalExplain from '../../component/ToLongRentalExplain'
import AppMutual from '../../../../../component/AppMutual'
const appMutual = new AppMutual()

export default class RealName extends React.Component{
    constructor(){
        super()
        this.state = {
            address: '',
            phone_no:'',
            work_time:''
        }
    }

    componentDidMount() {
        appMutual.sendUpdateTitle('待线下认证')
        this.getTime()
    }

    getTime(){
        let that = this
        let user = Reflux.GlobalState.common
        let rental = Reflux.GlobalState.rental
        myAjax.post(getApiUrl('long-rental/name-auth'),{
            uuid: user.uuid,
            sign: user.sign,
            city_id: rental.rental_city_id || 0
        },function(res){
            if(res.status === 0){
                that.setState(res.data)
            }
        })
    }

    cancelRental(){
        this.getTime()
        if (!this.state.server_time || !this.state.fetch_car_time) return;
        // console.log(this.state.fetch_car_time,this.state.server_time,(this.state.fetch_car_time - this.state.server_time )/86400);
        
        let moreThan3 = (this.state.fetch_car_time - this.state.server_time )/86400 >= 1
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
    getAddress(){
        let Myaddress
        if(this.state.address.length>1){
            Myaddress = this.state.address.map((item,index)=>(
                <div className="addMore" key={index}>{item.name}</div>
            ))
        } 
        return Myaddress
    }

    render(){
        let myAddress =  this.getAddress.call(this)
        return (
            <div className="RealName">
                <div className="realNameBox1">
                    <p className="p1"><b>请您携带以下证件：</b></p>
                    <img className="idCard" src={require('../../images/realname2.png')} />
                    <p className="orange fs12">需本人前往，进行线下认证，谢绝非本人！</p>
                </div>
                <div className="realNameBox2">
                    <p className="address fs14"><b>请您前往以下地点办理线下认证</b></p>
                    <div className="adds fs12"><span className="addreTitle">认证地点：</span>
                        {
                            this.state.address.length === 1 ? <div className="addreStyle">{this.state.address[0].name}</div> : myAddress
                                                
                        }
                    </div>
                    <div className="adds fs12"><span>联系电话：</span>{this.state.phone_no}</div>
                    <div className="adds fs12"><span>工作时间：</span>{this.state.work_time}</div>
                </div>
                <p className="hint">未办理线下认证将无法取车<br/>请至少提前一天进行线下认证</p>
                <a className='btn_short yellow fs16' onClick={this.cancelRental.bind(this)}>取消订单</a>
                <ToLongRentalExplain />
            </div>
        )
    }
}


 
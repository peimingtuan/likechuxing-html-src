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
import $ from "jquery";
import React from 'react'
import Reflux from 'reflux'
import myAjax from '../../component/myAjax/withJq'
import {IndexActions, IndexStore} from "../../js/IndexStore";
import getApiUrl from '../../../../../js/getApiUrl'
import {Alert, Toast, Confirm} from "../../component/LikeAlert/index";
import MainBox from '../../component/MainBox'
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
        appMutual.sendUpdateTitle('待实名认证')
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

    componentDidUpdate(){
        let window_height = window.innerHeight
        let height = $('body').height()
        if(height < (window_height - 10)){
            $('.btn_short').css('margin-top',window_height - height)
        }
    }

    cancelRental(){
        let moreThan3 = (this.state.fetch_car_time - this.state.server_time )/86400 >= 3
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

    render(){
        return (
            <div className="RealName">
                <MainBox>
                    <div className="realName">
                        <p className="fs14"><b>请您携带以下证件：</b></p>
                        <img className="idCard" src={require('../../images/realname.png')} />
                        <p className="orange fs12">需本人前往，进行实名认证，谢绝非本人！</p>
                        <p className="address fs14"><b>请您前往以下地点办理实名认证（未办理实名认证将无法取车）：</b></p>
                        <div className="adds fs12"><span>认证地点：</span>{this.state.address}</div>
                        <div className="adds fs12"><span>联系电话：</span>{this.state.phone_no}</div>
                        <div className="adds fs12"><span>工作时间：</span>{this.state.work_time}</div>
                        <a className='btn_short yellow fs16' onClick={this.cancelRental.bind(this)}>取消订单</a>
                    </div>
                </MainBox>
                <ToLongRentalExplain />
            </div>
        )
    }
}


 
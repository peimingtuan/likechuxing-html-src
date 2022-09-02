/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: pay
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/9-下午3:43
 Description:
 Param:
 Return:
 *************************************************/

require('./pay.less')
import React from 'react'
import Reflux from 'reflux'
import {IndexActions, IndexStore} from "../../js/IndexStore";
import {RentalActions} from "../../js/RentalStore";
import { Confirm} from "../../component/LikeAlert/index";
import format from '../../../../../js/function/format'
import AppMutual from '../../../../../component/AppMutual'
const appMutual = new AppMutual()

export default class Pay extends Reflux.Component {
    constructor() {
        super()
        this.store = IndexStore
        this.storeKeys = [
            'actual_fee'
        ]
    }

    componentDidMount(){
        appMutual.sendUpdateTitle('费用及押金支付')
    }

    pay(){
        IndexActions.pay()
    }

    cancelRental(){
        new Confirm({
            title:'确认取消？',
            confirmButtonCallback:function(){
                RentalActions.cancel()
            }
        })
    }

    render() {
        return (
                <div className="Pay">
                    <div className="pay">
                        <div className="payBox">
                            <div className="actual_fee fs14">
                                需支付金额
                                <p className="fs36">{format.money(this.state.actual_fee)}<span>元</span></p>
                            </div>
                        </div>
                        <div className="pay_way_Box">
                            <div className="pay_way">
                                <span className="icon_pay_zhifubao" />
                                <span>支付宝</span>
                                <span className="icon_pay_chosen" />
                            </div>
                        </div>
                        <div className="btn_con_pay">
                            <p className="tip fs12 red">24h未支付订单，系统自动关闭</p>
                            <a className="btn_long fs16" onClick={this.pay.bind(this)}>确认支付</a>
                            <a className="btn_long yellow fs16"onClick={this.cancelRental}>取消订单</a>
                        </div>
                    </div>
                </div>
            )

    }
}


 
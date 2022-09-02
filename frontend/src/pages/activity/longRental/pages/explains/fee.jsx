/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: process
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/24-下午4:01
 Description:
 Param:
 Return:
 *************************************************/
require('./explain.less')
import React from 'react'
import Reflux from 'reflux'
import MainBox from '../../component/MainBox'
import AutoHeight from '../../js/AutoHeight'


export default class process extends Reflux.Component {
    constructor() {
        super()
    }

    componentDidMount() {
        const setCss = new AutoHeight()
        setCss.auto('.box_footer')
    }

    render() {
        return <div className="Explain process">
            <MainBox>
                <div className='explain'>
                    <p>1、“春节长租”的长租费用根据车型及订单时长的不同而收费不同，请用户根据自身用车需求对应选择，并一次性付清租金。确认用车后，不支持提前还车。</p>
                    <p>2、取车时间>=3天取消的订单，可退还全额长租费用及保证金；取车时间小于3天取消订单的，收取10%的长租费用，保证金可正常退还。</p>
                    <p>3、订单时间到期未还车的，将收取违约金，违约金按日租金150%收取。违约金按日计算，不足一日，按一日计算。并且立刻出行有权强行收回车辆。</p>
                </div>
            </MainBox>
        </div>
    }
}

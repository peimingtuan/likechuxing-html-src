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
                    <div className='explain'>
                        <p>1.月租金根据不同车型而定，用户可根据用车需求自行选择。</p>
                        <p>2.预约成功后，距离取车时间不少于1天（含1天）取消订单，可退还全额月租金、保障服务费及保证金；距离取车时间不足1天取消订单，收取10%的月租金，保障服务费和保证金可正常退还。</p>
                        <p>3.月租车逾期未还车的，将收取违约金，违约金按日租金（月租金/30）的300%收取，不足一天，按一天计算,且需补缴逾期的保障服务费。立刻出行有权收回车辆。</p>
                        <p>4.特惠产品，仅限第一个月使用，如需继续用车，则按正常定价续租，不再享受特价优惠。</p>
                    </div>
                </div>
    }
}

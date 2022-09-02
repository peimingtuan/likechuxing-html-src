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
                    <p>春节期间立刻出行客服中心24小时提供用户咨询服务。车辆发生事故或故障，请第一时间拨打客服电话，客服会根据具体情况引导用户处理或转接当地值班运维人员处理。有运维人员值班的城市为广州、佛山、成都、武汉等城市。</p>
                </div>
            </MainBox>
        </div>
    }
}

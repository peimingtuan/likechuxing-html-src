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
                    <p>用户可在订单时间内前往预约网点取车。取车前按照车辆提示单检查车辆外观及机械功能，包括：钥匙、行驶证、三脚架、灭火器、托车钩和保单复印件等物品。还车时也应保持所有设备完整。</p>
                </div>
            </MainBox>
        </div>
    }
}

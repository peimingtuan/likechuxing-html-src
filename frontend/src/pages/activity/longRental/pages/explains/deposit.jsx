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
                    <p>保证金是立刻出行“春节长租”服务收取的车辆使用押金，根据所选车型不同需缴纳的保证金金额也不同。在法律法规允许范围内，用户自愿缴纳保证金。在成功还车后，确认租用车辆无事故、违章等情况下，保证金会在15日内原路退换。</p>
                    <p>如发生车辆损坏、违章、交通事故，平台有权从保证金中扣除因用户原因造成的车辆维修等附加费用，不足部分需用户补缴。</p>
                </div>
            </MainBox>
        </div>
    }
}

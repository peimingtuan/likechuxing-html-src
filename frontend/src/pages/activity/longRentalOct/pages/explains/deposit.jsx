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
                        <p>1.月租保证金是立刻出行月租服务收取的车辆使用押金，保证金费用均为1000元。</p>
                        <p>2.在法律法规允许范围内，用户应按照规定缴纳保证金。成功还车后，确认租用车辆无事故、违章等情况，保证金可在20个工作日后原路退还。</p>
                        <p>3.如车辆发生违章、损坏、交通事故等，平台有权从保证金中扣除因用户原因造成的车辆维修费、停运费等附加费用，不足部分需用户补缴。</p>
                    </div>
                </div>
    }
}

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
import {appMutual} from '../../../../../../other_modules/app-mutual'

export default class process extends Reflux.Component {
    constructor() {
        super()
    }

    componentDidMount() {
        appMutual.send.updateTitle('保证金说明')
    }

    render() {
        return <div className="Explain process">
                    <div className='explain'>
                        <p>1.保证金是立刻出行“春节长租”服务收取的车辆使用押金，保证金费用均为998元。</p>
                        <p>2.在法律法规允许范围内，用户自愿缴纳保证金。在成功还车后，确认租用车辆无事故、违章等情况下，保证金会在20个工作日后原路退换。</p>
                        <p>3.如发生车辆损坏、违章、交通事故，平台有权从保证金中扣除因用户原因造成的车辆维修等附加费用，不足部分需用户补缴。</p>
                    </div>
                </div>
    }
}

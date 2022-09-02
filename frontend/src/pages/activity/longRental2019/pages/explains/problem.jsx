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
        appMutual.send.updateTitle('车辆故障/事故如何处理')
    }

    render() {
        return <div className="Explain process">
                <div className='explain'>
                    <p>车辆发生故障或者事故，请第一时间拨打立刻出行客服中心电话400-666-2333，客服工作人员将24小时提供咨询服务。</p>
                </div>
            </div>
    }
}

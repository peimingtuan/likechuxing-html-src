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
import {appMutual} from '../../../../../../other_modules/app-mutual'


export default class process extends Reflux.Component {
    constructor() {
        super()
    }

    componentDidMount() {
        const setCss = new AutoHeight()
        setCss.auto('.box_footer')
        appMutual.send.updateTitle('流程说明')
    }

    render() {
        return <div className="Explain process">
                <div className='explain'>
                    <p>立刻出行将在春节期间暂停分时租赁服务。如果您有长租需求，可按以下步骤预定车辆：</p>
                    <p>第1步：选择车型<br />
                        登录立刻出行APP，进入“精彩活动”的“春节长租”页面选择车型。</p>
                    <p>第2步：选择取还车时间及取还车网点</p>
                    <p>第3步：缴纳相关费用<br/>
                        根据所选车型及订单时长，缴纳相应长租费用、保障服务费及保证金。</p>
                    <p>第4步：实名认证<br/>
                        成功订车后，需本人携带有效身份证原件和驾驶证原件，前往提示地址进行实名认证，并签订车辆租赁合同。不可由他人代办。</p>
                    <p>第5步：提取车辆<br/>
                        根据系统提示，在预定的取车当日前往预选停车场，并根据APP提示进行验车。验车完成后，通过APP开车门取车。</p>
                    <p>第6步：归还车辆<br/>
                        春节长租结束时，前往预选网点还车，并根据APP提示验车。验车完成后，在APP上锁车门还车。</p>
                </div>
            </div>
    }
}


 
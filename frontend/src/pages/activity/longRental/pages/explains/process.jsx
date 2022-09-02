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
                    <p>立刻出行春节期间将暂停分时租赁服务。如果您春节期间有长租需求，可按以下步骤预定车辆：</p>
                    <p>第一步：选择车型<br />
                        登陆立刻出行APP，进入“春节长租”页面选择长租的车型。</p>
                    <p>第二步：选择取还车时间，及取还车网点。</p>
                    <p>第三步：缴纳相关费用<br/>
                        根据所选车型及订单时长，缴纳相应长租费用及保证金。</p>
                    <p>第四步：实名认证<br/>
                        成功订车后，需本人携带身份证原件和驾驶证原件，前往提示地址进行实名认证，并领取车辆提示单。不可由他人代办。</p>
                    <p>第五步：提取车辆<br/>
                        根据系统提示，在预定的取车当日前往预选停车场，根据提示单进行验车。验车完成后，通过APP开车门取车。</p>
                    <p>第六步：归还车辆<br/>
                        长租结束时，前往预选网点还车，并提交还车验车单。系统将在成功还车后，自动提交保证金退还申请，成功退款后保证金将在15日内原路退还。</p>
                </div>
            </MainBox>
        </div>
    }
}


 
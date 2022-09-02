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
                    <p>立刻出行月租服务，租期为30天，如果您有长租用车需求，可按以下流程预订车辆：</p>
                    <p>1.选择车型<br />
                        打开立刻出行APP，进入“立刻月租”页面，选择月租车型。</p>
                    <p>2.选择取车时间及取还车网点</p>
                    <p>3.缴纳相关费用<br/>
                        根据所选车型，在立刻出行APP上缴纳月租金、保障服务费及租车保证金。</p>
                    <p>4.线下实名认证<br/>
                        预订成功后，需预订人本人携带身份证原件和驾驶证原件，前往APP提示地点进行线下实名认证。不可由他人代办。</p>
                    <p>5.提取车辆<br/>
                        根据系统提示，在预订取车当日前往预选停车场，并根据立刻出行APP提示验车。验车完成后，在APP上开车门取车。</p>
                    <p>6.归还车辆<br/>
                    月租结束后，前往预选网点还车，并根据立刻出行APP提示验车。验车完成后，在APP上锁车门还车。</p>
                </div>
            </div>
    }
}


 
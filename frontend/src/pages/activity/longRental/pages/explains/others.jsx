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
                    <p>订单时间内允许更改还车网点，但如果产生附加停车费等费用由用户承担。</p>
                    <p>本活动安卓系统仅支持2.1.2及以上版本参加。</p>
                </div>
            </MainBox>
        </div>
    }
}


 
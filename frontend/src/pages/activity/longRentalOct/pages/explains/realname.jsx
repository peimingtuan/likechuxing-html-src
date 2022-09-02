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
                    <p>1.预订人需携带本人身份证件原件和国内有效驾驶证原件，并保证所有证件有效期在一个月以上，前往APP提示地点办理线下认证。</p>
                    <p>2.线下认证仅限预订人亲自办理，不可由他人代办。</p>
                </div>
            </div>
    }
}

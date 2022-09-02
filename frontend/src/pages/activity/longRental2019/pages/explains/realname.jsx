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
        appMutual.send.updateTitle('线下实名认证说明')
    }

    render() {
        return <div className="Explain process">
                <div className='explain'>
                    <p>1.实名认证需用户携带本人有效身份证原件和驾驶证原件，前往APP提示地点办理线下认证。</p>
                    <p>2.线下实名认证仅限本人亲自办理，不可由他人代办。</p>
                </div>
            </div>
    }
}

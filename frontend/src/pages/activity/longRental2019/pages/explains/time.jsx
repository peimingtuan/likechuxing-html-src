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
        appMutual.send.updateTitle('时间说明')
    }

    render() {
        return <div className="Explain process">
                <div className='explain'>
                    <p>2019年春节长租时间为1月25日-2月19日，其中2月1日-2月10日为必选日期。</p>
                </div>
            </div>
    }
}

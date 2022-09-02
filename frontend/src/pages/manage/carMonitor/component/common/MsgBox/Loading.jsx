/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: Loading
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2017/12/8-上午10:55
 Description:
 Param:
 Return:
 *************************************************/
require('./Loading.less')
import React from 'react'
import Reflux from 'reflux'
import HeaderStore from '../../Stores/HeaderStore'

export default class Loading extends Reflux.Component {
    constructor() {
        super()
        this.store = HeaderStore
        this.storeKeys = [
            'loadingNum'
        ]
    }

    render() {
        return <div className={"Loading" + (this.state.loadingNum > 0 ? '' : ' hidden')}>
            <div className="img_con" />
        </div>
    }
}
 
/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/10-下午4:43
 Description:
 Param:
 Return:
 *************************************************/
require('./index.less')
import React from 'react'
import createHistory from 'history/createHashHistory'
const history = createHistory()

export default class ToLongRentalExplain extends React.Component {
    constructor() {
        super()
    }

    toExplain(){
        history.push('/explains')
    }

    render() {
        return <div className={"ToLongRentalExplain " + (this.props.type || '')} onClick={this.toExplain} />
    }
}


 
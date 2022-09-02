/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/16-下午6:32
 Description:
 Param:
 Return:
 *************************************************/
require('./index.less')
import React from 'react'

export default class ContentBox extends React.Component {
    constructor() {
        super()
    }

    render() {
        let extraClass = this.props.className || ''
        let title = this.props.title || ''
        return (
            <div className={"ContentBox " + extraClass}>
                <div className="editBox_title fs12">{title}</div>
                {this.props.children}
            </div>
        )
    }
}


 
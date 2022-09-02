/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/10-下午2:37
 Description:
 Param:
 Return:
 *************************************************/
require('./index.less')
import React from 'react'

export default class MainBox extends React.Component {
    constructor() {
        super()
    }

    render() {
        return (
            <div className="MainBox">
                <div className="huazhou"/>
                <div className="bg_color">
                    <div className="content">
                        <div className="box_header"/>
                        {this.props.children}
                        <div className="box_footer" />
                        <a className="footer_text fs12">客服电话：400-666-2333</a>
                    </div>
                </div>
                <div className="huazhou mirror"/>
            </div>
        )
    }
}


 
/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/2/24-下午3:47
 Description:
 Param:
 Return:
 *************************************************/
require('./index.less')
import React from 'react'
import Reflux from 'reflux'

export default class Route extends Reflux.Component {
    constructor(props) {
        super()
        this.store = props.store
        this.storeKeys = [
            'current_pathname'
        ]
    }

    render() {
        if(this.props.unmount){
            return this.state.current_pathname === this.props.pathname ? <div className='Route' >{this.props.component}</div> : ''
        }else{
            return <div className={'Route ' + (this.state.current_pathname === this.props.pathname ? 'show' : 'hidden')}>
                {this.props.component}
            </div>
        }
    }
}


 
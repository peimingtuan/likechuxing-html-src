/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2017/11/29-下午9:48
 Description:
 Param:
 Return:
 *************************************************/
require('./index.less')
import React from 'react'

export default class switchUpDown extends React.Component {
    constructor(props) {
        super()
        this.state = {
            open: props.opt.open || true
        }
    }

    switchStatus(){
        let nextOpen = !this.state.open
        this.setState({
            open: nextOpen
        })

        if(typeof this.props.opt.switchCallback === 'function'){
            this.props.opt.switchCallback(nextOpen)
        }
    }

    render() {
        return <div onClick={this.switchStatus.bind(this)} className={"switchUpDown " + (this.props.opt.className || '') + (this.state.open ? ' open' : '')} />
    }
}
 
/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: Timer
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/2-下午3:57
 Description:
 Param:
 Return:
 *************************************************/
require('./Timer.less')
import React from 'react'
import Reflux from 'reflux'

export default class Timer extends Reflux.Component {
    constructor() {
        super()
        this.timer = 0
        this.state={
            deg:0,
            deg_step:6
        }
    }

    componentDidMount() {
        this.timer = setInterval(function(){
            let deg = this.state.deg+this.state.deg_step
            if(deg>360){
                deg-=360
            }
            this.refs.point.style.transform = 'rotate('+deg+'deg) translate(0, -8px)'
            this.setState({
                deg:deg
            })
        }.bind(this),1000)
    }

    componentWillUnmount(){
        clearInterval(this.timer)
    }

    render() {
        return <div className="Timer">
            <div className="border">
                <i ref='point' className="timer_point"/>
                <div className="clock"/>
            </div>
        </div>
    }
}
 
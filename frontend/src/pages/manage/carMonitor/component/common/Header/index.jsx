/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2017/11/27-下午2:16
 Description:
 Demo:
 Others:
 *************************************************/
require('./index.less')
import React from 'react'
import Reflux from 'reflux'
import HeaderStore from '../../Stores/HeaderStore'
import HeaderActions from '../../Stores/HeaderActions'
import MsgBox from '../MsgBox'

 class Header extends Reflux.Component {
    constructor() {
        super()
        this.store = HeaderStore
        this.storeKeys = [
            'headerTabs',
            'current_pathname'
        ]
    }

    render() {
        return <div className="Header">
            <div className="logo_con">
                <img onClick={HeaderActions.printThis} src={require('../../../images/logo.png')} />
                立刻 | 鹰眼
            </div>
            <ul className="tab_con">
                {this.state.headerTabs.map(item => {
                    let className ='tab pointer' + (item.pathname === this.state.current_pathname ? ' active' : '')
                    return  <li key={item.pathname} onClick={()=>{HeaderActions.changePathname(item.pathname)}} className={className}>{item.name}</li>
                })}
            </ul>
            <MsgBox/>
        </div>
    }
}

export default Header
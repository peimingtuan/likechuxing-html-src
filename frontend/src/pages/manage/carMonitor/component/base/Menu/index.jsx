/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2017/12/11-上午9:57
 Description:
 Param:
 Return:
 *************************************************/
require('./index.less')
import React from 'react'
import Reflux from 'reflux'

export default class Menu extends Reflux.Component {
    constructor(props) {
        super()
        this.store = props.store
        this.storeKeys = [
            'menus',
            'current_pathname'
        ]
    }

    render() {
        return <div className="Menu">
            <ul className="menu_list">
                {
                    this.state.menus.map(item => (
                        <li key={item.pathname} className={"item " + (item.pathname === this.state.current_pathname ? 'active' : '')} onClick={()=> this.props.actions.changeCurrentPath(item.pathname)}>
                            <div className="name">{item.name}</div>
                        </li>
                    ))
                }
            </ul>
        </div>
    }
}
 
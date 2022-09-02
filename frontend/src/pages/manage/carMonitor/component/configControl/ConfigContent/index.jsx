/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2017/11/29-下午3:04
 Description:
 Param:
 Return:
 *************************************************/
require('./index.less')
import React from 'react'
import Menu from '../../base/Menu'
import Route from '../../base/Route'
import ConfigStore from '../../Stores/ConfigStore'
import FenceContent from '../fenceControl/FenceContent'
import FenceShow from '../fenceControl/FenceShow'
import FenceCars from '../fenceControl/FenceCars'
import ConfigActions from '../../Stores/ConfigActions'

export default class ConfigContent extends React.Component {
    constructor() {
        super()
    }

    render() {
        return <div className="ConfigContent">
            <Menu
                store={ConfigStore}
                actions={ConfigActions}
            />
            <div className="contents">
                <Route store={ConfigStore} pathname='/fence' component={<FenceContent/>}/>
                <Route unmount={true} store={ConfigStore} pathname='/fence/show' component={<FenceShow/>}/>
                <Route unmount={true} store={ConfigStore} pathname='/fence/manage' component={<FenceCars/>}/>
            </div>
        </div>
    }
}
 
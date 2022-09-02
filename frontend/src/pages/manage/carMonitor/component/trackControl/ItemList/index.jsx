/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2017/11/30-下午4:17
 Description:
 Param:
 Return:
 *************************************************/
require('./index.less')
import React from 'react'
import CarList from './carList'
import BranchList from './branchList'

export default class ItemList extends React.Component {
    constructor() {
        super()
    }

    render() {
        return <div className="ItemList">
            <CarList/>
            <BranchList/>
        </div>
    }
}
 
/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2017/11/29-下午4:59
 Description:
 Param:
 Return:
 *************************************************/
require('./index.less')
import React from 'react'
import SearchCar from './SearchCar'
import SearchBranch from './SearchBranch'

export default class TrackSearch extends React.Component {
    constructor() {
        super()
    }

    render() {
        return <div className="TrackSearch">
            <SearchCar/>
            <SearchBranch/>
        </div>
    }
}

 
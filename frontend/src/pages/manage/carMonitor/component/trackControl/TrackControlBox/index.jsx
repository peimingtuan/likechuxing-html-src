/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2017/11/29-下午3:25
 Description:
 Param:
 Return:
 *************************************************/
require('./index.less')
import React from 'react'
import Reflux from 'reflux'
import TrackSearchActions from '../../Stores/TrackSearchActions'
import TrackSearchStore from '../../Stores/TrackSearchStore'
import SwitchUpDown from '../../base/SwitchUpDown'

import $ from 'jquery'
import TrackSearch from '../TrackSearch'
import ItemList from '../ItemList'

export default class TrackControlBox extends Reflux.Component {
    constructor() {
        super()
        this.store = TrackSearchStore
        this.state = {
            // @Boolean 轨迹监控模块列表是否处于打开状态。true:open false:close
            trackControlBodyOpen: true,
            // @Boolean 轨迹监控模块搜索栏是否处于打开状态。true:open false:close
            trackSearchOpen: true,
        }
        this.storeKeys = [
            'search_type',
            'trackSearchOpen'
        ]
    }

    toggleBody(){
        this.setState({
            trackControlBodyOpen: !this.state.trackControlBodyOpen
        })
        $(this.refs.body).slideToggle(400)
    }

    typeClick(e){
        let type = $(e.target).attr('data-id')
        // 点击的是li且不是当前选中的type
        if(type !== undefined && type !== this.state.search_type){
            TrackSearchActions.changeSearchType(type)
        }
    }

    switchSearch(){
        this.setState({
            trackSearchOpen: !this.state.trackSearchOpen
        })
        $('.TrackSearch').slideToggle(400)
    }

    render() {
        return <div className="TrackControlBox boxShadow">
            <div className="TrackControlTitle">
                <span>车辆实时监控系统</span>
                <SwitchUpDown opt={{
                    className: 'switchBody',
                    open: this.state.trackControlBodyOpen,
                    switchCallback: this.toggleBody.bind(this)
                }}/>
            </div>

            <div ref="body" className="TrackControlBody">
                <div className="switch_container">
                    <ul className="switch" onClick={this.typeClick.bind(this)}>
                        <li className={"item pointer car "+(this.state.search_type === '0' ? 'active':'')} data-title="车辆" data-id="0"/>
                        <li className={"item pointer branch "+(this.state.search_type === '1' ? 'active':'')} data-title="网点" data-id="1"/>
                    </ul>
                    <SwitchUpDown opt={{
                        className: 'switchSearch',
                        open: this.state.trackSearchOpen,
                        switchCallback: this.switchSearch.bind(this)
                    }}/>
                    <TrackSearch/>
                    <ItemList/>
                </div>
            </div>
        </div>
    }
}
 
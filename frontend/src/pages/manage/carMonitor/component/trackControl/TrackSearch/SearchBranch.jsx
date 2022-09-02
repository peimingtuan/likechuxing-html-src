/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: SearchBranch
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2017/12/29-下午6:48
 Description:
 Param:
 Return:
 *************************************************/
import $ from 'jquery'
import React from 'react'
import Reflux from 'reflux'
import TrackSearchStore from '../../Stores/TrackSearchStore'
import TrackSearchActions from '../../Stores/TrackSearchActions'
import LabelInput from '../../base/LabelInput'
import {translateCity} from "../../../../../../js/function/translateCity";

export default class SearchBranch extends Reflux.Component {
    constructor() {
        super()
        this.store = TrackSearchStore
        this.storeKeys = [
            'search_type',
            'search_cityId_branch',
            'search_cityList'
        ]
    }

    changeCityId(e){
        let value = $(e.currentTarget).val()
        mapControl.setCity(translateCity.getCityByCityId(value).name)
        TrackSearchActions.changeSearchString('search_cityId_branch', value)
    }

    render() {
        return <div className={"SearchBranch input_con "+(this.state.search_type !== '1' ? 'hidden' : '')}>
            <label className="search_item">城市：
                <select value={this.state.search_cityId_branch} onChange={this.changeCityId}>
                    <option value="0">全国</option>
                    {this.state.search_cityList.map(item => <option key={item.city_id} value={item.city_id}>{item.name+'-'+item.branch_count+'网点'}</option>)}
                </select>
            </label>
            <label className="search_item">网点类型：
                <select onChange={(e) => TrackSearchActions.changeSearchString('search_biz_type', $(e.currentTarget).val())}>
                    <option value="">全部</option>
                    <option value="0">合作(B)</option>
                    <option value="1">非合作(B+)</option>
                </select>
            </label>
            <LabelInput opt={{
                labelClassName: 'search_item',
                labelText: '网点名称：',
                inputPlaceholder: '网点名',
                changeCallback: (value) => TrackSearchActions.changeSearchString('search_branchName', value)
            }}/>
            {/*<div className="btn_con">
                <button className="dark_btn search" onClick={TrackSearchActions.searchBranches}>搜索网点</button>
            </div>*/}
        </div>
    }
}
 
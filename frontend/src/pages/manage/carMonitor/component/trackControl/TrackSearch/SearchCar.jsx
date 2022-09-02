/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: SearchCar
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2017/12/29-下午6:46
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
import {CarStatus} from "../../../js/config"
import {translateCity} from "../../../../../../js/function/translateCity";

export default class SearchCar extends Reflux.Component {
    constructor() {
        super()
        this.store = TrackSearchStore
        this.storeKeys = [
            'search_type',
            'search_cityId_car',
            'search_cityList'
        ]
    }

    changeCityId(e){
        let value = $(e.currentTarget).val()
        mapControl.setCity(translateCity.getCityByCityId(value).name)
        TrackSearchActions.changeSearchString('search_cityId_car', value)
    }

    render() {
        return <div className={"SearchCar input_con "+(this.state.search_type !== '0' ? 'hidden' : '')}>
            <label className="search_item">城市：
                <select value={this.state.search_cityId_car} onChange={this.changeCityId}>
                    <option value="0">全国</option>
                    {this.state.search_cityList.map(item => <option key={item.city_id} value={item.city_id}>{item.name+' - '+item.car_count+'辆'}</option>)}
                </select>
            </label>
            <label className="search_item">车辆状态：
                <select onChange={(e) => TrackSearchActions.changeSearchString('search_carStatus', $(e.currentTarget).val())}>
                    <option value="">全部</option>
                    {CarStatus.map(item => <option key={item.status} value={item.status}>{item.desc}</option>)}
                </select>
            </label>
            <LabelInput opt={{
                labelClassName: 'search_item',
                labelText: '车牌：',
                inputPlaceholder: '车牌号',
                changeCallback: (value) => TrackSearchActions.changeSearchString('search_plateNo', value)
            }}/>
            <LabelInput opt={{
                labelClassName: 'search_item',
                labelText: 'VIN：',
                inputPlaceholder: '车辆VIN号',
                changeCallback: (value) => TrackSearchActions.changeSearchString('search_vin', value)
            }}/>
            {/*<div className="btn_con">
                <button className="dark_btn search" onClick={this.searchClick}>搜索车辆</button>
            </div>*/}
        </div>
    }
}
 
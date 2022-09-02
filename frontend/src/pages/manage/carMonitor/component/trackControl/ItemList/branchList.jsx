/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: carList
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/2-上午10:19
 Description:
 Param:
 Return:
 *************************************************/
require('./branchList.less')
import React from 'react'
import Reflux from 'reflux'
import TrackSearchStore from '../../Stores/TrackSearchStore'
import BranchStore from '../../Stores/BranchStore'
import BranchActions from '../../Stores/BranchActions'
import Pagination from '../../base/Pagination'

export default class branchList extends Reflux.Component {
    constructor() {
        super()
        this.stores = [TrackSearchStore, BranchStore]
        this.storeKeys = [
            'search_type',
            'itemListShowRow',

            'branchList',
            'branchListPage',
            'activeBranch'
        ]
    }

    changePage(page){
        BranchActions.changeBranchListPage(page)
    }

    clickItem(branch){
        if(branch.equal(this.state.activeBranch)){
            BranchActions.changeActiveBranch({})
        }else{
            BranchActions.changeActiveBranch(branch)
            mapControl.panTo(branch.getGPSArray())
        }
        mapControl.carsLayer.renderLater()
    }

    render() {
        return <div className={"BranchList "+(this.state.search_type !== '1'?'hidden':'')}>
            <ul className="list">
                {this.state.branchList.slice((this.state.branchListPage-1)*this.state.itemListShowRow, this.state.branchListPage*this.state.itemListShowRow).map(item => {
                    let name = item.name.length>13 ? item.name.substr(0,12)+'...' : item.name
                    return <li key={item.id} data-name={item.name} className={"pointer row "+ ((this.state.activeBranch && item.id === this.state.activeBranch.id) ? 'active ': '') + ((item.name.length>13)?"long":'')} onClick={() => this.clickItem.call(this, item)}>
                            <span className="name" >{name}</span>
                            <span className="time" >{item.biz_type === "0"?"合作(B)":"非合作(B+)"}</span>
                        </li>
                })}
            </ul>
            <Pagination page_index={this.state.branchListPage} page_total={Math.ceil(this.state.branchList.length/this.state.itemListShowRow)} changePage={this.changePage.bind(this)}/>
        </div>
    }
}
 
import {RentalActions} from "../../js/RentalStore";

/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: pickBranch
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/5-下午3:34
 Description:
 Param:
 Return:
 *************************************************/

require('./pickBranch.less')
import React from 'react'
import Reflux from 'reflux'
import {IndexActions, IndexStore} from '../../js/IndexStore'
import createHistory from 'history/createHashHistory'
const history = createHistory()
const coordtransform = require('coordtransform');
import AppMutual from '../../../../../component/AppMutual'
import parseURL from "../../../../../js/parseURL";
const appMutual = new AppMutual()
import LocalHistory from '../../js/localHistory'

export default class pickBranch extends Reflux.Component {
    constructor(props) {
        super()
        this.query = parseURL(props.location.search).query
        this.state = {
            chosen: null
        }
        this.store = IndexStore
        this.storeKeys = ['search_lng','search_lat','branchList']
        this.localHistory = new LocalHistory()
    }

    componentDidMount() {
        appMutual.sendUpdateTitle('地址查询')
        let that = this
        let map = new BMap.Map("map");    // 创建Map实例
        map.centerAndZoom(new BMap.Point(this.state.search_lng, this.state.search_lat), 15);
        map.enableScrollWheelZoom()
        map.enableScrollWheelZoom()
        // 中心点
        let marker = new BMap.Marker(new BMap.Point(this.state.search_lng, this.state.search_lat),{
            icon: new BMap.Icon(require('../../images/icon_search_location.png'), new BMap.Size(18,36),{
                imageSize:new BMap.Size(18,36),
                anchor:new BMap.Size(9,32),
            })
        });
        map.addOverlay(marker)

        let marker_big = new BMap.Marker(new BMap.Point(this.state.search_lng, this.state.search_lat),{
            icon:new BMap.Icon(require('../../images/point_icon_like.png'), new BMap.Size(60,72),{
                imageSize:new BMap.Size(60,72),
                anchor:new BMap.Size(30,60),
            })
        });
        marker_big.hide()
        marker_big.setZIndex(10)
        map.addOverlay(marker_big)

        this.state.branchList.forEach(item=>{
            let bp = coordtransform.gcj02tobd09(item.lng,item.lat)
            let pt = new BMap.Point(bp[0], bp[1])
            let myIcon = new BMap.Icon(require('../../images/point_icon_like.png'), new BMap.Size(41,48),{
                imageSize:new BMap.Size(41,48),
                anchor:new BMap.Size(20,42),
            });
            let marker2 = new BMap.Marker(pt,{icon:myIcon});  // 创建标注
            marker2.addEventListener('click', function(){
                marker_big.setPosition(this.getPosition())
                marker_big.show()
                that.setState({
                    chosen:item
                })
            })
            map.addOverlay(marker2);
        })
    }

    chooseBranch(){
        if(this.state.chosen){
            if(this.query.from === 'edit'){
                // 初始选车
                let key = this.query.type == 0?'startPoint':'endPoint'
                let branch = {
                    branch_id:this.state.chosen.id,
                    branch_name:this.state.chosen.name,
                    branch_address:this.state.address,
                    lng:this.state.lng,
                    lat:this.state.lat
                }
                IndexActions.changeState({
                    [key]:branch
                })
                history.goBack()
            }else{
                // type === 'fetch'行程中
                RentalActions.changeEndBranch({
                    branch_id:this.state.chosen.id,
                    lng:this.state.chosen.lng,
                    lat:this.state.chosen.lat
                })
            }
        }
    }

    render() {
        return <div className="PickBranch">
            <div style={{height:window.innerHeight+'px'}} id='map' />
            <div className="name fs14">{this.state.chosen?this.state.chosen.name:<span className="default">请在地图上选择网点</span>}</div>
            <div className="btn_con">
                <a className={"btn_long " + (this.state.chosen ? '' :'disabled')} onClick={this.chooseBranch.bind(this)}>确认</a>
            </div>
        </div>
    }
}


 
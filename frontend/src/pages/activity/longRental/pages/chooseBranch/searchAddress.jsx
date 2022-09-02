import Gps2Distance from "../../../../../js/function/gps2distance";

/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: searchAddress
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/4-下午8:18
 Description:
 Param:
 Return:
 *************************************************/

require('./searchAddress.less')
import React from 'react'
import Reflux from 'reflux'
import {IndexActions, IndexStore} from '../../js/IndexStore'
import createHistory from 'history/createHashHistory'
import loading from '../../component/loading'
const history = createHistory()
import MainBox from '../../component/MainBox'
import ContentBox from '../../component/ContentBox'
import $ from 'jquery'
import {translateCity} from "../../../../../js/function/translateCity";
import AppMutual from '../../../../../component/AppMutual'
const appMutual = new AppMutual()

class ResultBox extends React.Component{
    constructor(){
        super()
    }

    handleClick(){
        let that = this
        loading.show()
        IndexActions.changeState({
            search_lng:this.props.lng,
            search_lat:this.props.lat
        })
        setTimeout(function(){
            loading.hide()
            history.replace({
                pathname:'/chooseBranch/pickBranch',
                search:that.props.search
            })
        },600)
    }

    render(){
        return (
            <li className="ResultBox" onClick={this.handleClick.bind(this)}>
                <div className="icon" />
                <div className="position">
                    <div className="title fs15">{this.props.title}</div>
                    <div className="desc fs12">{this.props.address}</div>
                </div>
            </li>
        )
    }
}

export default class searchAddress extends Reflux.Component {
    constructor() {
        super()
        this.local = null
        this.searching = false
        this.state = {
            results:[]
        }
        this.store = IndexStore
    }

    componentDidMount() {
        appMutual.sendUpdateTitle('地址查询')
        let window_height = window.innerHeight
        let height = $('body').height()
        if(height < window_height){
            $('.result_con').height(window_height - height)
        }


        let that = this
        let city = translateCity.getCityByCityId(this.state.currentCityId)
        let cityName = city ? city.name : ''
        this.local = new BMap.LocalSearch(cityName, {
            onSearchComplete: function(results){
                // 判断状态是否正确
                if (that.local.getStatus() == BMAP_STATUS_SUCCESS){
                    let s = [];
                    for (let i = 0; i < results.getCurrentNumPois(); i ++){
                        s.push(results.getPoi(i));
                    }
                    that.setState({
                        results:s
                    })
                }
            }
        });
    }

    back(){
        this.props.history.goBack()
    }

    handleInput(e){
        let value = e.target.value
        if(value.length>1 && !this.searching){
            this.local.search(value)
            this.searching = true
            setTimeout(function(){
                this.searching = false
            }.bind(this),200)
        }else{
            this.setState({
                results:[]
            })
        }
    }

    render() {
        return <div className="SearchAddress">
            <MainBox>
                <div className="searchAddress">
                    <ContentBox className="no_paddingTop">
                        <div className="search fs14" >
                            <label>
                                <input type='text' className="keyword fs14" autoFocus={true} onInput={this.handleInput.bind(this)} placeholder="输入地址搜索周边网点"/>
                            </label>
                            <div className="search_btn" onClick={this.back.bind(this)}>取消</div>
                        </div>
                    </ContentBox>
                </div>
                <div className="result_con">
                    <ul>
                        {this.state.results.map(item=><ResultBox
                            key={item.uid}
                            title={item.title}
                            address={item.address}
                            lat={item.point.lat}
                            lng={item.point.lng}
                            search={this.props.location.search}
                        />)}
                    </ul>
                </div>
            </MainBox>

        </div>
    }
}


 
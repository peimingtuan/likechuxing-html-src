/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/3-下午1:46
 Description:
 Param:
 Return:
 *************************************************/
require('./index.less')
import $ from 'jquery'
import React from 'react'
import Reflux from 'reflux'
import AppMutual from '../../../../../component/AppMutual'
const appMutual = new AppMutual()
import MainBox from '../../component/MainBox'
import ContentBox from '../../component/ContentBox'
import AutoHeight from '../../js/AutoHeight'

export default class explains extends Reflux.Component {
    constructor() {
        super()
        this.state = {
            list: [
                {id:1,title:'长租流程说明',path:'process'},
                {id:2,title:'租金说明',path:'fee'},
                {id:3,title:'保证金说明',path:'deposit'},
                {id:4,title:'线下认证说明',path:'realname'},
                {id:5,title:'取车说明',path:'getCar'},
                {id:6,title:'加油说明',path:'charge'},
                {id:7,title:'车辆故障/事故怎么办',path:'problem'},
                {id:8,title:'其它',path:'others'}
            ]
        }
    }

    componentDidMount() {
        appMutual.sendUpdateTitle('长租说明')
        const setCss = new AutoHeight()
        setCss.auto('.box_footer')
    }

    componentDidUpdate() {
    }

    click(path){
        this.props.history.push('/explains/'+path)
    }

    render() {
        return <div className="Explains">
            <MainBox>
                <div className="explains">
                    {this.state.list.map(item=><div key={item.id}  onClick={()=>this.click.call(this,item.path)}>
                        <ContentBox className="item">
                            {item.id + ' '+ item.title}
                        </ContentBox>
                    </div>)}
                </div>
            </MainBox>
        </div>
    }
}
 
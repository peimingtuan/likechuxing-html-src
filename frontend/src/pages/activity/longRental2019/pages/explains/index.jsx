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
import React from 'react'
import Reflux from 'reflux'
import {appMutual} from '../../../../../../other_modules/app-mutual'

export default class explains extends Reflux.Component {
    constructor() {
        super()
        this.state = {
            list: [
                {id:1,title:'时间说明',path:'time'},
                {id:2,title:'流程说明',path:'process'},
                {id:3,title:'费用说明',path:'fee'},
                {id:4,title:'保证金说明',path:'deposit'},
                {id:5,title:'线下实名认证说明',path:'realname'},
                {id:6,title:'取还车说明',path:'getCar'},
                {id:7,title:'加油说明',path:'charge'},
                {id:8,title:'车辆故障/事故如何处理',path:'problem'},
                {id:9,title:'违约金说明',path:'price'},
                {id:10,title:'续租说明',path:'renew'},
                {id:11,title:'其它',path:'others'}
            ]
        }
    }

    componentDidMount() {
        appMutual.send.updateTitle('长租说明')
    }

    componentDidUpdate() {
    }

    click(path){
        this.props.history.push('/explains/'+path)
    }

    render() {
        return <div className="Explains">
                <div className="explains">
                    {this.state.list.map(item=><div key={item.id}  onClick={()=>this.click.call(this,item.path)}>
                        <div className="item">
                            {item.id + ' '+ item.title}
                        </div>
                    </div>)}
                </div>
            </div>
    }
}
 
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
import AppMutual from '../../../../../component/AppMutual'
const appMutual = new AppMutual()
import AutoHeight from '../../js/AutoHeight'

export default class explains extends Reflux.Component {
    constructor() {
        super()
        this.state = {
            list: [
                {id:1,title:'月租流程说明',path:'process'},
                {id:2,title:'月租金说明',path:'fee'},
                {id:3,title:'保障服务费说明',path:'feeBaozhang'},
                {id:4,title:'月租保证金说明',path:'deposit'},
                {id:5,title:'线下认证说明',path:'realname'},
                {id:6,title:'取还车说明',path:'getCar'},
                {id:7,title:'加油/充电说明',path:'charge'},
                {id:8,title:'车辆故障/事故说明',path:'problem'},
                {id:9,title:'其它',path:'others'}
            ]
        }
    }

    componentDidMount() {
        appMutual.sendUpdateTitle('月租说明')
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
 
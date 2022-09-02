import $ from "jquery";

/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/4-下午3:21
 Description:
 Param:
 Return:
 *************************************************/
require('./index.less')
import React from 'react'
import Reflux from 'reflux'
import {IndexStore, IndexActions} from '../../js/IndexStore'
import {RentalActions} from "../../js/RentalStore";
import {Link} from 'react-router-dom'
import createHistory from 'history/createHashHistory'
const history = createHistory()
import MainBox from '../../component/MainBox'
import ContentBox from '../../component/ContentBox'
import Gps2Distance from '../../../../../js/function/gps2distance'
import AppMutual from '../../../../../component/AppMutual'
const appMutual = new AppMutual()
import parseURL from '../../../../../js/parseURL'
import AutoHeight from '../../js/AutoHeight'
import LocalHistory from '../../js/localHistory'
let setCss = ''

class BranchBox extends Reflux.Component{
    constructor(){
        super()
        this.store = IndexStore
        this.storeKeys = ['search_type']
    }

    handleClick(){
        this.props.localHistory.push(this.props.data)
        if(this.props.from === 'edit'){
            // 初始选车
            let key = this.props.type == 0?'startPoint':'endPoint'
            IndexActions.changeState({
                [key]:this.props.data
            })
            history.push('/main/editRental')
        }else{
            // type === 'fetch'行程中
            RentalActions.changeEndBranch(this.props.data)
        }
    }

    render(){
        let line1 = (this.props.same === 'same') ? '同取车网点' : this.props.data.branch_name;
        let line2 = (this.props.same === 'same')? this.props.data.branch_name : this.props.data.branch_address;
        let user = Reflux.GlobalState.common
        let _distance = new Gps2Distance().distance([[user.user_lng,user.user_lat],[this.props.data.lng,this.props.data.lat]])
        let distance = _distance < 1 ? (_distance*1000).toFixed(0) + '米' : _distance.toFixed(0) + '公里'
        if(/NaN/.test(distance)){
            distance = ''
        }
        return(
            <div className="BranchBox">
                <div className={"icon " + this.props.same} />
                <div className="branch" onClick={this.handleClick.bind(this)}>
                    <p className="fs15">{line1}</p>
                    <p className="fs12">{line2}</p>
                </div>
                <div className="distance fs13">{distance}</div>
            </div>
        )
    }
}

export default class index extends Reflux.Component {
    constructor(props) {
        super()
        this.localHistory =  new LocalHistory()
        this.state = {
            local_history:this.localHistory.get()
        }
        this.query = parseURL(props.location.search).query
        this.store = IndexStore
        this.storeKeys = ['branchList','startPoint']
    }

    componentDidMount() {
        setCss = new AutoHeight()
        appMutual.sendUpdateTitle('网点选择')
        IndexActions.initBranch()
    }

    jumpToSearch(){
        history.replace({
            pathname:"/chooseBranch/searchAddress",
            search:this.props.location.search
        })
    }

    componentDidUpdate(){
        setCss.auto('.box_footer')
    }

    clearHistory(){
        this.localHistory.clear()
        this.setState({
            local_history:[]
        })
    }

    render() {
        let type = this.query.type
        let same_branch = (type == 1 && this.state.startPoint) ? (
            <ContentBox className="no_padding">
                <BranchBox localHistory={this.localHistory} same="same" data={this.state.startPoint} type={type} from={this.query.from}/>
            </ContentBox>
        ) : ''

        let history_branch = this.state.local_history.length === 0 ? '' : (
            <ContentBox title="历史网点">
                <div className="history delete" onClick={this.clearHistory.bind(this)}/>
                {this.state.local_history.map(item=><BranchBox localHistory={this.localHistory} same="history" key={"his_"+item.branch_id} data={item} type={type} from ={this.query.from}/>)}
            </ContentBox>
        )

        let list = <div className="empty fs13">当前城市暂无长租可用网点</div>
        if(this.state.branchList.length > 0){
            list = this.state.branchList.map(item=><BranchBox localHistory={this.localHistory} key={item.id} data={{
                branch_id:item.id,
                branch_name:item.name,
                branch_address:item.address,
                lng:item.lng,
                lat:item.lat
            }} type={type} from ={this.query.from}/>)
        }
        return (
            <div className="ChooseBranch">
                <MainBox>
                    <div className="chooseBranch">
                        <ContentBox className="no_paddingTop">
                                <div className="search fs14" onClick={this.jumpToSearch.bind(this)}>
                                    请输入地址查询网点
                                    <span className="search_btn">查询</span>
                                </div>
                        </ContentBox>
                        {same_branch}
                        {history_branch}
                        <ContentBox title="网点列表" className="no_border">
                            <div className="branch_list">
                                {list}
                            </div>
                        </ContentBox>
                    </div>
                </MainBox>
            </div>
        )
    }
}


 
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
import createHistory from 'history/createHashHistory'
const history = createHistory()
import Gps2Distance from '../../../../../js/function/gps2distance'
import {appMutual} from '../../../../../../other_modules/app-mutual'
import parseURL from '../../../../../js/parseURL'
import AutoHeight from '../../js/AutoHeight'
import LocalHistory from '../../js/localHistory'
import {umeng}from '../../js/umeng'
import {translateCity} from "../../../../../js/function/translateCity";
import loading from '../../component/loading'
let setCss = ''

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
            // history.replace('/main/editRental')
            history.goBack()
        }else{
            // type === 'fetch'行程中
            RentalActions.changeEndBranch(this.props.data)
        }
    }

    render(){
        return(
            <div className="BranchBox">
                <div className={"icon " + this.props.same} />
                <div className="branch" onClick={this.handleClick.bind(this)}>
                    <p className="name">{this.props.data.branch_name}</p>
                    <p className="address">{this.props.data.branch_address}</p>
                </div>
                <div className="distance fs13">{this.props.data.branch_distance}</div>
            </div>
        )
    }
}

export default class index extends Reflux.Component {
    constructor(props) {
        super(props)
      this.query = parseURL(props.location.search).query
        this.localHistory =  Number(this.query.type)===0 ? new LocalHistory("start") :new LocalHistory("end")
        this.local = null
        this.searching = false
        this.state = {
            local_history:this.localHistory.get(),
            results:[],
            search:false
        }

        this.store = IndexStore
        this.storeKeys = ['currentCityId','branchList','startPoint','branchList_end','search_type']
    }

    componentDidMount() {
        if(Number(this.query.type)===0){
            umeng.addEvent(['chooseBranch','start',this.state.currentCityId])
        }else{
            umeng.addEvent(['chooseBranch','end',this.state.currentCityId])
        }
        setCss = new AutoHeight()
        appMutual.send.updateTitle('网点选择')
        IndexActions.initBranch(this.query.type)

        let window_height = window.innerHeight
        let height = $('.serchBox').height()    
        console.log(window_height,height);
            
        $('.result_con').css('minHeight',window_height-height-1)


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


    jumpToSearch(){
        // history.replace({
        //     pathname:"/chooseBranch/searchAddress",
        //     search:this.props.location.search
        // })
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
    isShowSearch(isShow){
        
        if(isShow == 'show') { 
            $('.result_con').css('display','block');
            $('.branch_list').css('display','none');
            this.setState({search:true})
        }
        if(isShow == 'hide') { 
            $('.result_con').css('display','none');
            $('.branch_list').css('display','block');
            this.setState({search:false})}
    }
    
    render() {
        let type = this.query.type
        // let same_branch = (type == 1 && this.state.startPoint) ? (
        //     <ContentBox className="no_padding">
        //         <BranchBox localHistory={this.localHistory} same="same" data={this.state.startPoint} type={type} from={this.query.from}/>
        //     </ContentBox>
        // ) : ''
        let history_branch = this.state.local_history.length === 0 ? '' : (
            <div className="historyBox">
                <div className="historyTitle">
                    <p>历史网点</p>
                    <div className="history delete" onClick={this.clearHistory.bind(this)}/>
                </div>
                {this.state.local_history.map(item=><BranchBox localHistory={this.localHistory} same="history" key={"his_"+item.branch_id} data={item} type={type} from ={this.query.from}/>)}
            </div>
        )

        let list = <div className="empty fs13">当前城市暂无长租可用网点</div>
        let user = Reflux.GlobalState.common

      let branchList = Number(this.query.type) === 0 ? this.state.branchList : this.state.branchList_end
        if(branchList.length > 0){
            list = []
            branchList.map((item,index)=>{
                let _distance = new Gps2Distance().distance([[user.user_lng,user.user_lat],[item.lng,item.lat]])
                let distance = _distance < 1 ? (_distance*1000).toFixed(0) + '米' : _distance.toFixed(0) + '公里'
                if(/NaN/.test(distance)){
                    distance = ''
                }
                list.push(Object.assign({},item,{distance:distance}))
            })
            
            list = list.sort((a,b)=>
                parseInt(a.distance) - parseInt(b.distance)
            ).map(item=><BranchBox localHistory={this.localHistory} key={item.id} data={{
                branch_id:item.id,
                branch_name:item.name,
                branch_address:item.address,
                branch_distance:item.distance
            }} type={type} from ={this.query.from}/>)    
            
        }
        let value = this.state.search?"取消":"查询"
        return (
            <div className="ChooseBranch">
                <div className="chooseBranch">
                    <div className="serchBox">
                        <div className="search fs14" >
                            <label>
                                <input type='text' onClick={this.isShowSearch.bind(this,'show')} className="keyword fs14" onInput={this.handleInput.bind(this)} placeholder="请输入查询网点"/>
                            </label>
                            <div className="search_btn" onClick={this.isShowSearch.bind(this,'hide')} >{value}</div>
                        </div>
                    </div>
                    {/* {same_branch} */}
                    {history_branch}
                    <p className="branchTitle">网点列表（{branchList.length}）</p>
                    <div className="branch_list">
                        {list}
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
                </div>
            </div>
        )
    }
}


 
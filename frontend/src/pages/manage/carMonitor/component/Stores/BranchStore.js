/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: BranchStore
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/29-下午2:30
 Description:
 Param:
 Return:
 *************************************************/
import Reflux from 'reflux'
import BranchActions from './BranchActions'
import Branch from "../Class/Branch";
import getApiUrl from "../../js/getApiUrl";
import commonFun from "../../js/commonFunction";
import TrackSearchActions from "./TrackSearchActions";

class BranchStore extends Reflux.Store {
    constructor() {
        super()
        this.listenables = BranchActions
        this.state = {
            // @Array 全部网点列表
            branchList_all:[],
            // @Array 网点列表
            branchList: [],
            // @Object 选中的网点
            activeBranch: {},
            // @Number 网点列表栏页码
            branchListPage: 1,
        }
    }

    onGetBranches(){
        const that = this
        Promise.all(Reflux.GlobalState.trackSearch.search_cityList.map(item => {
            return fetchData({city_id: item.city_id})
        })).then(function(result){
            let list = []
            result.forEach(item => list = list.concat(item))

            this.setState({
                branchList_all: list,
                branchList: list,
            })

            mapControl.drawBranches(list)
            mapControl.hideBranches()

        }.bind(this)).catch(function(err){
            console.error('请求城市列表失败:',err)
        })

        // 分页
        function getData(data){
            data.page = data.hasOwnProperty('page') ? data.page+1 : 1
            return commonFun.post(getApiUrl('tbox/branch-list'),data)
        }
        function fetchData(data){
            const goFetch = function(list) {
                return getData(data).then(function(res) {
                    list = list.concat(res.data.res);
                    if(res.data.res.length === 100) {
                        return goFetch(list);
                    } else {
                        let result = []
                        list.forEach(item=>{
                            item.city_id = data.city_id
                            let branch = new Branch(item)
                            if(branch.inChina()){
                                result.push(branch)
                            }
                        })
                        let city_list = Reflux.GlobalState.trackSearch.search_cityList
                        city_list.find(item => item.city_id == data.city_id).updateBranchCount(result.length)
                        TrackSearchActions.changeState({search_cityList:city_list})
                        return result;
                    }
                });
            }

            return goFetch([]);
        }
    }

    // 获取网点列表
    onSearchBranches(){
        let trackSearch = Reflux.GlobalState.trackSearch
        let search = {
            city_id: trackSearch.search_cityId_branch,
            biz_type: trackSearch.search_biz_type,
            branchName: trackSearch.search_branchName
        }

        let list = this.state.branchList_all.filter(item => {
            return item.match(search)
        })

        this.setState({
            branchList:list
        })
      // 老邢需求，搜索时不隐藏非命中网点
        //mapControl.drawBranches(list)
      mapControl.drawBranches(this.state.branchList_all)
    }

    onChangeActiveBranch(branch){
        this.setState({
            activeBranch:branch
        })
    }

    // 变更当前显示页的车辆（翻页）
    onChangeBranchListPage(page) {
        this.setState({
            branchListPage: page
        })
    }
}

BranchStore.id = 'branch'

export default BranchStore
/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: TrackSearchStore
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/29-下午4:02
 Description:
 Param:
 Return:
 *************************************************/
import Reflux from 'reflux'
import SettingActions from './SettingActions'
import TrackSearchActions from './TrackSearchActions'
import commonFun from '../../js/commonFunction'
import getApiUrl from '../../js/getApiUrl'
import BranchActions from './BranchActions'
import CarActions from './CarActions'

import City from '../Class/City'

class TrackSearchStore extends Reflux.Store {
    constructor() {
        super()
        this.listenables = TrackSearchActions
        this.state = {
            // @Array 搜索栏城市列表
            search_cityList:[],
            // @String 搜索栏类型，0车，1网点
            search_type: '0',
            // @String  轨迹监控模块车辆列表内容选择，'0'：实时监控，'1'；轨迹查询
            carListType: '0',
            // @Number 展示列表默认行数
            itemListShowRow: 10,

            // @String 搜索车辆时城市id，全部为'0'
            search_cityId_car: '0',
            // @String 搜索网点时城市id，全部为'0'
            search_cityId_branch: '0',
            // @String 搜索栏网点类型，全部为''，合作为'1'，非合作为'0'
            search_biz_type: '',
            // @String 搜索栏网点名称，默认为''
            search_branchName: '',
            // @String 搜索栏车辆状态，全部为''
            search_carStatus: '',
            // @String 搜索栏车牌号，默认为''
            search_plateNo: '',
            // @String 搜索栏车辆VIN，默认为''
            search_vin: '',

            track_limit: 3,
            track_start_time: 0,
            track_end_time: 0
        }
    }

    // 请求基础数据城市list
    onGetCityList() {
        commonFun.get(getApiUrl('tbox/group'),{},function(res){
            if(res.data.length>0){
                this.setState({
                    search_cityList: res.data.map(item=>new City(item))
                })

                BranchActions.getBranches()
                CarActions.getCars()

                // 开始定时刷新
                //TrackSearchActions.changeSettings("setting_performance_autoRefresh", true)
            }
        }.bind(this))
    }

    onChangeState(state){
        this.setState(state)
    }

    //切换搜索栏类型
    onChangeSearchType(type){
        SettingActions.changeSettings('setting_layer_showAllCars',type === '0')
        SettingActions.changeSettings('setting_layer_showBranch',type === '1')
        if(type === '1'){
            SettingActions.changeSettings('setting_layer_showPlateNo', false)
        }
        mapControl.hideActiveCarInfoWindow()
        BranchActions.changeActiveBranch({})
        CarActions.changeActiveCar({})
        this.setState({
            search_type: type
        })
    }

    // 改变搜索条件
    onChangeSearchString(type, value) {
        this.setState({[type]: value})
        switch (type){
            case 'search_cityId_car':
            case 'search_carStatus':
            case 'search_plateNo':
            case 'search_vin':
                CarActions.changeCarListPage(1)
                CarActions.searchCars()
                break;
            case 'search_cityId_branch':
            case 'search_biz_type':
            case 'search_branchName':
                BranchActions.changeBranchListPage(1)
                BranchActions.searchBranches()
        }
    }

    // 变更轨迹监控模块车辆列表类型
    onSwitchCarListType(type) {
        if (this.state.carListType !== type) {
            // 每次变更，清空选中车辆
            CarActions.changeActiveCar({})
            mapControl.hideActiveCarInfoWindow()
            this.setState({
                carListType: type
            })
            if(type == '1'){
                // 变成轨迹查询
                SettingActions.changeSettings('setting_layer_showAllCars',false)
                SettingActions.changeSettings('setting_layer_showPlateNo',false)
            }else{
                SettingActions.changeSettings('setting_layer_showAllCars',true)
            }
        }

        return

        // 变更显示的图层
        window.mapControl.toggleMonitorLayerGroup({
            showMonitor: (type === '0'),
            showAllCars: this.state.setting_layer_showAllCars,
            showPlateNo: this.state.setting_layer_showPlateNo,
            showBranch: this.state.setting_layer_showBranch
        })

        // 每次变更如果有停留点显示，则清空显示
        if(type === '0' && this.state.setting_Detained_showTrackStopPoints){
            TrackSearchActions.changeSettings('setting_Detained_showTrackStopPoints', false)
        }

    }

    onSetTrackTime(type, value){
        this.setState({
            ['track_' + type + '_time']: Math.floor(new Date(value).getTime()/1000)
        })
    }
}

TrackSearchStore.id = 'trackSearch'

export default TrackSearchStore
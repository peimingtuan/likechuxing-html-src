/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: ReportStore
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2017/11/29-下午2:59
 Description:
 Param:
 Return:
 *************************************************/
import Reflux from 'reflux'
import ReportActions from '../action/ReportActions.js'
import Time from '../../../../../../js/function/Time'
import commonFun from '../../../js/commonFunction'
import toast from '../../../../../../component/toast'
import getApiUrl from '../../../js/getApiUrl'

export default class ReportStore extends Reflux.Store {
    constructor() {
        super()
        this.listenables = ReportActions
        this.state = {
            // @Array 统计报表目录栏
            report_menus:[
                {id: '0', name: '围栏报警'},
                {id: '1', name: '轨迹停留点'}
            ],
            // @String 默认/当前激活的目录index
            activeMenuIndex: '1',
            // @Boolean 菜单是否折叠
            isMenuFold: false,

            // @String 轨迹停留点查询字段
            trackStop_queryString: '',
            // @String 查询日期
            trackStop_date: new Time().getTime('YYYY-MM-DD'),
            // @Array 停留点列表
            track_stopPoints:[]
        }
    }

    // 改变目录栏目 Param:@String 目录id
    onChangeMenuIndex(index){
        this.setState({activeMenuIndex: index})
    }

    // 折叠/打开菜单栏
    onSwitchMenuFold(){
        this.setState({isMenuFold: !this.state.isMenuFold})
    }

    // 改变停留点查询字段
    onChangeTrackStopQueryString(string){
        this.setState({trackStop_queryString: string})
    }

    // 改变停留点查询时间
    onChangeTrackStopDate(date){
        this.setState({trackStop_date: date})
    }

    // 搜索停留点
    onSearchTrackStop(){
        let chosenDate = new Date(this.state.trackStop_date + ' 00:00:00').getTime() / 1000

        commonFun.post(getApiUrl('tbox/get-history'),{
            plate_no: this.state.trackStop_queryString,
            start_time: chosenDate,
            end_time: chosenDate + 86400,
        }).then(function(res){
            // 处理停留点
            if(res.data.staycount > 0){
                let location = res.data.staypoint.map(item => {
                    return [item.stay_point.longitude, item.stay_point.latitude]
                })

                window.mapControl.getAddress(location, function(result){
                    let points = res.data.staypoint.map((item,index)=>{
                        return {
                            index: index+1,
                            stay_time: new Time(item.start_time).getTime('hh:mm:ss')+' - '+new Time(item.end_time).getTime('hh:mm:ss'),
                            duration: new Time().duration(item.duration),
                            address:result.regeocodes[index].formattedAddress
                        }
                    })
                    this.setState({track_stopPoints: points})
                }.bind(this))
            }else{
                toast('当前车辆未查询到有效停留点')
            }
        }.bind(this))
    }
}
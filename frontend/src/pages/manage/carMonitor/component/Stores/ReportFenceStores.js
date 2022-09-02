/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: ReportFenceStores
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/3/1-下午4:28
 Description:
 Param:
 Return:
 *************************************************/
import Reflux from 'reflux'
import ReportFenceActions from './ReportFenceActions'
import commonFun from "../../js/commonFunction";
import Time from '../../../../../js/function/Time'
import getApiUrl from "../../js/getApiUrl";
import toast from "../../../../../component/toast";
import Fence from "../Class/Fence";

class ReportFenceStore extends Reflux.Store {
  constructor() {
    super()
    this.listenables = ReportFenceActions
    this.state = {
      alarmList:[],
      alarm_city_id: '0',
      alarm_type: '0',
      alarm_plate_no: '',
      alarm_time_start: '',
      alarm_time_end: '',

      alarmWindowList:[],
      alarm_show_time_start:0
    }
  }

  onChangeState(data) {
    this.setState(data)
  }

  onGetAlarmList() {
    let data = {
      see_type: 0,
      start_time: new Date(this.state.alarm_time_start).getTime() / 1000,
      end_time: new Date(this.state.alarm_time_end).getTime() / 1000,
    }
    if (this.state.alarm_city_id !== '0') {
      data.city_id = this.state.alarm_city_id
    }
    if (this.state.alarm_action !== '0') {
      data.alarm_action = this.state.alarm_type
    }
    if (this.state.alarm_plate_no) {
      data.plate_no = this.state.alarm_plate_no
    }
    let that = this
    fetchData(data).then(function (res) {
      if(that.state.alarmList.length === 0 && res.length === 0){
        toast('该筛选条件未查询到报警')
      }
      that.setState({
        alarmList: res
      })
    })

    // 分页
    function getData(data) {
      data.status = 0
      data.page = data.hasOwnProperty('page') ? data.page + 1 : 1
      return commonFun.post(getApiUrl('/tbox/alarm-list'), data)
    }

    function fetchData(data) {
      const goFetch = function (list) {
        return getData(data).then(function (res) {
          list = list.concat(res.data.data);
          if (res.data.data.length === 100) {
            return goFetch(list);
          } else {
            return list;
          }
        });
      }
      return goFetch([]);
    }
  }

  onSaveAlarmList(){
    let data = {
      see_type: 0,
      start_time: new Date(this.state.alarm_time_start).getTime() / 1000,
      end_time: new Date(this.state.alarm_time_end).getTime() / 1000,
    }
    if(data.end_time-data.start_time>86400*6){
      toast('最长可导出6天数据，请修改时间')
      return
    }
    if (this.state.alarm_city_id !== '0') {
      data.city_id = this.state.alarm_city_id
    }
    if (this.state.alarm_action !== '0') {
      data.alarm_action = this.state.alarm_type
    }
    if (this.state.alarm_plate_no) {
      data.plate_no = this.state.alarm_plate_no
    }
    commonFun.open(getApiUrl('/tbox/export-alarm-list'),data)
  }

  onGetAlarmWindowList(){
    let start_time = this.state.alarm_show_time_start
    if(start_time === 0){
      start_time = Math.floor(new Date().getTime()/1000) - 86400*3
      this.setState({
        alarm_show_time_start: start_time
      })
    }
    let data = {
      see_type: 1,
      start_time:start_time,
      end_time: Math.floor(new Date().getTime() / 1000)
    }

    let that = this
    commonFun.post(getApiUrl('/tbox/alarm-list'), data).then(function (res) {
      if(res.status === 0){
        that.setState({
          alarmWindowList: res.data.data
        })
      }
    })
  }

  onHideAlarm(ids){
    let that = this
    commonFun.post(getApiUrl('/tbox/hidden-alarm'), {
      ids:JSON.stringify(ids)
    }).then(function(res){
      that.setState({
        alarmWindowList: that.state.alarmWindowList.filter(item=>ids.indexOf(item.id) === -1)
      })
    })
  }
}

ReportFenceStore.id = 'report'

export default ReportFenceStore
/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: SettingStore
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/30-下午6:53
 Description:
 Param:
 Return:
 *************************************************/
import Reflux from 'reflux'
import SettingActions from './SettingActions'
import HeaderActions from './HeaderActions'
import CarActions from './CarActions'
import ReportFenceActions from "./ReportFenceActions";

class SettingStore extends Reflux.Store {
  constructor() {
    super()
    this.listenables = SettingActions
    this.state = {
      // @Boolean 设置-图层-显示全部车辆
      setting_layer_showAllCars: true,
      // @Boolean 设置-图层-是否以车形图标进行海量点绘制
      setting_layer_useCarIcon: true,
      // @Boolean 设置-图层-显示车牌
      setting_layer_showPlateNo: false,
      // @Boolean 设置-图层-显示网点
      setting_layer_showBranch: false,
      // @Boolean 设置-轨迹-轨迹纠偏
      setting_track_processed: false,
      // @Boolean 设置-轨迹-去噪绑路
      setting_track_mapMatch: false,
      // @Boolean 设置-轨迹-里程补偿
      setting_track_supplement: false,
      // @Boolean 设置-停留点-是否显示停留点
      setting_Detained_showTrackStopPoints: false,
      // @Boolean 设置-性能-自动刷新
      setting_performance_autoRefresh: false
    }
  }

  // 变更设置的值
  onChangeSettings(type, value) {
    this.setState({[type]: value})
    switch (type) {
      case 'setting_layer_useCarIcon':
        window.mapControl.drawCars(Reflux.GlobalState.car.carList)
        break;
      case 'setting_layer_showAllCars':
        if (value) {
          mapControl.showCars()
        } else {
          mapControl.hideCars()
        }
        break;
      case 'setting_layer_showPlateNo':
        if (value) {
          mapControl.drawPlateNo(Reflux.GlobalState.car.carList)
        } else {
          mapControl.destroyPlateNo()
        }
        break;
      case 'setting_layer_showBranch':
        if (value) {
          mapControl.showBranches()
        } else {
          mapControl.hideBranches()
        }
        break;
      case "setting_Detained_showTrackStopPoints":
        if (value) {
          mapControl.drawStopPoints(Reflux.GlobalState.car.track.staypoint)
        } else {
          mapControl.destroyStopPoints()
        }
        break;
      case "setting_performance_autoRefresh":
        if (value) {
          HeaderActions.updateClockPointDeg(0)
          CarActions.updateCars()
          ReportFenceActions.getAlarmWindowList()
          this.setState({
            autoRefreshCars_timer: setInterval(function () {
              // 更新车辆列表
              CarActions.updateCars()
              // 请求报警列表
              ReportFenceActions.getAlarmWindowList()
              // 计时器角度矫正
              HeaderActions.updateClockPointDeg(0)
            }, 60 * 1000)
          })
        } else {
          clearInterval(this.state.autoRefreshCars_timer)
        }
        break;
    }

  }
}

SettingStore.id = 'setting'

export default SettingStore
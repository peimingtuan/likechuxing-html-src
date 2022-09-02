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
import CarActions from './CarActions'
import SettingActions from './SettingActions'
import Car from "../Class/Car";
import Track from '../Class/Track'
import getApiUrl from "../../js/getApiUrl";
import commonFun from "../../js/commonFunction";
import TrackSearchActions from "./TrackSearchActions";

import toast from "../../../../../component/toast";

class CarStore extends Reflux.Store {
  constructor() {
    super()
    this.listenables = CarActions
    this.state = {
      // @Array 所有车辆列表
      carList_all: [],
      // @Array 当前车辆列表
      carList: [],
      // @Object 选中的车
      activeCar: {},
      // @Number 左侧栏展示出来的车辆列表页码
      carListPage: 1,
      track: new Track()
    }
  }

  onGetCars() {
    let that = this
    this.fetchCarsData(function (list) {
      that.setState({
        carList_all: list,
        carList: list
      })

      window.mapControl.drawCars(that.state.carList)
      SettingActions.changeSettings('setting_performance_autoRefresh', true)
    })
  }

  onUpdateCars() {
    let that = this
    this.fetchCarsData(function (list) {
      let carList_all = []
      that.state.carList_all.forEach(item => {
        let new_car = list.find(car => item.id === car.id)
        if (new_car) {
          item.update(new_car)
        }
        carList_all.push(item)

      })
      that.setState({
        carList_all
      })

      CarActions.searchCars()
    })
  }

  fetchCarsData(cb) {
    let citys = Reflux.GlobalState.trackSearch.search_cityList
    Promise.all(citys.map(item => {
      return commonFun.post(getApiUrl('tbox/car-list'), {
        city_id: item.city_id
      })
    })).then(function (result) {
      let list = []
      result.forEach((res, index) => {
        if(res.status === 0){
          res.data.forEach(item=>{
            item.city_id = citys[index].city_id
            let _car = new Car(item)
            if(_car.inChina()){
              list.push(_car)
            }
          })
        }
      })
      cb(list)
    }.bind(this)).catch(function (err) {
      console.error('获取车辆失败', err)
    })

    // 分页
    function getData(data) {
      data.page = data.hasOwnProperty('page') ? data.page + 1 : 1
      return commonFun.post(getApiUrl('tbox/car-list'), data)
    }

    function fetchData(data) {
      const goFetch = function (list) {
        return getData(data).then(function (res) {
          list = list.concat(res.data.res);
          if (res.data.res.length === 1000) {
            return goFetch(list);
          } else {
            let result = []
            list.forEach(item => {
              item.city_id = data.city_id
              let car = new Car(item)
              if (car.inChina()) {
                result.push(car)
              }
            })
            let city_list = Reflux.GlobalState.trackSearch.search_cityList
            city_list.find(item => item.city_id == data.city_id).updateCarCount(result.length)
            TrackSearchActions.changeState({search_cityList: city_list})
            return result;
          }
        });
      }
      return goFetch([]);
    }
  }

  // 搜车
  onSearchCars() {
    let trackSearch = Reflux.GlobalState.trackSearch
    let search = {
      city_id: trackSearch.search_cityId_car,
      status: trackSearch.search_carStatus,
      plate_no: trackSearch.search_plateNo,
      vin: trackSearch.search_vin
    }

    let list = this.state.carList_all.filter(item => {
      return item.match(search)
    })

    this.setState({
      carList: list
    })
    //this.onChangeCarListPage(1)
    mapControl.updateCars(list)
  }

  onChangeActiveCar(car) {
    this.setState({
      activeCar: car
    })

    if (Reflux.GlobalState.trackSearch.carListType === '1') {
      // 轨迹
      mapControl.destroyCarTrack()
      this.setState({
        track: new Track()
      })
    }
  }

  // 变更当前显示页的车辆（翻页）
  onChangeCarListPage(page) {
    this.setState({
      carListPage: page
    })
  }

  // 查询单车轨迹
  onSearchTrack() {
    let trackSearch = Reflux.GlobalState.trackSearch
    if ((trackSearch.track_end_time - trackSearch.track_start_time) < 0) {
      toast('结束时间必须大于开始时间')
      CarActions.changeActiveCar({})
      return
    }
    if ((trackSearch.track_end_time - trackSearch.track_start_time) > (86400 * trackSearch.track_limit)) {
      toast('最长可查询' + trackSearch.track_limit + '天数据')
      CarActions.changeActiveCar({})
      return
    }

    let time = [[trackSearch.track_start_time, trackSearch.track_end_time]]
    while ((time[time.length - 1][1] - time[time.length - 1][0]) > 86400) {
      let end_time = time[time.length - 1][1]
      time[time.length - 1][1] = time[time.length - 1][0] + 86400
      time.push([time[time.length - 1][1], end_time])
    }

    Promise.all(time.map(item => {
      return fetchData({
        car_id: this.state.activeCar.id,
        start_time: item[0],
        end_time: item[1]
      })
    })).then(function (result) {
      let track = new Track()
      result.forEach(item => {
        track.append(item)
      })
      console.log(track)
      // 处理轨迹
      if (track.points.length > 2) {
        CarActions.saveCarTrack(track)
      } else {
        toast('当前选定车辆暂无轨迹数据，请尝试变更日期')
      }
    }.bind(this)).catch(function (err) {
      console.error('获取车辆轨迹失败', err)
    })
    let that = this

    // 处理停留点
    /*
    if(res.data.staycount > 0){
        this.setState({track_stopPoints: res.data.staypoint})
    }
    */

    // 分页
    function getData(data) {
      data.page = data.hasOwnProperty('page') ? data.page + 1 : 1
      return commonFun.post(getApiUrl('tbox/get-history'), data)
    }

    function fetchData(data) {
      const goFetch = function (track) {
        return getData(data).then(function (res) {
          track.append(new Track(res.data))
          /*该接口不分页
          if (res.data.track.length < 1000) {
              return store;
          } else {
              return goFetch(store);
          }
          */
          return track;
        });
      }
      return goFetch(new Track());
    }
  }

  // 存储单车轨迹点，从查询轨迹分出来是为了后边TimeLine组件能够listen执行响应
  onSaveCarTrack(track) {
    this.setState({
      track: track
    })
    window.mapControl.drawCarTrack(track.points)
  }

  // 仅作为listen用的桥梁，不含逻辑
  onNavigateMove(time) {
  }
}

CarStore.id = 'car'

export default CarStore

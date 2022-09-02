/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: FenceStore
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/2/24-下午4:22
 Description:
 Param:
 Return:
 *************************************************/
import Reflux from 'reflux'
import FenceActions from './FenceActions'
import commonFun from "../../js/commonFunction";
import getApiUrl from "../../js/getApiUrl";
import City from '../Class/City'
import Fence from '../Class/Fence'
import TrackSearchActions from "./TrackSearchActions";
import Car from "../Class/Car";
import toast from "../../../../../component/toast";
import ConfigActions from "./ConfigActions";

class FenceStore extends Reflux.Store {
  constructor() {
    super()
    this.listenables = FenceActions
    this.state = {
      fence_cityList: [],
      fence_supplier: [],
      fenceList_all: [],
      fenceList: [],
      fenceShowType: 'new',

      fence_name: '',
      fence_cityId: '0',
      fence_type: '0',
      fence_time_start: '00:00',
      fence_time_end: '24:00',
      fence_remark: '',
      fence_points: [],
      currentFence: null,

      fenceCarsList: [],

      filter_city_id:'0',
      filter_fence_status:'0',
      filter_fence_name:''
    }
  }

  onChangeState(key, value) {
    this.setState({
      [key]: value
    })
  }

  onGetCitys() {
    let that = this
    commonFun.post(getApiUrl('tbox/supplier-city'), {}).then(
      function (res) {
        if (res.status === 0) {
          that.setState({
            fence_cityList: res.data.city.map(item => new City({
              city_id: item.id,
              name: item.name
            })),
            fence_supplier: res.data.supplier
          })
          that.getFences(function (list) {
            that.setState({
              fenceList_all: list,
              fenceList: list
            })
          })
        }
      }
    )
  }

  getFences(cb) {
    Promise.all(this.state.fence_cityList.map(item => {
      return fetchData({city_id: item.city_id})
    })).then(function (result) {
      let list = []
      result.forEach(item => list = list.concat(item))
      cb(list)
    }.bind(this)).catch(function (err) {
      console.error('获取围栏列表失败', err)
    })

    // 分页
    function getData(data) {
      data.status = 0
      data.page = data.hasOwnProperty('page') ? data.page + 1 : 1
      return commonFun.post(getApiUrl('tbox/get-fence-list'), data)
    }

    function fetchData(data) {
      const goFetch = function (list) {
        return getData(data).then(function (res) {
          list = list.concat(res.data.data);
          if (res.data.data.length === 20) {
            return goFetch(list);
          } else {
            let result = []
            list.forEach(item => {
              item.city_id = data.city_id
              result.push(new Fence(item))
            })
            return result;
          }
        });
      }
      return goFetch([]);
    }
  }

  onSave() {
    let data = {
      fence_name: this.state.fence_name,
      fence_remark: this.state.fence_remark,
      fence_type: this.state.fence_type,
      city_id: this.state.fence_cityId,
      start_time: new Date('1970-1-1 ' + this.state.fence_time_start).getTime() / 1000 + 28800,
      end_time: new Date('1970-1-1 ' + this.state.fence_time_end).getTime() / 1000 + 28800,
      coord_ids: JSON.stringify(this.state.fence_points.map(item => {
        if (item.lat) {
          return item.lat + ',' + item.lng
        } else {
          return item[1] + ',' + item[0]
        }
      }))
    }

    let that = this
    let url = '/tbox/create-fence'
    if (this.state.fenceShowType !== 'new') {
      url = '/tbox/update-fence'
      data.fence_id = this.state.currentFence.id
    }
    commonFun.post(getApiUrl(url), data).then(function (res) {
      if (res.status === 0) {
        that.getFences(function (list) {
          that.setState({
            fenceList_all: list,
            fenceList: list
          })
          ConfigActions.changeCurrentPath('/fence')
        })
      } else {
        toast(res.msg)
      }
    })
  }

  onEnableFence(id) {
    let that = this
    commonFun.post(getApiUrl('/tbox/control-fence'), {id: id, status: '1'}).then(function (res) {
      if (res.status === 0) {
        that.getFences(function (list) {
          that.setState({
            fenceList_all: list,
            fenceList: list
          })
        })
      } else {
        toast(res.msg)
      }
    })
  }

  onDisableFence(id) {
    let that = this
    commonFun.post(getApiUrl('/tbox/control-fence'), {id: id, status: '0'}).then(function (res) {
      if (res.status === 0) {
        that.getFences(function (list) {
          that.setState({
            fenceList_all: list,
            fenceList: list
          })
        })
      } else {
        toast(res.msg)
      }
    })
  }

  onGetFenceDetail(id, cb) {
    let that = this
    commonFun.post(getApiUrl('/tbox/fence-detail'), {id: id}).then(function (res) {
      if (res.status === 0) {
        that.setState({
          currentFence: new Fence(res.data),
          fence_name: res.data.fence_name,
          fence_cityId: res.data.city_id,
          fence_type: res.data.fence_type,
          fence_time_start: timeStamp2min(res.data.start_time),
          fence_time_end: timeStamp2min(res.data.end_time),
          fence_remark: res.data.fence_remark,
          fence_points: coord2points(res.data.coord_ids)
        })
        cb()
      } else {
        toast(res.msg)
      }
    })
  }

  onClearFence() {
    this.setState({
      currentFence: null,
      fence_name: '',
      fence_cityId: '0',
      fence_type: '0',
      fence_time_start: '00:00',
      fence_time_end: '24:00',
      fence_remark: '',
      fence_points: []
    })
  }

  getFenceCars(data) {
    let that = this
    fetchData(data).then(function (res) {
      that.setState({
        fenceCarsList: res
      })
    })

    function getData(data) {
      data.status = 0
      data.page = data.hasOwnProperty('page') ? data.page + 1 : 1
      return commonFun.post(getApiUrl('tbox/fence-car-list'), data)
    }

    function fetchData(data) {
      const goFetch = function (list) {
        return getData(data).then(function (res) {
          list = list.concat(res.data.res);
          if (res.data.res.length === 500) {
            return goFetch(list);
          } else {
            return list;
          }
        });
      }
      return goFetch([]);
    }
  }

  onSaveFenceCars(data, cb) {
    commonFun.post(getApiUrl('/tbox/edit-car-fence'), data).then(function (res) {
      if (res.status === 0) {
        toast('保存成功')
        cb()
      } else {
        toast(res.msg)
      }
    })
  }

  onChangeFilter(key, value){
    let filter = {
      city_id:this.state.filter_city_id,
      fence_name:this.state.filter_fence_name,
      fence_status:this.state.filter_fence_status
    }
    filter[key] = value
    let list = this.state.fenceList_all.filter(item=>{
      if(filter.city_id !== '0'){
        if(item.city_id !== filter.city_id){
          return false
        }
      }
      if(filter.fence_name !== ''){
        if(!new RegExp(filter.fence_name).test(item.name)){
          return false
        }
      }
      if(filter.fence_status !== '0'){
        if(Number(filter.fence_status) !== Number(item.status)+1){
          return false
        }
      }

      return true
    })
    this.setState({
      ['filter_'+key]:value,
      fenceList: list
    })
  }
}

function timeStamp2min(timeStamp) {
  let h = Math.floor(timeStamp / 3600)
  let min = Math.floor(timeStamp % 3600 / 60)
  if (h < 10) {
    h = '0' + h
  }
  if (min < 10) {
    min = '0' + min
  }
  return h + ':' + min
}

function coord2points(str) {
  let _str = str.replace(/"/g, '')
  return _str.split(';').map(item => {
    let _point = item.split(',')
    return [_point[1], _point[0]]
  })
}

FenceStore.id = 'fence'

export default FenceStore
/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: store
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/10/12-上午10:54
 Description:
 Param:
 Return:
 *************************************************/
import Vue from 'vue'
import Vuex from 'vuex'
import myAjax from "../../../../../other_modules/like-request/withAxiosV2";
import {mapControl} from "./mapControl";
import {getAdminUrl} from "./getAdminUrl";
import Lnglat from "../../../../../other_modules/like-model/models/Lnglat";
import Bounds from "../../../../../other_modules/like-model/models/Bounds";
import Rect from '../module/class.rect'

Vue.use(Vuex)

const store = new Vuex.Store({

  state: {
    // 0初始 1地图加载完 2获得网点数据了
    step: 0,

    // 0查看 1新建编辑片区
    mode: 0,
    uuid: '',
    sign: '',
    city_list: [],
    city_id: '',
    branches: [],
    areas: [],
    rects: [],

    active_area: {},

    modules: ['搜索', '统计'],
    checkedModules: ['搜索'],

    // 网点过滤器
    filterList: ['0', '1'],

    // 网格过滤器
    activeRects: [],

    color_body: '#15bdf4',
    color_border: '#15bdf4',

    // 正在标记的方格id
    remark_rect_id: 0,

    // 过滤显示当前的方格 0全部 1无网点 2有网点
    rects_filter_type:0,

    // 当前显示的网点
    current_branch:null,

    // 是否显示数据表格
    dataTableShow:false

  },
  getters: {
    branches_after_filter (state) {
      return state.branches.filter(item => state.filterList.includes(item.biz_type))
    }
  },
  mutations: {
    setDataTableShow(state,val){
      state.dataTableShow = val
    },
    setCurrentBranch(state,branch){
      state.current_branch = branch
    },
    setRectsFilterType(state,type){
      state.rects_filter_type = type
      mapControl.rectsStrong(type)
    },
    setStep(state,step){
      state.step = step
    },
    setInit (state, data) {
      state.city_list = data.city_list
    },
    setCityId (state, id) {
      state.city_id = id
      state.step = 1
    },
    setBranches (state, branches) {
      state.branches = branches
      state.step = 2
    },
    setBranch(state,branch){
      state.active_branch = branch
    },
    setAreas (state, areas) {
      state.areas = areas.map(item => {
        item.id = Number(item.id)
        return item
      })

      // 计算片区到方格
      state.areas.forEach(item => {
        // 片区有设置方格
        if (item.rect_ids) {
          state.rects.forEach(rect => {
            if (item.rect_ids.includes(String(rect.id))) {
              rect.setArea({
                id: item.id,
                color: item.color,
                color_border: item.color_border
              })
            }
          })
        }
      })
    },
    setRects (state, rects) {
      state.rects = rects
    },
    setCheckedModules (state, val) {
      state.checkedModules = val
    },
    setFilterList (state, list) {
      state.filterList = list
    },

    setMode (state, mode) {
      state.mode = mode
    },
    setColor (state, color) {
      if (color.hasOwnProperty('color_body')) state.color_body = color.color_body
      if (color.hasOwnProperty('color_border')) state.color_border = color.color_border
    },
    setRemarkRectId (state, id) {
      state.remark_rect_id = id
    },
    setAreaId (state, id) {
      console.log(id)
      let area = state.areas.find(item => item.id === id)
      state.active_area = area ? area : {}
    },
    deleteArea (state, id) {
      let areas = state.areas.concat()
      state.areas = areas.filter(item => item.id !== id)
    },

    setHotData (state, data) {
      data.forEach(item => {
        item.branch.forEach(branch => {
          branch.count = branch.number
        })
      })
      state.hotData = data
    },
    setShowSlider (state, val) {
      state.show_slider = val
    },
    setCurrentTime (state, time) {
      state.current_time = time
    },

  },
  actions: {
    setCity ({state, getters, commit, dispatch}, id) {
      commit('setCityId', id)

      let city = state.city_list.find(item => item.id === id)
      // 拖动地图
      mapControl.setCity([city.lng,city.lat])
      // 隐藏方块
      mapControl.clearArea()

      return Promise.all([dispatch('getBranch', city), dispatch('getAreas', city)]).then(() => {
        mapControl.drawBranches(getters.branches_after_filter)
      }).then(() => {
        dispatch('calBranchOutArea')
        let branches = state.branches.concat()

        let length = state.rects.length
        branches.forEach(branch=>{
          for(let i=0;i<length;i++){
            if(state.rects[i].inBounds(new Lnglat(branch.lng,branch.lat))){
              state.rects[i].branches.push(branch)
              break;
            }
          }
        })
        return mapControl.drawRects(state.rects)
      })
    },

    calBranchOutArea ({state}) {
      let length = state.rects.length
      let bounds = new Bounds(state.rects[0].southWest, state.rects[length - 1].northEast)
      if (state.branches.some(item => !bounds.inBounds(new Lnglat(item.lng, item.lat)))) {

        myAjax.get(getAdminUrl('/branch-area/make-area?city_id='+state.city_id)).then(res=>{
          console.log('检测到范围外网点，铺设结果：',res)
        })
      }
    },

    getBranch ({state, commit}, city) {
      return myAjax.post(getAdminUrl('/branch-area/get-branches'), {
        city_id: city.id
      }).then(res => {
        commit('setBranches', res.data)
      })
    },

    getAreas ({state, commit}, city) {

      return myAjax.post(getAdminUrl('/branch-area/get-areas-by-city-id'), {
        city_id: city.id
      }).then(res => {

        commit('setRects', res.data.rects.map(item => {
          return new Rect(item.id, {
            southWest: new Lnglat(item.southWest.lng, item.southWest.lat),
            northEast: new Lnglat(item.northEast.lng, item.northEast.lat)
          })
        }))

        commit('setAreas', res.data.areas)
      })
    },

    getCityList ({state, commit}) {
      return myAjax.get(getAdminUrl('/tbox/get-allow-city'), {
        uuid: state.uuid,
        sign: state.sign
      }).then(res => {
        if (res.status === 0) {
          commit('setCityList', res.data)
        } else {
          throw res
        }
      })
    },

    getBranches ({state, commit}, city_id) {
      return myAjax.get(getAdminUrl('/tbox/time-branch-list'), {
        uuid: state.uuid,
        sign: state.sign,
        city_id
      }).then(res => {
        if (res.status === 0) {
          commit('setBranches', res.data)
        } else {
          throw res
        }
      })
    },

    myAjax ({state, getters}, arg) {
      arg.url = arg.url.replace('https://admintest.likechuxing.com', 'https://admin.likechuxing.com')
      return myAjax.post(arg.url, Object.assign(getters.publicArguments, arg.data)).then(res => {
        if (res.status === 6001) {
          // 登录过期
          window.vue.$message('登录过期，请重新登录')
          throw {status: 6001}
        } else {
          return res
        }
      })
    },

    setCurrentCity ({state, commit, dispatch}, data) {
      commit('setCurrentCity', data)
      dispatch('getCurrentData', data.id)
      mapControl.setCity([data.lng, data.lat])
    },
    getCurrentData ({state, commit, dispatch}, city_id) {
      return dispatch('myAjax', {
        url: getAdminUrl('/dispatch/demand-supply?type=data&city_id=' + city_id),
        data: {}
      }).then(res => {
        if (res.data.data.length === 0) {
          throw {status: 1, msg: '车辆供应数据查询出错，请检查'}
        }
        if (res.data.heat_map.length === 0) {
          throw {status: 1, msg: '车辆需求预测查询出错，请检查'}
        }

        commit('setBranches', res.data.data)
        commit('setArea', res.data.heat_map)
        commit('control/setDataReady', true)

      })
    },
    getCurrentCars ({state, commit, dispatch}) {
      return dispatch('myAjax', {
        url: getAdminUrl('/tbox/car-list'),
        data: {
          city_id: 197
        }
      }).then(res => {
        mapControl.drawHot(res.data)

      })
    }
  }
})

export default store
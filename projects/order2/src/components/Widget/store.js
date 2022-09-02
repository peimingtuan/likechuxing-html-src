export default {
  namespaced: true,
  state: {
    // 显示立刻还说明
    show_explain:false,
    // 显示车辆信息
    show_carInfo:false,
    // 跳转到导航软件
    show_callNavApp:false,
    lat:'',
    lng:'',
    // 取消订单
    show_cancelBox:false,
  },
  mutations: {
    toggleBranchExplain(state){
      state.show_explain = !state.show_explain
    },
    toggleCarInfo(state){
      state.show_carInfo = !state.show_carInfo
    },
    toggleCallNavApp(state,data){
      state.show_callNavApp = !state.show_callNavApp
      if(data){
        state.lat=data.lat
        state.lng=data.lng
      }
    },
    toggleCancelBox(state){
      state.show_cancelBox = !state.show_cancelBox
    }
  },
  actions: {
    toggle(store, type){
      switch (type){
        case 'branchExplain':
          store.commit('toggleBranchExplain')
          break;
        case 'carInfo':
          store.commit('toggleCarInfo')
          break;
        case 'callNavApp':
          store.commit('toggleCallNavApp')
          break;
        case 'cancelBox':
          store.commit('toggleCancelBox')
          break;
        case 'floorPicker':
          store.commit('toggleFloorPicker')
          break;
        default:
      }
    }
  }
}

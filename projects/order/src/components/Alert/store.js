export default {
  namespaced: true,
  state: {
    mold: 'none',
    icon: '',
    title: '',
    msg: '',
    toastCallback: function () {},
    confirmButtonText: '确定',
    confirmButtonCallback: function () {},
    cancelButtonText: '取消',
    cancelButtonCallback: function () {}
  },
  mutations: {
    showToast (state, opt) {
      state.mold = opt.mold
      state.msg = opt.msg
      state.toastCallback = opt.toastCallback
    },
    showTips (state, opt) {
      state.mold = opt.mold
      state.msg = opt.msg
    },
    showAlert (state, opt) {
      for (let key in opt) {
        state[key] = opt[key]
      }
    },
    showConfirm (state, opt) {
      for (let key in opt) {
        state[key] = opt[key]
      }
    },
    hideAll (state) {
      let defalutState = {
        mold: 'none',
        title: '',
        msg: [],
        toastCallback: function () {},
        confirmButtonText: '确定',
        confirmButtonCallback: function () {},
        cancelButtonText: '取消',
        cancelButtonCallback: function () {}
      }
      for (let key in defalutState) {
        state[key] = defalutState[key]
      }
    }
  },
  actions: {
    show (store, opt) {
      let mold = opt.mold
      let data = Object.assign({}, store.state, opt)
      switch (mold) {
        case 'toast':
          store.commit('showToast', data)
          setTimeout(() => {
            store.state.toastCallback()
            store.commit('hideAll')
          }, 2000)
          break
        case 'tips':
          store.commit('showTips', data)
          setTimeout(() => {
            store.commit('hideAll')
          }, 2500)
          break
        case 'alert':
          store.commit('showAlert', data)
          break
        case 'confirm':
          store.commit('showConfirm', data)
          break
        default :
          store.commit('hideAll')
      }
    }
  }
}

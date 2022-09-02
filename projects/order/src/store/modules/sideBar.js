/**
 * Created by garvey on 2017/6/21.
 */
export default {
  namespaced: true,
  state: {
    open: false
  },
  mutations: {
    openSideBar: state => {
      state.open = true
    },
    close: state => {
      state.open = false
    }
  },
  actions: {
    closeSideBar (store) {
      store.commit('close')
    },
    openSideBar (store) {
      store.dispatch('user/getMenuInfo', function () {
        store.commit('openSideBar')
      }, {root: true})
    }
  }
}

/**
 * Created by garvey on 2017/6/21.
 */
export default {
  namespaced: true,
  state: {
    open: false
  },
  mutations: {
    toggleSideBar (state) {
      state.open = !state.open
    }
  },
  actions: {
    toggleSideBarAsync (store) {
      setTimeout(function () {
        store.commit({
          type: 'toggleSideBar'
        })
      }, 200)
    }
  }
}

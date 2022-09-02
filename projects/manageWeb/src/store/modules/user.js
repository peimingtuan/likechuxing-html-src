/**
 * Created by garvey on 2017/6/27.
 */
export default {
  namespaced: true,
  state: {
    isLogin: false,
    uid: 0,
    key: ''
  },
  getters: {
    getUser (state) {
      if (!state.isLogin) {
        return false
      }

      return {
        uid: state.uid,
        key: state.key
      }
    }
  },
  mutations: {
    login (state, data) {
      state.isLogin = true
      state.uid = data.uid
      state.key = data.key
    },
    logout (state) {
      state.isLogin = false
      state.uid = 0
      state.key = ''
    }
  },
  actions: {}
}

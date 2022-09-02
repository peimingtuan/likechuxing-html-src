/**
 * Created by garvey on 2017/8/28.
 */
export default {
  namespaced: true,
  state: {
    way_list: [],
    chosen: ''
  },
  mutations: {
    init (state, data) {
      data.forEach(item => {
        state.way_list.push(item)
      })
      state.chosen = data[0]
    },
    change (state, data) {
      state.chosen = data
    }
  },
  actions: {}
}

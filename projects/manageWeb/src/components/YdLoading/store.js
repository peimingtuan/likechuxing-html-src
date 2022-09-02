/**
 * Created by garvey on 2017/6/23.
 */
export default {
  namespaced: true,
  state: {
    isShow: false,
    text: '加载中...',
    needPreventEvent: false
  },
  mutations: {
    show (state, opt) {
      // 如果有正在显示的loading，则不重复显示
      if (state.isShow) {
        return
      }

      state.isShow = true
      state.text = opt.text || '加载中...'
      state.needPreventEvent = opt.needPreventEvent || false
    },
    hide (state) {
      state.isShow = false
      state.text = '加载中...'
      state.needPreventEvent = false
    }
  },
  actions: {}
}

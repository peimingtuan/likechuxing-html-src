/**
 * Created by garvey on 2017/6/23.
 */
export default {
  namespaced: true,
  state: {
    isShow: false,
    kind: 0,
    text: '加载中...',
    needPreventEvent: false
  },
  mutations: {
    show (state, opt) {
      // 如果有正在显示的loading，只更新文字
      if (state.isShow) {
        state.text = opt.text || '加载中...'
      }
      state.kind = opt.kind || 0
      state.isShow = true
      state.text = opt.text || '加载中...'
      state.needPreventEvent = opt.preventEvent || false
    },
    hide (state) {
      state.isShow = false
      state.text = '加载中...'
      state.needPreventEvent = false
    }
  },
  actions: {}
}

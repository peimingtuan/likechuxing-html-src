
//展示Loading
store.commit('YdLoading/show',{
  text: '加载中...',//选填，展示的文字，default: '加载中...'
  preventEvent: false//选填，是否加载全屏fixed透明层,阻止点击滑动等事件，default: false
});

//隐藏Loading
store.commit('YdLoading/hide')


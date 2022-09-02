/**
 * Created by garvey on 2017/8/25.
 */
import Index from '../../pages/main/index.vue'
import SideBar from '../../pages/main/sideBar.vue'

export default [
  {
    name: 'main',
    path: '/main/index',
    meta: {
      title: '立刻出行',
      needAuth: true
    },
    components: {
      sideBar: SideBar,
      mainView: Index
    }
  }
]

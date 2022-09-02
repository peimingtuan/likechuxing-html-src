/**
 * Created by garvey on 2017/8/28.
 */
import Login from '../../pages/user/login.vue'
import License from '../../pages/user/license.vue'

export default [
  {
    name: 'login',
    path: '/user/login',
    meta: {
      title: '手机登录'
    },
    components: {
      mainView: Login
    }
  },
  {
    name: 'license',
    path: '/user/license',
    meta: {
      title: '身份认证',
      needAuth: true,
      needWx: true
    },
    components: {
      mainView: License
    }
  }
]

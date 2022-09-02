/**
 * Created by garvey on 2017/8/28.
 */
import User from '../pages/user/index.vue'
//import Login from '../pages/user/login.vue'
const Login = ()=>import(/* webpackChunkName: "group-login" */ '../pages/user/login.vue')
//import License from '../pages/user/license.vue'
//import LicenseInfo from '../pages/user/licenseInfo.vue'
const License =()=>import(/* webpackChunkName: "group-license" */ '../pages/user/license.vue')
const LicenseInfo = ()=>import(/* webpackChunkName: "group-license" */ '../pages/user/licenseInfo.vue')

export default [
  {
    path: '/user',
    meta: {
      title: '个人中心',
      needAuth: true
    },
    components: {
      mainView: User
    }
  },
  {
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
      needSDK: true
    },
    components: {
      mainView: License
    }
  },
  {
    name: 'licenseInfo',
    path: '/user/licenseInfo',
    meta: {
      title: '身份认证',
      needAuth: true
    },
    components: {
      mainView: LicenseInfo
    }
  }
]

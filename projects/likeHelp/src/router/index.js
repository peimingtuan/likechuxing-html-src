import Vue from 'vue'
import Router from 'vue-router'

import Welcome from '../pages/Welcome'
import UserInfo from '../pages/Userinfo'
import DevCode from '../pages/DevCode'
import ToolTimeStamp from '../pages/working'
import ToolQrCode from '../pages/ToolQrCode'
import ToolJson from '../pages/working'
import ToolGPS from '../pages/working'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Welcome
    },
    {
      // 用户信息
      path:'/user/info',
      component:UserInfo
    },
    {
      // 代码管理
      path:'/dev/code',
      component:DevCode
    },
    {
      // 时间转换
      path:'/tool/timeStamp',
      component:ToolTimeStamp
    },
    {
      // 二维码
      path:'/tool/qrCode',
      component:ToolQrCode
    },
    {
      // json
      path:'/tool/json',
      component:ToolJson
    },
    {
      // gps
      path:'/tool/gps',
      component:ToolGPS
    }
  ]
})

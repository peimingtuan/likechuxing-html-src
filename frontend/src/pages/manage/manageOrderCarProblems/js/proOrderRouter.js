//@xurr on 18/06/07 车辆问题记录列表路由配置
import Vue from 'vue'
import Router from 'vue-router'

import proCheck from '../components/proCheck' //@xurr 180608 车辆问题记录勾选单
import proList from '../pages/proList' //@xurr 180611 车辆问题列表
import proDetails from '../pages/proDetails' //@xurr 180611 车辆问题列表详情
import carProDetail from '../components/carProDetail' //@xurr 180612 车辆问题详情
import handleHistory from '../components/handleHistory' //@xurr 180613 操作历史页面
import search from '../pages/search' //@xurr 180614 搜索页面
import pictureHis from '../components/pictureHis' //@xurr 180620 历史验车单
import createOrder from '../components/createOrder' //@xurr 180620 创建故障工单
//import enterRouter from '@/components/common/enterRouter'

import dd from '../../../../../other_modules/like-manageOrder/ddSDK'

Vue.use(Router)
let home_routes = [
  {
    path: '/',
    redirect: '/proList'
  },
  {//@xurr 180608 车辆问题记录勾选单
    path: '/proCheck',
    name: 'proCheck',
    component: proCheck
  },
  {//@xurr 180611 车辆问题列表
    path: '/proList',
    name: 'proList',
    meta: {
      title: '车辆问题列表',
      needDD: true
    },
    component: proList
  },
  {//@xurr 180611 车辆问题列表详情
    path: '/proDetails',
    name: 'proDetails',
    meta: {
      title: '车辆问题列表',
      needDD: true
    },
    component: proDetails
  },
  {//@xurr 180612 车辆问题详情
    path: '/carProDetail',
    name: 'carProDetail',
    component: carProDetail
  },
  {//@xurr 180613 操作历史
    path: '/handleHistory',
    name: 'handleHistory',
    component: handleHistory
  },
  {//@xurr 180614 搜索页面
    path: '/searchPro',
    name: 'search',
    meta: {
      title: '搜索',
      needDD: true
    },
    component: search
  },
  {//@xurr 180620 历史验车单
    path: '/pictureHis',
    name: 'pictureHis',
    component: pictureHis
  },
  {//@xurr 180620 创建新的故障工单
    path: '/createOrder',
    name: 'createOrder',
    component: createOrder
  },
]

const router = new Router({
  history: false,
  routes: home_routes
});

router.beforeEach((to, from, next) => {
  to.matched.forEach(route => {
    if (dd.inDDApp && route.meta.title) {
      document.title = route.meta.title
      dd.setWebTitle(route.meta.title)
    }
  })

  next()
})
export default router;
import Vue from 'vue'
import Router from 'vue-router'

import List from '../pages/list'
import notMove from '../pages/notMove'
import newWarning from '../pages/newWarning'
import warningOrder from '../pages/warningOrder'
import checkDeal from '../pages/checkDeal'
import servicePhoto from '../pages/servicePhoto'
import endOrder from '../pages/endOrder'
import finishedOrder from '../pages/finishedOrder'
import hisDetail from '../pages/hisDetail'
import serviceMap from '../pages/serviceMap'
import checkPhoto from '../pages/checkPhoto'
import carParts from '../pages/carParts'
import searchPro from '../pages/searchPro'
import warnHis from '../pages/warnHis'
import myWarn from '../pages/myWarn'

import dd from '../../../../../other_modules/like-manageOrder/ddSDK'

Vue.use(Router)
let home_routes = [
  {
    path: '/',
    redirect: '/list'
  },
  {
    path: '/list',
    name: 'list',
    meta: {
      title: '预警列表'
    },
    component: List
  },
  {
    path: '/notMove',
    name: 'notMove',
    meta: {
      title: '24小时未动'
    },
    component: notMove
  },
  {
    path: '/newWarning',
    name: 'newWarning',
    meta: {
      title: '新建预警工单'
    },
    component: newWarning
  },
  {
    path: '/warningOrder',
    name: 'warningOrder',
    meta: {
      title: '预警工单'
    },
    component: warningOrder
  },
  {
    path: '/checkDeal',
    name: 'checkDeal',
    meta: {
      title: '选择处理方式'
    },
    component: checkDeal
  },
  {
    path: '/servicePhoto',
    name: 'servicePhoto',
    meta: {
      title: '还车验车单'
    },
    component: servicePhoto
  },
  {
    path: '/checkPhoto',
    name: 'checkPhoto',
    meta: {
      title: '还车验车单'
    },
    component: checkPhoto
  },
  {
    path: '/endOrder',
    name: 'endOrder',
    meta: {
      title: '结束工单'
    },
    component: endOrder
  },
  {
    path: '/finishedOrder',
    name: 'finishedOrder',
    meta: {
      title: '结束工单'
    },
    component: finishedOrder
  },
  {
    path: '/hisDetail',
    name: 'hisDetail',
    meta: {
      title: '工单详情'
    },
    component: hisDetail
  },
  {
    path: '/carParts',
    name: 'carParts',
    meta: {
      title: '还车验车单'
    },
    component: carParts
  },
  {
    path: '/searchPro',
    name: 'searchPro',
    meta: {
      title: '搜索'
    },
    component: searchPro
  },
  {
    path: '/warnHis',
    name: 'warnHis',
    meta: {
      title: '预警工单历史'
    },
    component: warnHis
  },
  {
    path: '/serviceMap',
    name: 'serviceMap',
    meta: {
      title: '网点地图'
    },
    component: serviceMap
  },
  {
    path: '/myWarn',
    name: 'myWarn',
    meta: {
      title: '我的工单'
    },
    component: myWarn
  },
]

const router = new Router({
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
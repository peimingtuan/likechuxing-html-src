import Vue from 'vue'
import Router from 'vue-router'

import List from '../pages/list'
import newOrder from '../pages/newOrder'
import orderDetail from '../pages/orderDetail'
import addStaff from '../pages/addStaff'
import servicePhoto from '../pages/servicePhoto'
import endOrder from '../pages/endOrder'
import finishedOrder from '../pages/finishedOrder'
import hisDetail from '../pages/hisDetail'
import serviceMap from '../pages/serviceMap'
import checkPhoto from '../pages/checkPhoto'
import carParts from '../pages/carParts'
import searchPro from '../pages/searchPro'
import myOrder from '../pages/myOrder'
import addCarinfo from '../pages/addCarinfo'
import chargepayment from '../pages/chargepayment'

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
      title: '无单启动待追车'
    },
    component: List
  },
  {
    path: '/newOrder',
    name: 'newOrder',
    meta: {
      title: '新建追车工单'
    },
    component: newOrder
  },
  {
    path: '/orderDetail',
    name: 'orderDetail',
    meta: {
      title: '追车工单详情'
    },
    component: orderDetail
  },
  {
    path: '/addStaff',
    name: 'addStaff',
    meta: {
      title: '添加人员'
    },
    component: addStaff
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
      title: ''
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
    path: '/serviceMap',
    name: 'serviceMap',
    meta: {
      title: '网点地图'
    },
    component: serviceMap
  },
  {
    path: '/myOrder',
    name: 'myOrder',
    meta: {
      title: '我的追车工单'
    },
    component: myOrder
  },
  {
    path: '/addCarinfo',
    name: 'addCarinfo',
    meta: {
      title: '添加追车信息'
    },
    component: addCarinfo
  },
  {
    path: '/chargepayment',
    name: 'chargepayment',
    meta: {
      title: '出场缴费'
    },
    component: chargepayment
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
import Vue from 'vue'
import Router from 'vue-router'

import List from '../pages/list'
import newMove from '../pages/newMove'
import orderDetail from '../pages/orderDetail'
import servicePhoto from '../pages/servicePhoto'
import endOrder from '../pages/endOrder'
import finishedOrder from '../pages/finishedOrder'
import hisDetail from '../pages/hisDetail'
import serviceMap from '../pages/serviceMap'
import checkPhoto from '../pages/checkPhoto'
import searchPro from '../pages/searchPro'
import myList from '../pages/myList'
import moveReason from '../pages/moveReason'

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
      title: '挪车工单'
    },
    component: List
  },
  {
    path: '/newMove',
    name: 'newMove',
    meta: {
      title: '新建挪车工单'
    },
    component: newMove
  },
  {
    path: '/orderDetail',
    name: 'orderDetail',
    meta: {
      title: '挪车详情'
    },
    component: orderDetail
  },
  {
    path: '/servicePhoto',
    name: 'servicePhoto',
    meta: {
      title: ''
    },
    component: servicePhoto
  },
  {
    path: '/checkPhoto',
    name: 'checkPhoto',
    meta: {
      title: ''
    },
    component: checkPhoto
  },
  {
    path: '/endOrder',
    name: 'endOrder',
    meta: {
      title: '结束挪车工单'
    },
    component: endOrder
  },
  {
    path: '/finishedOrder',
    name: 'finishedOrder',
    meta: {
      title: '挪车工单'
    },
    component: finishedOrder
  },
  {
    path: '/hisDetail',
    name: 'hisDetail',
    meta: {
      title: '挪车工单详情'
    },
    component: hisDetail
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
    path: '/myList',
    name: 'myList',
    meta: {
      title: '我的工单'
    },
    component: myList
  },
  {
    path: '/moveReason',
    name: 'moveReason',
    meta: {
      title: '选择挪车原因及拍照'
    },
    component: moveReason
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
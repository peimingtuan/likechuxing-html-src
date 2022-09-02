import Vue from 'vue'
import Router from 'vue-router'

import List from '../pages/list'
import newOffice from '../pages/newOffice'
import orderDetail from '../pages/orderDetail'
import servicePhoto from '../pages/servicePhoto'
import endOrder from '../pages/endOrder'
import finishedOrder from '../pages/finishedOrder'
import hisDetail from '../pages/hisDetail'
import serviceMap from '../pages/serviceMap'
import checkPhoto from '../pages/checkPhoto'
import carParts from '../pages/carParts'
import searchPro from '../pages/searchPro'
import myList from '../pages/myList'
import addStaff from '../pages/addStaff'
import oilList from '../pages/oilList'
import chargeInfo from '../pages/chargeInfo'

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
      title: '办公用车工单'
    },
    component: List
  },
  {
    path: '/newOffice',
    name: 'newOffice',
    meta: {
      title: '新建办公用车工单'
    },
    component: newOffice
  },
  {
    path: '/orderDetail',
    name: 'orderDetail',
    meta: {
      title: '办公用车工单详情'
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
      title: ''
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
    path: '/myList',
    name: 'myList',
    meta: {
      title: '我的工单'
    },
    component: myList
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
    path: '/oilList',
    name: 'oilList',
    meta: {
      title: ''
    },
    component: oilList
  },
  {
    path: '/chargeInfo',
    name: 'chargeInfo',
    meta: {
      title: '编辑充电信息'
    },
    component: chargeInfo
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
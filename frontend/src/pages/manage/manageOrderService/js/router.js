import Vue from 'vue'
import Router from 'vue-router'

import List from '../pages/list'
import searchPro from '../pages/searchPro'
import carParts from '../pages/carParts'
import partsPicture from '../pages/partsPicture'
import createOrder from '../pages/createOrder'
import orderDetail from '../pages/orderDetail'
import truckingInfo from '../pages/truckingInfo'
import servicePhoto from '../pages/servicePhoto'
import serviceInfo from '../pages/serviceInfo'
import feeInfo from '../pages/feeInfo'
import endOrder from '../pages/endOrder'
import finishedOrder from '../pages/finishedOrder'
import hisDetail from '../pages/hisDetail'
import serviceMap from '../pages/serviceMap'
import checkPhoto from '../pages/checkPhoto'
import carProblem from '../pages/carProblem'
import moreEnd from '../pages/moreEnd'

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
      title: '维修工单列表'
    },
    component: List
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
    path: '/carParts',
    name: 'carParts',
    meta: {
      title: '取车验车单'
    },
    component: carParts
  },
  {
    path: '/partsPicture',
    name: 'partsPicture',
    meta: {
      title: '验车单拍照'
    },
    component: partsPicture
  },
  {
    path: '/createOrder',
    name: 'createOrder',
    meta: {
      title: '新建维修工单'
    },
    component: createOrder
  },
  {
    path: '/orderDetail',
    name: 'orderDetail',
    meta: {
      title: '维修工单详情'
    },
    component: orderDetail
  },
  {
    path: '/truckingInfo',
    name: 'truckingInfo',
    meta: {
      title: '拖车费信息录入'
    },
    component: truckingInfo
  },
  {
    path: '/servicePhoto',
    name: 'servicePhoto',
    meta: {
      title: '维修前拍照'
    },
    component: servicePhoto
  },
  {
    path: '/serviceInfo',
    name: 'serviceInfo',
    meta: {
      title: '维修信息录入'
    },
    component: serviceInfo
  },
  {
    path: '/feeInfo',
    name: 'feeInfo',
    meta: {
      title: '费用信息录入'
    },
    component: feeInfo
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
    path: '/serviceMap',
    name: 'serviceMap',
    meta: {
      title: '网点列表'
    },
    component: serviceMap
  },
  {
    path: '/checkPhoto',
    name: 'checkPhoto',
    meta: {
      title: '取车验车单'
    },
    component: checkPhoto
  },
  {
    path: '/carProblem',
    name: 'carProblem',
    meta: {
      title: '处理车辆问题'
    },
    component: carProblem
  },
  {
    path: '/moreEnd',
    name: 'moreEnd',
    meta: {
      title: '无需处理并上线'
    },
    component: moreEnd
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
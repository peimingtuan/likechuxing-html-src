import Vue from 'vue'
import Router from 'vue-router'

import List from '../pages/list'
import New from '../pages/new'
import Edit from '../pages/edit'
import CarHistoryList from '../pages/carHistoryList'
import CarRemind from '../pages/carRemind'
import InfoPrevious from '../pages/infoPrevious'
import InfoMaintain from '../pages/infoMaintain'
import InfoFee from '../pages/infoFee'
import ServiceMap from '../pages/serviceMap'
import FinishOrder from '../pages/finishedOrder'
import hisDetail from '../pages/hisDetail'
import checkPhoto from '../pages/checkPhoto'
import Mine from '../pages/mine'
import Search from '../pages/search'

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
      title: '保养工单列表'
    },
    component: List
  },
  {
    path: '/new',
    meta: {
      title: '新建保养工单'
    },
    component: New
  },
  {
    path: '/edit',
    meta: {
      title: '保养详情'
    },
    component: Edit
  },

  {
    path: '/carHistoryList',
    meta: {
      title: '车辆保养工单'
    },
    component: CarHistoryList
  },
  {
    path: '/carRemind',
    meta: {
      title: '保养提醒'
    },
    component: CarRemind
  },

  {
    path: '/infoPrevious',
    meta: {
      title: '录入保养前信息'
    },
    component: InfoPrevious
  },
  {
    path: '/infoMaintain',
    meta: {
      title: '录入保养信息'
    },
    component: InfoMaintain
  },
  {
    path: '/infoFee',
    meta: {
      title: '录入费用信息'
    },
    component: InfoFee
  },

  {
    path: '/serviceMap',
    meta: {
      title: '地图'
    },
    component: ServiceMap
  },
  {
    path: '/finishOrder',
    meta: {
      title: '结束工单'
    },
    component: FinishOrder
  },
  {
    path: '/hisDetail',
    meta: {
      title: '工单详情'
    },
    component: hisDetail
  },
  {
    path: '/checkPhoto',
    meta: {
      title: '查看照片'
    },
    component:checkPhoto
  },
  {
    path: '/mine',
    meta: {
      title: '我的保养工单'
    },
    component:Mine
  },
  {
    path: '/search',
    meta: {
      title: '搜索'
    },
    component:Search
  }

]

const router = new Router({
  routes: home_routes
});

router.beforeEach((to, from, next) => {
  to.matched.forEach(route => {
    if (route.meta && route.meta.title) {
      document.title = route.meta.title
      if (dd.inDDApp) dd.setWebTitle(route.meta.title)
    }
  })

  next()
})
export default router;
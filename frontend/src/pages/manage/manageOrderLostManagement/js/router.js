import Vue from 'vue'
import Router from 'vue-router'

import List from '../pages/list'
import New from '../pages/new'
import Detail from '../pages/detail'
import Get from '../pages/get'

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
      title: '遗失物品列表'
    },
    component: List
  },
  {
    path: '/new',
    name: 'new',
    meta: {
      title: '新建遗失物品工单',
      needDD: true
    },
    component: New
  },
  {
    path: '/detail',
    name: 'detail',
    meta: {
      title: '物品详情'
    },
    component: Detail
  },
  {
    path: '/get',
    name: 'get',
    meta: {
      title: '用户线下认领'
    },
    component: Get
  }
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
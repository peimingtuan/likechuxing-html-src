import Vue from 'vue'
import Router from 'vue-router'

import List from '../pages/list'
import disMap from '../pages/disMap'
import disDetail from '../pages/disDetail'
import searchPro from '../pages/searchPro'
import newPage from '../pages/newPage'
import pageDetail from '../pages/pageDetail'
import taskProgress from '../pages/taskProgress'
import searchName from '../pages/searchName'

import dd from '../../../../../other_modules/like-manageOrder/ddSDK'

Vue.use(Router)
let home_routes = [
  {
    path: '/',
    redirect: '/list'
  },
  {
    path: '/newPage',
    name: 'newPage',
    meta: {
      title: '创建任务包'
    },
    component: newPage
  },
  {
    path: '/pageDetail',
    name: 'pageDetail',
    meta: {
      title: '任务包详情'
    },
    component: pageDetail
  },
  {
    path: '/taskProgress',
    name: 'taskProgress',
    meta: {
      title: '任务进度'
    },
    component: taskProgress
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
    path: '/newPage',
    name: 'newPage',
    meta: {
      title: '创建任务包'
    },
    component: newPage
  },
  {
    path: '/pageDetail',
    name: 'pageDetail',
    meta: {
      title: '任务包详情'
    },
    component: pageDetail
  },
  {
    path: '/taskProgress',
    name: 'taskProgress',
    meta: {
      title: '任务进度'
    },
    component: taskProgress
  },
  {
    path: '/searchName',
    name: 'searchName',
    meta: {
      title: '搜索'
    },
    component: searchName
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
import Vue from 'vue'
import Router from 'vue-router'
import Main from '../../pages/reserveIn'
import reservedPage from '../../pages/reserved'
import EndBranch from '../../pages/endBranch'
import SearchPoint from '../../pages/searchPoint'
import Detail from '../../pages/dispatchDetail'

import env from '../../../../../../other_modules/like-env'
import appArguments from '../../../../../../other_modules/app-arguments'
import {appMutual} from "../../../../../../other_modules/app-mutual"

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      meta: {
        title: '预定早通勤车'
      },
      components: {
        base: Main
      },
      beforeEnter: (to, from, next) => {
        if (appArguments.in_app && env.isIos) {
          if (window.history.length === 1 && from.path === '/') {
            window.history.pushState({}, 'statTitle', '/bufferforios')
            setTimeout(function () {
              window.history.go(-1)
            }, 0)
          }
        }
        next()
      }
    },
    {
      path: '/reservedPage',
      meta: {
        title: '预定早通勤车'
      },
      components: {
        base: Main,
        upper: reservedPage
      }
    },
    {
      path: '/endBranch',
      meta:{
        title:'还车网点'
      },
      components: {
        base: Main,
        upper: EndBranch
      }
    },
    {
      path: '/searchPoint',
      meta:{
        title:'搜索目的地'
      },
      components: {
        base: Main,
        upper: SearchPoint
      }
    },
    {
      path: '/detail',
      meta:{
        title:'早晚通勤车使用指南'
      },
      components: {
        base: Main,
        upper: Detail
      }
    },
  ]
})

router.beforeEach((to, from, next) => {
  to.matched.forEach(route => {
    if (appArguments.in_app && route.meta.title) {
      appMutual.send.updateTitle(route.meta.title)
    }
  })
  next()
})

export default router
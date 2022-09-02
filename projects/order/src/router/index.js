import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/store'

import NotFoundComponent from '../pages/error/404.vue'
import Error from '../pages/error/error.vue'

import main from './main'
import staticPage from './static'
import user from './user'
import deposit from './deposit'
import {LOCAL_STORAGE_NAME} from '../common/CONST'
import {IsWeiXin} from '../common/UserAgent'
import myaxios from '../common/myaxios'
import API from '../common/apiAddress'
const _czc = window._czc

Vue.use(Router)

const router = new Router({
  routes: [
    {
      name: 'root',
      path: '/',
      meta: {
        title: '立刻出行'
      },
      // 预留根目录，重定向到首页
      redirect: {name: 'main'}
    },
    ...main,
    ...staticPage,
    ...user,
    ...deposit,
    {
      path: '/error',
      components: {
        mainView: Error
      }
    },
    {
      path: '*',
      components: {
        mainView: NotFoundComponent
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  store.commit('Loading/hide')
  if (to.matched.some(record => record.meta.needAuth)) {
    if (window.localStorage.hasOwnProperty(LOCAL_STORAGE_NAME) && JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_NAME)).is_login) {
      next()
    } else {
      next({
        name: 'login',
        query: {}
      })
    }
  } else {
    next()
  }
})

router.beforeEach((to, from, next) => {
  if (from.name === 'login' && to.name.match(/(license|deposit)/) && !IsWeiXin()) {
    next({
      name: 'main'
    })
  } else if (to.name === 'login' && String(from.name).match(/(license|deposit)/) && IsWeiXin()) {
    next({
      name: 'main'
    })
  } else {
    next()
  }
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.needWx)) {
    if (IsWeiXin()) {
      if (to.matched.some(record => record.meta.needOpenId) && !to.query.hasOwnProperty('open_id')) {
        myaxios.formPost(API.wxJs.openId, {
          cb_url: API.openIdFile + '?path=' + to.path
        })
      } else {
        next()
      }
    } else {
      store.dispatch('Alert/show', {
        mold: 'toast',
        msg: '请在微信中打开此页'
      })
      next(false)
    }
  } else {
    next()
  }
})

router.beforeEach((to, from, next) => {
  _czc.push(['_trackPageview', to.path, from.path])
  next()
})

export default router

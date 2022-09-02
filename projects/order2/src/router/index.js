import Vue from 'vue'
import Router from 'vue-router'

import NotFoundComponent from '../pages/error/404.vue'
import Error from '../pages/error/error.vue'
import OpenInAlipay from '../pages/error/openInAlipay'

import main from './main'
import user from './user'
import deposit from './deposit'
import rental from './rental'
import pay from './pay'
import car from './car'

const _czc = window._czc

window.onpopstate = ()=>{
  console.log('pop',history.state,history)
}

Vue.use(Router)

const router = new Router({
  mode:'hash',
  //mode:'history',
  routes: [
    {
      name: 'root',
      path: '/',
      meta: {
        title: '立刻出行'
      },
      // 预留根目录，重定向到首页
      redirect: {path:'/index'}
    },
    ...main,
    ...user,
    ...deposit,
    ...rental,
    ...pay,
    ...car,
    {
      path: '/error/openInAlipay',
      components: {
        mainView: OpenInAlipay
      }
    },
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
  if(from.meta.backToIndex && to.path !== '/index'){
    next('/index')
  }else{
    next()
  }
})

/*router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.needSDK)) {
    if (env.isWeiXin) {
      if (to.matched.some(record => record.meta.needOpenId) && !to.query.hasOwnProperty('open_id')) {
        myaxios.formPost(API.wxJs.openId, {
          cb_url: API.openIdFile + '?path=' + to.path
        })
      } else {
        next()
      }
    } else if (env.isAliPay){
      next()
    } else {
      Toast('请在支付宝打开')
      next(false)
    }
  } else {
    next()
  }
})*/

router.beforeEach((to, from, next)=>{
  to.matched.forEach(route => {
    if(route.meta.title){
      SDK.setWindowTitle(route.meta.title)
    }
  })
  next()
})

router.beforeEach((to,from,next)=>{
  if(to.path==='/close'){
    SDK.popWindow()
    next(false)
  }else{
    next()
  }

})

router.beforeEach((to, from, next) => {
  _czc.push(['_trackPageview', to.path, from.path])
  next()
})

export default router

import Vue from 'vue'
import Router from 'vue-router'

import Charge from '../pages/charge/Charge.vue'
import ChargeIndex from '../pages/charge/Index.vue'
import NotFoundComponent from '../pages/error/404.vue'
import Error from '../pages/error/error.vue'
import SideBar from '../pages/main/sideBar.vue'
import Login from '../pages/main/login.vue'

Vue.use(Router)

const router = new Router({
  // mode:'history',
  routes: [
    {
      path: '/',
      // 预留根目录，重定向到充电单页
      redirect: '/login'
    },
    {
      path: '/login',
      components: {
        mainView: Login
      }
    },
    {
      path: '/charge/',
      // 重定向到充电单首页，同时渲染charge页框架：Charge
      redirect: '/charge/index',
      components: {
        sideBar: SideBar,
        mainView: Charge
      },
      meta: {
        needAuth: true
      },
      children: [
        {
          path: 'index',
          component: ChargeIndex
        }
      ]
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
  if (to.matched.some(record => record.meta.needAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (Math.random() > 0.5) {
      next({
        path: '/',
        query: {
          // redirect: to.fullPath,
          behavior: 'login'
        }
      })
    } else {
      next()
    }
  } else {
    next() // 确保一定要调用 next()
  }
})

export default router

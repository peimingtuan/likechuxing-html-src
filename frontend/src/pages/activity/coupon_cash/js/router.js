/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: router
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/8/17-下午4:04
 Description:
 Param:
 Return:
 *************************************************/
import Vue from 'vue'
import Router from 'vue-router'

import Login from '../pages/login'
import Fail from '../pages/fail'
import Finish from '../pages/finish'
import Edit from '../pages/edit'

Vue.use(Router)

const router = new Router({
  mode:'hash',
  routes: [
    {
      path:'/'
    },
    {
      path:'/login',
      meta:{
        title:'天天领红包'
      },
      component: Login,
    },
    {
      path: '/fail',
      meta: {
        title: '天天领红包'
      },
      component: Fail
    },
    {
      path: '/finish',
      meta: {
        title: '天天领红包'
      },
      component: Finish
    },
    {
      path: '/edit',
      meta: {
        title: '修改绑定手机号'
      },
      component: Edit
    }

  ],
  scrollBehavior (to, from, savedPosition) {  // 跳转第二页置顶
    return { x: 0, y: 0 }
  }
})

router.beforeEach((to, from, next)=>{
  to.matched.forEach(route => {
    if(route.meta.title){
      document.title = route.meta.title
    }
  })

  next()
})

export default router
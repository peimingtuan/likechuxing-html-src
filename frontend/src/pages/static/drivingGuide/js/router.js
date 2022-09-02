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
import {appMutual} from '../../../../../other_modules/app-mutual'
import env from '../../../../../other_modules/like-env'

import Main from '../pages/main'
import saiou3 from '../pages/saiou3'

Vue.use(Router)

const router = new Router({
  mode:'hash',
  routes: [
    {
      path:'/',
      redirect:'/main'
    },
    {
      path:'/main',
      meta:{
        title:'驾驶指南'
      },
      component: Main,
    },
    {
      path:'/car/saiou3',
      meta:{
        title:'赛欧 3'
      },
      component: saiou3,
    }

  ]
})

router.beforeEach((to, from, next)=>{
  to.matched.forEach(route => {
    if(route.meta.title){
      document.title = route.meta.title

      if(env.isInLike){
        appMutual.send.updateTitle(route.meta.title)
      }
    }
  })

  next()
})

export default router
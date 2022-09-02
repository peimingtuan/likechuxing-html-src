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
import Detail from '../pages/detail'
import Photos from '../pages/photos'

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
        title:'行程详情'
      },
      component:Main
    },
    {
      path: '/detail',
      meta: {
        title: '费用明细'
      },
      component:Detail
    },
    {
      path: '/photos',
      meta: {
        title: '验车单'
      },
      component:Photos
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
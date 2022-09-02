/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: router_share
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/9/29-下午3:21
 Description:
 Param:
 Return:
 *************************************************/
 import Vue from 'vue'
import Router from 'vue-router'
import {appMutual} from '../../../../../other_modules/app-mutual'
import env from '../../../../../other_modules/like-env'

import Share from '../pages/share'
import CouponList from '../pages/couponList'

Vue.use(Router)

const router = new Router({
  mode:'hash',
  routes: [

    {
      path:'/',
      redirect:'/share'
    },

    {
      path:'/share',
      meta:{
        title:'邀请好友'
      },
      component: Share,
    },

    {
      path:'/couponList',
      meta:{
        title:'红包'
      },
      component: CouponList,
    },

    {
      path:'*',
      redirect:'/share'
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
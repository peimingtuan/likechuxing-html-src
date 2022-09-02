/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: router_index
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/9/29-下午3:20
 Description:
 Param:
 Return:
 *************************************************/
import Vue from 'vue'
import Router from 'vue-router'
import {appMutual} from '../../../../../other_modules/app-mutual'
import env from '../../../../../other_modules/like-env'

import Invite from '../pages/invite'
import Detail from '../pages/detail'
import InviteHistory from '../pages/inviteHistory'

Vue.use(Router)

const router = new Router({
  mode:'hash',
  routes: [

    {
      path:'/',
      redirect:'/invite'
    },

    {
      path:'/invite',
      meta:{
        title:'邀请好友'
      },
      component: Invite,
    },

    {
      path:'/detail',
      meta:{
        title:'邀请规则'
      },
      component: Detail,
    },

    {
      path:'/inviteHistory',
      meta:{
        title:'邀请记录'
      },
      component: InviteHistory,
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
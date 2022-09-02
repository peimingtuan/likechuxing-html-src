/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: router
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/10/15-2:43 PM
 Description:
 Param:
 Return:
 *************************************************/
import Vue from 'vue'
import Router from 'vue-router'

import Main from '../pages/index.vue'
import Area from '../pages/area'

Vue.use(Router)

const router = new Router({
  mode:'hash',
  routes: [
    {
      path:'/',
      redirect:'/view'
    },
    {
      path:'/view',
      component:Main
    },
    {
      path:'/area',
      component:Area
    }
  ]
})

export default router
/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: dispatchOutRouter
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/7/18-下午2:19
 Description:
 Param:
 Return:
 *************************************************/
import Vue from 'vue'
import Router from 'vue-router'
import env from '../../../../../../other_modules/like-env'
import appArguments from '../../../../../../other_modules/app-arguments'
import {appMutual} from '../../../../../../other_modules/app-mutual'

import Main from '../../pages/dispatchOut'
import Detail from '../../pages/dispatchDetail'
import EndBranch from '../../pages/endBranch'
import SearchPoint from '../../pages/searchPoint'

Vue.use(Router)

const router = new Router({
  mode:'hash',
  routes: [
    {
      path:'/',
      meta:{
        title:'晚通勤车'
      },
      components: {
        base:Main
      },
      beforeEnter:(to,from,next)=>{
        if(appArguments.in_app && env.isIos){
          if(window.history.length === 1 && from.path === '/') {
            window.history.pushState({}, 'statTitle', '/bufferforios')
            setTimeout(function(){
              window.history.go(-1)
            },0)
          }
        }
        next()
      }
    },
    {
      path:'/detail',
      meta:{
        title:'早晚通勤车使用指南'
      },
      components: {
        base:Main,
        upper:Detail
      }
    },
    {
      path:'/endBranch',
      meta:{
        title:'还车网点'
      },
      components: {
        base:Main,
        upper:EndBranch
      }
    },
    {
      path:'/searchPoint',
      meta:{
        title:'搜索目的地'
      },
      components: {
        base:Main,
        upper:SearchPoint
      }
    }
  ]
})

router.beforeEach((to, from, next)=>{
  to.matched.forEach(route => {
    if(appArguments.in_app && route.meta.title){
      appMutual.send.updateTitle(route.meta.title)
    }
  })
  next()
})

export default router
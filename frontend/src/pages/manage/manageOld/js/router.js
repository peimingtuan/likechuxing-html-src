/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: router
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/7/26-下午3:25
 Description:
 Param:
 Return:
 *************************************************/
import Vue from 'vue'
import Router from 'vue-router'

import Main from '../pages/main.vue'
import Login from '../pages/login.vue'
import CatList from '../pages/carList.vue'
import {appMutual} from "../../../../../other_modules/app-mutual";

Vue.use(Router)

const router = new Router({
  mode:'hash',
  routes: [
    {
      path:'/',
      meta:{
        title:'管理app',
        needAuth:true
      },
      component: Main
    },
    {
      path:'/login',
      meta:{
        title:'登录'
      },
      component: Login
    },
    {
      path:'/car/list',
      meta:{
        title:'车辆列表',
        needAuth:true
      },
      component: CatList
    }
  ]
})

// 校验权限
router.beforeEach((to, from, next)=>{
  to.matched.forEach(route => {
    if(route.meta.needAuth && !router.app.$store.state.user.uuid){
      next('/login')
    }else{
      next()
    }
  })
})

// 更新title
router.beforeEach((to, from, next)=>{
  to.matched.forEach(route => {
    if(route.meta.title)document.title = route.meta.title
  })
  next()
})


export default router
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
import appArguments from '../../../../../other_modules/app-arguments'

import Main from '../pages/main'
import InviteHistory from '../pages/inviteHistory'
import BalanceHistory from '../pages/balanceHistory'
import Register from '../pages/register'
import RegisterFinish from '../pages/registerFinish'
import Detail from '../pages/detail'
import DrawInfo from '../pages/drawInfo'
import ComfirmDrawInfo from '../pages/comfirmDrawInfo'
import SuccessDraw from '../pages/successDraw'

Vue.use(Router)

let channel_s = appArguments.hasOwnProperty("channel") ? appArguments.channel.split('_') : ['0']
let city_id = appArguments.city_id || Number(channel_s[0])

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
        title:'立刻合伙人 招募计划'
      },
      component: Main,
    },
    {
      path: '/inviteHistory',
      meta: {
        title: '邀请记录'
      },
      component: InviteHistory
    },
    {
      path: '/balanceHistory',
      meta: {
        title: '赏金记录'
      },
      component: BalanceHistory
    },
    {
      path: '/register',
      meta: {
        title: '立刻合伙人 招募计划'
      },
      component: Register
    },

    {
      path: '/registerFinish',
      meta: {
        title: '立刻合伙人 招募计划'
      },
      component: RegisterFinish
    },

    {
      path: '/detail',
      meta: {
        title: '立刻合伙人 招募计划'
      },
      component: Detail
    },

    {
      path: '/drawInfo',
      meta: {
        title: '提现信息'
      },
      component: DrawInfo
    },

    {
      path: '/comfirmDrawInfo',
      meta: {
        title: '确认提现信息'
      },
      component: ComfirmDrawInfo
    },

    {
      path: '/successDraw',
      meta: {
        title: '提交提现信息'
      },
      component: SuccessDraw
    },

  ],
  scrollBehavior (to, from, savedPosition) {  // 跳转第二页置顶
    return { x: 0, y: 0 }
  }
})

router.beforeEach((to, from, next)=>{
  to.matched.forEach(route => {
    switch (route.path){
      case '/main':
        // 首页
        window._czc.push(["_trackEvent",'index','all',String(city_id)]);
        if(env.isInLike){
          window._czc.push(["_trackEvent",'index','inApp',String(city_id)]);
        }else{
          window._czc.push(["_trackEvent",'index','outApp',String(city_id)]);
        }
        break;

      case '/register':
        // 邀请首页
        window._czc.push(["_trackEvent",'index','all',String(city_id)]);

        if(appArguments.from === 'wx'){
          // 微信分享
          window._czc.push(["_trackEvent",'register','wx',String(city_id)]);
        }else{
          window._czc.push(["_trackEvent",'register','dm',String(city_id)]);
        }

        if(Number(appArguments.scan) === 1)window._czc.push(["_trackEvent",'register','qrcode',String(city_id)]);

        if(appArguments.type === 'a'){
          window._czc.push(["_trackEvent",'register','a',String(city_id)]);
        }else{
          window._czc.push(["_trackEvent",'register','b',String(city_id)]);
        }
    }
  })

  next()
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
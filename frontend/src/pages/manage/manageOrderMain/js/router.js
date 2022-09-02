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
import dd from '../../../../../other_modules/like-manageOrder/ddSDK'

import List from '../pages/list'
import MyList from '../pages/myList'
import Search from '../pages/search'
import SearchPlate from '../pages/searchPlate'

import Insurance from '../pages/car/insurance'
import partsSelect from '../pages/car/partsSelect'
import takePhotos from '../pages/car/takePhotos'
import Delete from '../pages/order/delete'
import Finish from '../pages/order/finish'
import BranchNearby from '../pages/map/branchNearby'

Vue.use(Router)

const router = new Router({
  mode:'hash',
  routes: [
    {
      path:'/',
      redirect:'/list'
    },
    {
      path:'/list',
      meta:{
        title:'立刻运维工单',
      },
      component: List,
    },
    {
      path: '/myList',
      meta: {
        title: '我的工单',
        needDD: true
      },
      component: MyList
    },
    {
      path: '/search',
      meta: {
        title: '查询车辆',
        needDD: true
      },
      component: Search
    },
    {
      path: '/searchPlate',
      meta: {
        title: '查询'
      },
      component: SearchPlate
    },

    {
      path: '/car/insurance',
      meta: {
        title: '保险单',
        needDD: true
      },
      component: Insurance
    },

    {
      path: '/car/partsSelect',
      meta: {
        title: '验车单',
        needDD: true
      },
      component: partsSelect
    },

    {
      path: '/car/takePhotos',
      meta: {
        title: '上传照片',
        needDD: true
      },
      component: takePhotos
    },

    {
      path: '/order/delete',
      meta: {
        title: '删除工单'
      },
      component: Delete
    },
    {
      path: '/order/finish',
      meta: {
        title: '结束工单'
      },
      component: Finish
    },

    {
      path: '/map/branchNearby',
      meta: {
        title: '查询网点'
      },
      component: BranchNearby
    }
  ]
})

/*router.beforeEach((to, from, next)=>{
  to.matched.forEach(route => {
    if(!dd.inDDApp && route.meta.needDD){
      next('/')
    }else{
      next()
    }
  })
})*/

router.beforeEach((to, from, next)=>{
  to.matched.forEach(route => {
    if(dd.inDDApp && route.meta.title){
      document.title = route.meta.title
      dd.setWebTitle(route.meta.title)
    }
  })

  next()
})

export default router
/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: rental
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/4/19-下午2:12
 Description:
 Param:
 Return:
 *************************************************/
import EndBranch from '../pages/rental/endBranch.vue'
import SearchPoint from '../pages/rental/searchPoint.vue'
import MoreFunction from '../pages/rental/moreFunction.vue'
import AccidentCall from '../pages/rental/accidentCall.vue'
//import Review from '../pages/rental/review.vue'
const Review = () => import(/* webpackChunkName: "group-review" */'../pages/rental/review.vue')
import Finish from '../pages/rental/finish.vue'
import Detail from '../pages/rental/detail.vue'
import EndBranchConfirm from '../pages/rental/endBranchConfirm.vue'

export default [
  {
    name: 'endBranch',
    path: '/rental/endBranch',
    meta: {
      title: '还车网点',
      needAuth: true
    },
    components: {
      mainView: EndBranch
    }
  },
  {
    name: 'searchPoint',
    path: '/rental/searchPoint',
    meta: {
      title: '搜索网点',
      needAuth: true
    },
    components: {
      mainView: SearchPoint
    }
  },
  {
    name: 'moreFunction',
    path: '/rental/more',
    meta: {
      title: '更多功能',
      needAuth: true
    },
    components: {
      mainView: MoreFunction
    }
  },
  {
    name: 'accidentCall',
    path: '/rental/accidentCall',
    meta: {
      title: '事故上报',
      needAuth: true
    },
    components: {
      mainView: AccidentCall
    }
  },
  {
    name: 'review',
    path: '/rental/review',
    meta: {
      title: '还车检查',
      needAuth: true
    },
    components: {
      mainView: Review
    }
  },
  {
    name: 'finish',
    path: '/rental/finish',
    meta: {
      title: '行程详情',
      needAuth: true
    },
    components: {
      mainView: Finish
    }
  },
  {
    name:'detail',
    path: '/rental/detail',
    meta: {
      title: '费用明细',
      needAuth: true
    },
    components: {
      mainView: Detail
    }
  },
  {
    path: '/rental/endBranchConfirm',
    meta: {
      title: '还车网点',
      needAuth: true
    },
    components: {
      mainView: EndBranchConfirm
    }
  },
]

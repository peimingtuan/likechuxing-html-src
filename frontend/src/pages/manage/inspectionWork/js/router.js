import dd from '../../../../../other_modules/like-manageOrder/ddSDK'
import Vue from 'vue'
import Router from 'vue-router'
import list from '../pages/list'
import myworklist from '../pages/myworklist'
import search from '../pages/search'
import newbuilt from '../pages/newbuilt'
import detail from '../pages/detail'
import workdetail from '../pages/workdetail'
import inspection from '../pages/inspection'
import returninspection from '../pages/returninspection'
import returnafterphoto from '../pages/returnafterphoto'
import recordinspection from '../pages/recordinspection'
import addmatter from '../pages/addmatter'
import endOrder from '../pages/endOrder'
import finshcarwork from '../pages/finshcarwork'
import finshworkdetail from '../pages/finshworkdetail'
import checkafterphoto from '../pages/checkafterphoto'
import checkmatter from '../pages/checkmatter'
import checkdinspection from '../pages/checkdinspection'

Vue.use(Router)

let home_routes = [
  {
    path: '/list',
    name: 'list',
    meta: {
      title: '巡检工单'
    },
    component: list
  },
  {
    path: '/myworklist',
    name: 'myworklist',
    meta: {
      title: '我的巡检工单'
    },
    component: myworklist
  },
  {
    path: '/search',
    name: 'search',
    meta: {
      title: '搜索'
    },
    component: search
  },
  {
    path: '/newbuilt',
    name: 'newbuilt',
    meta: {
      title: '新建巡检工单'
    },
    component: newbuilt
  },
  {
    path: '/detail',
    name: 'detail',
    meta: {
      title: '巡检工单'
    },
    component: detail
  },
  {
    path: '/workdetail',
    name: 'workdetail',
    meta: {
      title: '巡检工单'
    },
    component: workdetail
  },
  {
    path: '/inspection',
    name: 'inspection',
    meta: {
      title: '记录巡检事项'
    },
    component: inspection
  },
  {
    path: '/returninspection',
    name: 'returninspection',
    meta: {
      title: '还车验车单'
    },
    component: returninspection
  },
  {
    path: '/returnafterphoto',
    name: 'returnafterphoto',
    meta: {
      title: '还车验车单'
    },
    component: returnafterphoto
  },
  {
    path: '/recordinspection',
    name: 'recordinspection',
    meta: {
      title: '记录巡检事项'
    },
    component: recordinspection
  },
  {
    path: '/addmatter',
    name: 'addmatter',
    meta: {
      title: '记录物料补充'
    },
    component: addmatter
  },
  {
    path: '/endOrder',
    name: 'endOrder',
    meta: {
      title: '结束工单'
    },
    component: endOrder
  },
  {
    path: '/finshcarwork',
    name: 'finshcarwork',
    meta: {
      title: '工单轨迹'
    },
    component: finshcarwork
  },
  {
    path: '/finshworkdetail',
    name: 'finshworkdetail',
    meta: {
      title: '工单详情'
    },
    component: finshworkdetail
  },
  {
    path: '/checkafterphoto',
    name: 'checkafterphoto',
    meta: {
      title: '查看还车验车单'
    },
    component: checkafterphoto
  },
  {
    path: '/checkmatter',
    name: 'checkmatter',
    meta: {
      title: '查看记录巡检事项'
    },
    component: checkmatter
  },
  {
    path: '/checkdinspection',
    name: 'checkdinspection',
    meta: {
      title: '查看记录物料补充'
    },
    component: checkdinspection
  },
]

const router = new Router({
  routes: home_routes
});

router.beforeEach((to, from, next) => {
  to.matched.forEach(route => {
    if (dd.inDDApp && route.meta.title) {
      dd.setWebTitle(route.meta.title)
    }
  })

  next()
})
export default router;
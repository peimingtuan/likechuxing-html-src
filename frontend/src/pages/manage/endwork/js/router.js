import dd from '../../../../../other_modules/like-manageOrder/ddSDK'
import Vue from 'vue'
import Router from 'vue-router'
import endOrder from '../pages/endOrder'
import selectmapnet from '../pages/selectmapnet'
import selectmapnet2 from '../pages/selectmapnet2'
//import panoramamap from '../pages/panoramamap'
import rentlistsearch from '../pages/rentlistsearch'
import netnorentcar from '../pages/netnorentcar'
import netcarmap from '../pages/netcarmap'

Vue.use(Router)

let home_routes = [
  {
    path: '/endOrder',
    name: 'endOrder',
    meta: {
      title: '结束工单'
    },
    component: endOrder
  },
  {
    path: '/selectmapnet',
    name: 'selectmapnet',
    meta: {
      title: '地图网点'
    },
    component: selectmapnet
  },
  {
    path: '/selectmapnet2',
    name: 'selectmapnet2',
    meta: {
      title: '查询网点'
    },
    component: selectmapnet2
  },
  //{
  //  path: '/panoramamap',
  //  name: 'panoramamap',
  //  meta: {
  //    title: '网点全景图'
  //  },
  //  component: panoramamap
  //},
  {
    path: '/rentlistsearch',
    name: 'rentlistsearch',
    meta: {
      title: '搜索'
    },
    component: rentlistsearch
  },
  {
    path: '/netnorentcar',
    name: 'netnorentcar',
    meta: {
      title: '网点车辆非租赁列表'
    },
    component: netnorentcar
  },
  {
    path: '/netcarmap',
    name: 'netcarmap',
    meta: {
      title: '网点车辆库存'
    },
    component: netcarmap
  }
]

const router = new Router({
  routes: home_routes
});

router.beforeEach((to, from, next) => {
  to.matched.forEach(route => {
    if (dd.inDDApp && route.meta.title) {
      document.title = route.meta.title
      dd.setWebTitle(route.meta.title)
    }
  })

  next()
})
export default router;
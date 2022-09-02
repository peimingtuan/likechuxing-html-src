import dd from '../../../../../other_modules/like-manageOrder/ddSDK'
import Vue from 'vue'
import Router from 'vue-router'
import endOrder from '../pages/endOrder'
import selectmapnet from '../pages/selectmapnet'

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
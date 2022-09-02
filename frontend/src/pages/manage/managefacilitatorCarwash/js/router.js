import Vue from 'vue'
import Router from 'vue-router'
import enterhome from '../pages/enterhome'
import carwashlist2 from '../pages/carwashlist2'
import networkdetail2 from '../pages/networkdetail2'
import cancelwashwork2 from '../pages/cancelwashwork2'
import carwashdetail2 from '../pages/carwashdetail2'
import carwashbeforephoto2 from '../pages/carwashbeforephoto2'
import carwashafterphoto2 from '../pages/carwashafterphoto2'
import checkbeforephoto2 from '../pages/checkbeforephoto2'
import checkafterphoto2 from '../pages/checkafterphoto2'
import endwork from '../pages/endwork'
import finshcarwashdetail2 from '../pages/finshcarwashdetail2'
import mycarwashlist2 from '../pages/mycarwashlist2'
import search2 from '../pages/search2'
import checknofitwork from '../pages/checknofitwork'
import logon from '../pages/logon'

Vue.use(Router)

let home_routes = [
  {
    path: '/enterhome',
    name: 'enterhome',
    meta: {
      title: '登录'
    },
    component: enterhome
  },
  {
    path: '/carwashlist2',
    name: 'carwashlist2',
    meta: {
      title: '洗车工单列表'
    },
    component: carwashlist2
  },
  {
    path: '/networkdetail2',
    name: 'networkdetail2',
    meta: {
      title: '网点工单详情'
    },
    component: networkdetail2
  },
  {
    path: '/cancelwashwork2',
    name: 'cancelwashwork2',
    meta: {
      title: '取消洗车工单'
    },
    component: cancelwashwork2
  },
  {
    path: '/carwashdetail2',
    name: 'carwashdetail2',
    meta: {
      title: '洗车工单详情'
    },
    component: carwashdetail2
  },
  {
    path: '/carwashbeforephoto2',
    name: 'carwashbeforephoto2',
    meta: {
      title: '洗车前拍照'
    },
    component: carwashbeforephoto2
  },
  {
    path: '/carwashafterphoto2',
    name: 'carwashafterphoto2',
    meta: {
      title: '洗车后拍照'
    },
    component: carwashafterphoto2
  },
  {
    path: '/checkbeforephoto2',
    name: 'checkbeforephoto2',
    meta: {
      title: '查看洗车前拍照'
    },
    component: checkbeforephoto2
  },
  {
    path: '/checkafterphoto2',
    name: 'checkafterphoto2',
    meta: {
      title: '查看洗车后拍照'
    },
    component: checkafterphoto2
  },
  {
    path: '/endwork',
    name: 'endwork',
    meta: {
      title: '结束工单'
    },
    component: endwork
  },
  {
    path: '/finshcarwashdetail2',
    name: 'finshcarwashdetail2',
    meta: {
      title: '工单详情'
    },
    component: finshcarwashdetail2
  },
  {
    path: '/mycarwashlist2',
    name: 'mycarwashlist2',
    meta: {
      title: '我的洗车工单'
    },
    component: mycarwashlist2
  },
  {
    path: '/search2',
    name: 'search2',
    meta: {
      title: '搜索网点'
    },
    component: search2
  },
  {
    path: '/checknofitwork',
    name: 'checknofitwork',
    meta: {
      title: '取消洗车工单'
    },
    component: checknofitwork
  },
  {
    path: '/logon',
    name: 'logon',
    meta: {
      title: '正在加载'
    },
    component: logon
  }
]

const router = new Router({
  routes: home_routes
});

router.beforeEach((to, from, next) => {
  to.matched.forEach(route => {
    if (route.meta.title) {
      document.title = route.meta.title
    }
  })
  next()
})
export default router;
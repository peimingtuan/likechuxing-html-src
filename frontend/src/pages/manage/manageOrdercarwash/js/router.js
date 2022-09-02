import dd from '../../../../../other_modules/like-manageOrder/ddSDK'
import Vue from 'vue'
import Router from 'vue-router'
import carwashlist from '../pages/carwashlist'
import networkdetail from '../pages/networkdetail'
import cancelwashwork from '../pages/cancelwashwork'
import newbuiltcarwash from '../pages/newbuiltcarwash'
import carwashdetail from '../pages/carwashdetail'
import carwashbeforephoto from '../pages/carwashbeforephoto'
import carwashafterphoto from '../pages/carwashafterphoto'
import addcarwashcost from '../pages/addcarwashcost'
import gooutpaymoney from '../pages/gooutpaymoney'
import checkbeforephoto from '../pages/checkbeforephoto'
import checkafterphoto from '../pages/checkafterphoto'
import checkpaymoney from '../pages/checkpaymoney'
import checkwashcost from '../pages/checkwashcost'
import endOrder from '../pages/endOrder'
import finshcarwash from '../pages/finshcarwash'
import finshcarwashdetail from '../pages/finshcarwashdetail'
import mycarwashlist from '../pages/mycarwashlist'
import checkedcarwashlist from '../pages/checkedcarwashlist'
import selectmapnet from '../pages/selectmapnet'
import selectmapnet2 from '../pages/selectmapnet2'
import operacarwashlist from '../pages/operacarwashlist'

Vue.use(Router)

let home_routes = [
  {
    path: '/carwashlist',
    name: 'carwashlist',
    meta: {
      title: '洗车工单列表'
    },
    component: carwashlist
  },
  {
    path: '/networkdetail',
    name: 'networkdetail',
    meta: {
      title: '网点工单详情'
    },
    component: networkdetail
  },
  {
    path: '/cancelwashwork',
    name: 'cancelwashwork',
    meta: {
      title: '选择不合格原因'
    },
    component: cancelwashwork
  },
  {
    path: '/newbuiltcarwash',
    name: 'newbuiltcarwash',
    meta: {
      title: '创建洗车工单'
    },
    component: newbuiltcarwash
  },
  {
    path: '/carwashdetail',
    name: 'carwashdetail',
    meta: {
      title: '洗车工单详情'
    },
    component: carwashdetail
  },
  {
    path: '/carwashbeforephoto',
    name: 'carwashbeforephoto',
    meta: {
      title: '洗车前拍照'
    },
    component: carwashbeforephoto
  },
  {
    path: '/carwashafterphoto',
    name: 'carwashafterphoto',
    meta: {
      title: '洗车后拍照'
    },
    component: carwashafterphoto
  },
  {
    path: '/addcarwashcost',
    name: 'addcarwashcost',
    meta: {
      title: '录入洗车费用'
    },
    component: addcarwashcost
  },
  {
    path: '/gooutpaymoney',
    name: 'gooutpaymoney',
    meta: {
      title: '出场缴费'
    },
    component: gooutpaymoney
  },
  {
    path: '/checkbeforephoto',
    name: 'checkbeforephoto',
    meta: {
      title: '查看洗车前拍照'
    },
    component: checkbeforephoto
  },
  {
    path: '/checkafterphoto',
    name: 'checkafterphoto',
    meta: {
      title: '查看洗车后拍照'
    },
    component: checkafterphoto
  },
  {
    path: '/checkwashcost',
    name: 'checkwashcost',
    meta: {
      title: '查看洗车费用'
    },
    component: checkwashcost
  },
  {
    path: '/checkpaymoney',
    name: 'checkpaymoney',
    meta: {
      title: '查看出场缴费'
    },
    component: checkpaymoney
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
    path: '/finshcarwash',
    name: 'finshcarwash',
    meta: {
      title: '结束工单'
    },
    component: finshcarwash
  },
  {
    path: '/finshcarwashdetail',
    name: 'finshcarwashdetail',
    meta: {
      title: '工单详情'
    },
    component: finshcarwashdetail
  },
  {
    path: '/mycarwashlist',
    name: 'mycarwashlist',
    meta: {
      title: '我的洗车工单'
    },
    component: mycarwashlist
  },
  {
    path: '/checkedcarwashlist',
    name: 'checkedcarwashlist',
    meta: {
      title: '待检查列表'
    },
    component: checkedcarwashlist
  },
  {
    path: '/selectmapnet',
    name: 'selectmapnet',
    meta: {
      title: '搜索网点'
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
  {
    path: '/operacarwashlist',
    name: 'operacarwashlist',
    meta: {
      title: '车辆洗车列表'
    },
    component: operacarwashlist
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
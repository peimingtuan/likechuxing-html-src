//@xurr on 18/06/07 车辆问题记录列表路由配置
import Vue from 'vue'
import Router from 'vue-router'
import proCheck from './components/proCheck' //@xurr 180608 车辆问题记录勾选单
import proList from './components/proList' //@xurr 180611 车辆问题列表
import proDetails from './components/proDetails' //@xurr 180611 车辆问题列表详情
import carProDetail from './components/carProDetail' //@xurr 180612 车辆问题详情
import handleHistory from './components/handleHistory' //@xurr 180613 操作历史页面
import searchPro from './components/searchPro' //@xurr 180614 搜索页面
import pictureHis from './components/pictureHis' //@xurr 180620 历史验车单
import createOrder from './components/createOrder' //@xurr 180620 创建故障工单
//import enterRouter from '@/components/common/enterRouter'
Vue.use(Router)
let home_routes = [  
	{//@xurr 180608 车辆问题记录勾选单
      path: '/proCheck',
      name: 'proCheck',
      component: proCheck
    },
	{//@xurr 180611 车辆问题列表
      path: '/proList',
      name: 'proList',
      component: proList
    },
	{//@xurr 180611 车辆问题列表详情
      path: '/proDetails',
      name: 'proDetails',
      component: proDetails
    },
	{//@xurr 180612 车辆问题详情
      path: '/carProDetail',
      name: 'carProDetail',
      component: carProDetail
    },
	{//@xurr 180613 操作历史
      path: '/handleHistory',
      name: 'handleHistory',
      component: handleHistory
    },
	{//@xurr 180614 搜索页面
      path: '/searchPro',
      name: 'searchPro',
      component: searchPro
    },
	{//@xurr 180620 历史验车单
      path: '/pictureHis',
      name: 'pictureHis',
      component: pictureHis
    },
	{//@xurr 180620 创建新的故障工单
      path: '/createOrder',
      name: 'createOrder',
      component: createOrder
    },
]
let routes=home_routes
const router = new Router({
  history: false,
  routes : routes
});
export default router;
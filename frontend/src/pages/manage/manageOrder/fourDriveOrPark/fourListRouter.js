//@xurr on 180717 开四停四调度列表
import Vue from 'vue'
import Router from 'vue-router'
import fourIndex from './fourIndex' //@xurr 180717 开四停四调度列表
import fourDetail from './fourDetail' //@xurr 180719 网点车辆详情
import groupTask from './groupTask' //@xurr  180731 小组任务列表
import groupDetail from './groupDetail' //@xurr  180801 小组任务详情
//import enterRouter from '@/components/common/enterRouter'
Vue.use(Router)
let home_routes = [  
	{//@xurr 180717 开四停四调度列表
      path: '/fourIndex',
      name: 'fourIndex',
      component: fourIndex
   	},
	{//@xurr 180719 网点车辆详情
      path: '/fourDetail',
      name: 'fourDetail',
      component: fourDetail
   	},
	{//@xurr 180731 小组任务列表
      path: '/groupTask',
      name: 'groupTask',
      component: groupTask
   	},
	{//@xurr 180801 小组任务详情
      path: '/groupDetail',
      name: 'groupDetail',
      component: groupDetail
   	},
]
let routes=home_routes
const router = new Router({
  history: false,
  routes : routes
});

export default router;
//@xurr on 180717 开四停四调度列表
import Vue from 'vue'
import Router from 'vue-router'
import warnList from './warnList' //@xurr 180823 预警列表
import notMove from './notMove' //@xurr 180823 24小时未动
import longDistance from './longDistance' //@xurr 180823 远距离车辆
import searchPro from './searchPro' //@xurr 180823 搜索
//import enterRouter from '@/components/common/enterRouter'
Vue.use(Router)
let home_routes = [  
	{//@xurr 180823  预警列表
      path: '/warnList',
      name: 'warnList',
      component: warnList
   	},
	{//@xurr 180823  24小时未动
      path: '/notMove',
      name: 'notMove',
      component: notMove
   	},
	{//@xurr 180823  远距离车辆
      path: '/longDistance',
      name: 'longDistance',
      component: longDistance
   	},
	{//@xurr 180823  搜索
      path: '/searchPro',
      name: 'searchPro',
      component: searchPro
   	}
	
]
let routes=home_routes
const router = new Router({
  history: false,
  routes : routes
});

export default router;
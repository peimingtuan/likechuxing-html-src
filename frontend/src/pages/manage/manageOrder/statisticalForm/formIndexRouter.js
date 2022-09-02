//@xurr on 180904 统计报表
import Vue from 'vue'
import Router from 'vue-router'
import formList from './formList' //@xurr 180904 统计报表
import carNums from './carNums' //@xurr 180904 车辆数统计
import carDetails from './carDetails' //@xurr 180905 车辆明细
Vue.use(Router)
let home_routes = [  
	{//@xurr 180904 统计报表
      path: '/formList',
      name: 'formList',
      component: formList
   	},
	{//@xurr 180904 车辆数统计
      path: '/carNums',
      name: 'carNums',
      component: carNums
   	},
	{//@xurr 180905 车辆明细
      path: '/carDetails',
      name: 'carDetails',
      component: carDetails
   	},
	
	
]
let routes=home_routes
const router = new Router({
  history: false,
  routes : routes
});

export default router;
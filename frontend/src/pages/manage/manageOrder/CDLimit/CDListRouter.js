//@xurr on 18/08/10  成都限行列表
import Vue from 'vue'
import Router from 'vue-router'
import limitIndex from './limitIndex' //@xurr 180810 成都限行列表
import limitDetail from './limitDetail' //@xurr 180810 成都限行列表网点车辆详情
Vue.use(Router)
let home_routes = [  
	{//@xurr 180810 成都限行
      path: '/limitIndex',
      name: 'limitIndex',
      component: limitIndex
   	},
	{//@xurr 180810 成都限行列表网点车辆详情
      path: '/limitDetail',
      name: 'limitDetail',
      component: limitDetail
   	},
	
]
let routes=home_routes
const router = new Router({
  history: false,
  routes : routes
});

export default router;
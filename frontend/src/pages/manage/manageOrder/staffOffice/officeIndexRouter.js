//@xurr on 18/06/26 事故管理
import Vue from 'vue'
import Router from 'vue-router'
import office from './office' //@xurr 180626 事故管理
//import enterRouter from '@/components/common/enterRouter'
Vue.use(Router)
let home_routes = [  
	{//@xurr 180626 事故管理
      path: '/office',
      name: 'office',
      component: office
    },
	
    
]
let routes=home_routes
const router = new Router({
  history: false,
  routes : routes
});
export default router;
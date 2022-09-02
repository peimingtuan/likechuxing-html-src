//@xurr on 180904 统计报表
import Vue from 'vue'
import Router from 'vue-router'


import formList from '../pages/formList' //@xurr 180904 统计报表
import carNums from '../pages/carNums' //@xurr 180904 车辆数统计
import carDetails from '../pages/carDetails' //@xurr 180905 车辆明细
import k4t4Data from '../pages/k4t4Data' 
import CarStatistics  from '../pages/carStatistics'


import dd from '../../../../../other_modules/like-manageOrder/ddSDK'
Vue.use(Router)
let home_routes = [ 
	{//@xurr 180904 统计报表
      path: '/formList',
      name: 'formList',
      component: formList
   	},
	{//@xurr 180905 车辆明细
      path: '/carDetails',
      name: 'carDetails',
      component: carDetails
     },
	{//@xurr 180905 车辆统计
    path: '/carStatistics',
    name: 'carStatistics',
    component: CarStatistics
  },{
    path:'/k4t4Data',
    name:'k4t4Data',
    component:k4t4Data
  }
]
let routes=home_routes
const router = new Router({
  history: false,
  routes : routes
});


/*router.beforeEach((to, from, next)=>{
  to.matched.forEach(route => {
    if(!dd.inDDApp && route.meta.needDD){
      next('/')
    }else{
      next()
    }
  })
})*/

//router.beforeEach((to, from, next)=>{
//to.matched.forEach(route => {
//  if(dd.inDDApp && route.meta.title){
//    document.title = route.meta.title
//    dd.setWebTitle(route.meta.title)
//  }
//})
//
//next()
//})

export default router
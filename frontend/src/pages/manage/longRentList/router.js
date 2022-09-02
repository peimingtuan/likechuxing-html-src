import Vue from 'vue'
import Router from 'vue-router'
import { DDBase } from '../../../../other_modules/like-manageOrder/ddSDK'
import workList from './pages/workList'
import listDetail from './pages/listDetail'
import allList from './pages/allList'
import addCar from './pages/addCar'
import longRentStatistics from './pages/longRentStatistics'
import searchPreparation from './pages/searchPreparation'
import searchLongRent from './pages/searchLongRent'

Vue.use(Router)
const router  = new Router({
    routes:[
        {
            path:'/',
            component:workList,
            meta:{
                title:'长租列表',
            }
        },
        {
            path:'/detail',
            component:listDetail,
            meta:{
                title:'网点车辆详情',
            }
        },
        {
            path:'/allList',
            component:allList,
            meta:{
                title:'网点车辆详情',
            }
        },
        {
            path:'/addCar',
            component:addCar,
            meta:{
                title:'添加整备车辆',
            }
        },
        {
            path:'/longRentStatistics',
            component:longRentStatistics,
            meta:{
                title:'长租统计',
            }
        },
        {
            path:'/searchLongRent',
            component:searchLongRent,
            meta:{
                title:'搜索',
            }
        },
        {
            path:'/searchPreparation',
            component:searchPreparation,
            meta:{
                title:'搜索',
            }
        },
        {
            path:'/longRentStatistics',
            component:longRentStatistics,
            meta:{
                title:'长租统计',
            }
        },
 
    ],
    scrollBehavior(to,from,position){
        if(position===null){
            console.log('enter')
        }else{
            console.log('back')
            from.meta.destoryed = true
            return position
        }
    }
})
router.beforeEach((to, from, next) => {
    document.title = to.meta.title
    if (DDBase.inDDApp) {
        DDBase.setWebTitle(to.meta.title)
    }
    next()
  })
export default router
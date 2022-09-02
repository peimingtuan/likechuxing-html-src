import Vue from 'vue'
import Router from 'vue-router'
import { DDBase } from '../../../../other_modules/like-manageOrder/ddSDK'
import workList from './pages/workList'
import searchItem from './pages/searchItem'
import createWork from './pages/createWork'
import imagePreview from './pages/imagePreview'
import violationInfo from './pages/violationInfo'
import workDetail from './pages/workDetail'
import updateImage from './pages/updateImage'
import updateStatus from './pages/updateStatus'
import feeInfo from './pages/feeInfo'
import finishWork from './pages/finishWork'
import dotMap from './pages/dotMap'
import detailPreview from './pages/detailPreview'
import operationList from './pages/operationList'
import seeImage from './pages/seeImage'
import myList from './pages/myList'
import carWorkList from './pages/carWorkList'

Vue.use(Router)
const router  = new Router({
    routes:[
        {
            path:'/',
            component:workList,
            meta:{
                title:'年检工单',
            }
        },
        {
            path:'/violationInfo',
            component:violationInfo,
            meta:{
                title:'违章详情',
            } 
        },
        {
            path:'/workDetail',
            component:workDetail,
            meta:{
                title:'年检工单详情',
            } 
        },
        {
            path:'/updateImage',
            component:updateImage,
            meta:{
                title:'年检拍照',
            } 
        },
        {
            path:'/searchItem',
            component:searchItem,
            meta:{
                title:'搜索'
            }
        },
        {
            path:'/createWork',
            component:createWork,
            meta:{
                title:'创建年检工单'
            }
        },
        {
            path:'/updateStatus',
            component:updateStatus,
            meta:{
                title:'更新状态',
            }
        },
        {
            path:'/feeInfo',
            component:feeInfo,
            meta:{
                title:'费用信息'
            }
        },
        {
            path:'/dotMap',
            component:dotMap,
            meta:{
                title:'网点列表'
            }
        },
        {
            path:'/imagePreview',
            component:imagePreview,
            meta:{
                title:'年检标志图片'
            }
        },
        {
            path:'/detailPreview',
            component:detailPreview,
            meta:{
                title:'年检工单'
            }
        },
        {
            path:'/finishWork',
            component:finishWork,
            meta:{
                title:'结束工单'
            }
        },
        {
            path:'/operationList',
            component:operationList,
            meta:{
                title:'工单详情'
            }
        },
        {
            path:'/seeImage',
            component:seeImage,
            meta:{
                title:'年检照片'
            }
        },
        {
            path:'/myList',
            component:myList,
            meta:{
                title:'年检工单'
            }
        },
        {
            path:'/carWorkList',
            component:carWorkList,
            meta:{
                title:'车辆年检工单'
            }
        }
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
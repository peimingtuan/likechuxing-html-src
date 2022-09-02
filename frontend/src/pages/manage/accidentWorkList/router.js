import Vue from 'vue'
import Router from 'vue-router'
import workList from './pages/workList'
import searchItem from './pages/searchItem'
import createWork from './pages/createWork'
import connectRental from './pages/connectRental'
import workListDetail from './pages/workListDetail'
import imagePreview from './pages/imagePreview'
import updateWork from './pages/updateWork'
import updateAccidentImages from './pages/updateAccidentImages'
import updateHistory from './pages/updateHistory'
import updateResponsibilityImages from './pages/updateResponsibilityImages'
import createAccountability from './pages/createAccountability'
import seeAccountability from './pages/seeAccountability'
import updateAccountability from './pages/updateAccountability'
import accountabilityDetail from './pages/accountabilityDetail'
import loss from './pages/loss'
import updateLossImages from './pages/updateLossImages'
import updateLoss from './pages/updateLoss'
import seeLoss from './pages/seeLoss'
import lossDetail from './pages/lossDetail'
import indemnityInfo from './pages/indemnityInfo'
import settlementInfo from './pages/settlementInfo'
import createRepair from './pages/createRepair'
Vue.use(Router)
const router  = new Router({
    routes:[
        {
            path:'/',
            component:workList,
            meta:{
                title:'事故保险工单',
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
                title:'创建事故保险工单'
            }
        },
        {
            path:'/connectRental',
            component:connectRental,
            meta:{
                title:'关联订单',
            }
        },
        {
            path:'/workListDetail',
            component:workListDetail,
            meta:{
                title:'事故详情'
            }
        },
        {
            path:'/updateWork',
            component:updateWork,
            meta:{
                title:'更新事故单'
            }
        },
        {
            path:'/imagePreview',
            component:imagePreview,
            meta:{
                title:'事故图片详情'
            }
        },
        {
            path:'/updateAccidentImages',
            component:updateAccidentImages,
            meta:{
                title:'上传事故照片'
            }
        },
        {
            path:'/updateHistory',
            component:updateHistory,
            meta:{
                title:'操作历史'
            }
        },
        {
            path:'/updateResponsibilityImages',
            component:updateResponsibilityImages,
            meta:{
                title:'上传定责照片'
            }
        },
        {
            path:'/createAccountability',
            component:createAccountability,
            meta:{
                title:'定责信息登记'
            }
        },
        {
            path:'/updateAccountability',
            component:updateAccountability,
            meta:{
                title:'修改定责信息'
            }
        },
        {
            path:'/seeAccountability',
            component:seeAccountability,
            meta:{
                title:'查看定责照片'
            }
        },
        {
            path:'/accountabilityDetail',
            component:accountabilityDetail,
            meta:{
                title:'定责信息详情'
            }
        },
        {
            path:'/loss',
            component:loss,
            meta:{
                title:'登记定损信息'
            }
        },
        {
            path:'/updateLoss',
            component:updateLoss,
            meta:{
                title:'修改定损信息'
            }
        },
        {
            path:'/updateLossImages',
            component:updateLossImages,
            meta:{
                title:'上传定损照片'
            }
        },
        {
            path:'/lossDetail',
            component:lossDetail,
            meta:{
                title:'定损信息详情'
            }
        },
        {
            path:'/seeLoss',
            component:seeLoss,
            meta:{
                title:'查看定损照片'
            }
        },
        {
            path:'/indemnityInfo',
            component:indemnityInfo,
            meta:{
                title:'用户赔付信息'
            }
        },
        {
            path:'/settlementInfo',
            component:settlementInfo,
            meta:{
                title:'财务结算信息'
            }
        },
        {
            path:'/createRepair',
            component:createRepair,
            meta:{
                title:'新建维修工单'
            }
        }
    ],
    scrollBehavior(to,from,position){
        if(position===null){
            console.log('enter')
        }else{
            console.log('back')
            return position
        }
    }
})
router.beforeEach((to, from, next) => {
    document.title = to.meta.title
    next()
})
export default router
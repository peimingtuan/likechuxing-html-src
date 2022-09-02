/**
 * Created by garvey on 2017/8/28.
 */
import Deposit from '../pages/deposit/index.vue'
import History from '../pages/deposit/history.vue'
import Refund from '../pages/deposit/refund.vue'
import ReasonList from '../pages/deposit/reasonList.vue'

export default [
  {
    path: '/user/deposit',
    meta: {
      title: '缴纳保证金',
      needAuth: true,
      needSDK: false
    },
    components: {
      mainView:Deposit
    }
  },
  {
    path: '/user/deposit/history',
    meta: {
      title: '保证金记录',
      needAuth: true
    },
    components: {
      mainView:History
    }
  },
  {
    path: '/user/deposit/refund',
    meta: {
      title: '退保证金',
      needAuth: true
    },
    components: {
      mainView:Refund
    }
  },
  {
    path: '/user/deposit/ReasonList',
    meta: {
      title: '退押金',
      needAuth: true
    },
    components: {
      mainView:ReasonList
    }
  }
]

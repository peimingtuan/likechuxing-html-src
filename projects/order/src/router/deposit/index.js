/**
 * Created by garvey on 2017/8/28.
 */
import Index from '../../pages/deposit/index.vue'
import History from '../../pages/deposit/history.vue'
import Return from '../../pages/deposit/return.vue'
import ReasonList from '../../pages/deposit/reasonList.vue'

export default [
  {
    name: 'deposit',
    path: '/deposit/index',
    meta: {
      title: '押金',
      needAuth: true,
      needWx: true,
      needOpenId: true
    },
    components: {
      mainView: Index
    }
  },
  {
    name: 'depositHistory',
    path: '/deposit/history',
    meta: {
      title: '押金记录',
      needAuth: true
    },
    components: {
      mainView: History
    }
  },
  {
    name: 'depositReturn',
    path: '/deposit/return',
    meta: {
      title: '退押金',
      needAuth: true
    },
    components: {
      mainView: Return
    }
  },
  {
    name: 'reasonList',
    path: '/deposit/ReasonList',
    meta: {
      title: '退押金',
      needAuth: true
    },
    components: {
      mainView: ReasonList
    }
  }
]

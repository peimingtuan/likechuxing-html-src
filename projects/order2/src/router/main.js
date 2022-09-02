/**
 * Created by garvey on 2017/8/25.
 */
import Index from '../pages/main/index.vue'
import Rental from '../pages/main/rental'
import User from '../pages/user/index.vue'

export default [
  {
    path: '/index',
    meta: {
      title: '立刻出行'
    },
    components: {
      mainView: Index
    }
  },
  {
    path: '/rental',
    meta: {
      title: '待取车'
    },
    components: {
      mainView: Rental
    },
    children:[
      {
        path:'user',
        component:User
      },
    ]
  }
]

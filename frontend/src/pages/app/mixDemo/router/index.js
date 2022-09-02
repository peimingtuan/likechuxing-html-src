import Vue from 'vue'
import Router from 'vue-router'
import env from '../../../../../other_modules/like-env'
import appArguments from '../../../../../other_modules/app-arguments'

import Main from '../pages/main.vue'
import Media from '../pages/media'
import Send from '../pages/send'
import Info from '../pages/info'
import Call from '../pages/call'
import Share from '../pages/share'
import Jump from '../pages/jump'
import PopMessage from '../pages/popMessage'

Vue.use(Router)

const router = new Router({
  mode:'hash',
  routes: [
    {
      path:'/',
      component: Main,
      /*beforeEnter:(to,from,next)=>{
        if(appArguments.in_app && env.isIos){
          if(window.history.length === 1 && from.path === '/') {
            window.history.pushState({}, 'statTitle', '/bufferforios')
            setTimeout(function(){
              window.history.go(-1)
            },0)
          }
        }
        next()
      }*/
    },
    {
      path:'/media',
      component: Media
    },
    {
      path:'/send',
      component: Send
    },
    {
      path:'/info',
      component: Info
    },
    {
      path:'/call',
      component:Call
    },
    {
      path:'/share',
      component:Share
    },
    {
      path:'/jump',
      component:Jump
    },
    {
      path:'/popMessage',
      component:PopMessage
    }
  ]
})

export default router

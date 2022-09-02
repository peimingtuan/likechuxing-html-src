/*************************************************
 * Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 * File name: dll_list
 * Author: garvey sunjiawei@likechuxing.com
 * Version: 1.0.0
 * Date: 2018-11-26-16:06
 * Description:
 *
 *************************************************/

 module.exports = [
   {
     name:'vconsole',
     version:'100',
     resource:['./other_modules/like-tool/vconsole.js']
   },
   {
     name:'mint_ui_vue',
     version:'100',
     resource:['mint-ui/lib','vue/dist/vue.esm.js','vuex','vue-router']
   },
   {
     name:'like_request',
     version:'101',
     resource:[
       './other_modules/like-request/withAxiosV3.js',
       './other_modules/url-constructor/index.js'
     ]
   },
   {
     name:'react_dom_router_reflux',
     version:'100',
     resource:['react','react-dom','react-router-dom','reflux']
   },
   {
     name:'jquery',
     version:'100',
     resource:['jquery']
   },
   {
     name:'vue',
     version:'104',
     resource:['vue/dist/vue.esm.js']
   },
   {
     name:'vuer',
     version:'104',
     resource:['vue/dist/vue.esm.js','vue-router']
   },
   {
     name:'vuex',
     version:'104',
     resource:['vue/dist/vue.esm.js','vuex']
   },
   {
     name:'vueFull',
     version:'104',
     resource:['vue/dist/vue.esm.js','vuex','vue-router']
   },
   {
     name:'manageOrder',
     version:'104',
     resource:['md5','sha1']
   },
   {
     name:'bscroll',
     version:'104',
     resource:['better-scroll']
   },
   {
     name:'like_base',
     version:'104',
     resource:['md5','axios']
   }
 ]
<template>
    <router-view />
</template>

<script>
    import appArguments from '../../../../other_modules/app-arguments'
    import myAjax from "../../../../other_modules/like-request/withAxiosV2";
    import {getApiUrl} from "./js/getApiUrl";
    // require('../../../component/vconsole')

  export default {
    name: "indexPage",
    methods:{
      _getData(){
        let shareKey = appArguments.shareKey

        if(!shareKey){
          // 未取到红包id
          return false
        }

        let open_id = appArguments.open_id

        if(!open_id){
          // 未取到open_id
          return false
        }

        return {
          shareKey,
          open_id
        }
      }
    },
    created(){      
      /*从url取 红包id，open_id
      接口拿红包状态和用户绑定的手机号,用户头像，用户昵称
      if(红包过期){
        router.push(fail)
      }else if（没绑定手机）{
        push(login)
      }else if(领过这个包){
        push(finish)
      }else if(该用户今日次数抵达上线){
        push(fail)
      }else if(这个包领完了){
        push(fail)
      }else{
        push(finish)
      }*/

      let data = this._getData()

      if(!data){
        console.log('必要参数缺失',data)
        return
        // 非法开的链接都去红包过期
        this.$router.push({
          path:'/fail',
          query:{
            type:1
          }
        })
      }else{
        this.$store.commit('setBase',data)

        myAjax.post(getApiUrl('/share-coupon/get-coupon'),{
          shareKey:data.shareKey,
          openid:data.open_id
        }).then(res=>{
          this.$store.dispatch('handleGetCoupon',res)
        })
      }

    }
  }
</script>

<style lang=less>

</style>
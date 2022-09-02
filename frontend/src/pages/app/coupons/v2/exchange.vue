<template>
    <div class="exchange">
        <div class="header">
            <input class="code" v-model.trim="code" type="text" placeholder="输入兑换码" />
        </div>
        <div class="footer">
            <button class="btn" @click="exchange">兑换</button>
        </div>
    </div>
</template>

<script>
  import appArguments from '../../../../other_modules/app-arguments'
  import myAjax from '../../../../other_modules/like-request/withAxiosV2'
  import {getApiUrl} from '../../../../other_modules/url-constructor/index'

  export default {
    name: "exchange",
    data(){
      return {
        uuid: appArguments.uuid,
        sign: appArguments.sign,
        code:''
      }
    },
    computed:{
      couldSubmit(){
        return this.code.length > 0
      }
    },
    methods:{
        exchange(){
          if(this.couldSubmit){
            let loading = this.$_LIKE_loading('兑换中...')
            myAjax.post(getApiUrl('/coupon/convert'), {
              uuid:this.uuid,
              sign:this.sign,
              code:this.code
            }).then(res=>{
              loading.close()
              if(res.status === 0){
                this.$_LIKE_toast({
                  msg:'兑换成功',
                  toastCallback:function () {
                    window.history.back()
                  }
                })
              }else{
                this.$_LIKE_toast(res.msg)
              }
            }).catch(err=>{
              loading.close()
              console.log(err)
            })
          }else{
            this.$_LIKE_toast('请输入兑换码')
          }
        }
    },
    created(){

    }
  }
</script>

<style lang=less scoped>

</style>
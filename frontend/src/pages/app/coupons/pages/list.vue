<template>
    <div class="CouponHistory">
        <div v-if="dataReady">
            <PullDownRefresh
                    :opt="opt"
                    @pullDown="pullDown"
                    @pullUp="pullUp"
                    ref="pullUpDown"
            >
                <CouponBox
                        v-for="item in coupons"
                        :key="item.id"
                        :data="item"
                        bgColor="#f2f2f2"
                />
            </PullDownRefresh>
        </div>

    </div>
</template>

<script>
  import myAjax from '../../../../../other_modules/like-request/withAxiosV3'
  import {getApiUrl,getH5Url} from '../../../../../other_modules/url-constructor/index'
  import CouponBox from '../../../../../other_modules/vue-coupon/couponBoxV3'
  import Coupon from '../../../../../other_modules/like-model/models/Coupon'
  import PullDownRefresh from '../../../../../other_modules/vue-pullDownRefresh'
  import {appMutual} from '../../../../../other_modules/app-mutual'
  import env from '../../../../../other_modules/like-env'

  export default {
    name: "list",
    components: {
      PullDownRefresh,
      CouponBox
    },
    data () {
      return {
        dataReady: false,
        // 类型：0=优惠券，1=红包
        type:Number(this.$route.query.type),
        opt: {
          height: window.innerHeight,// 容器高度
          usePullDown: true,// 是否启用下拉
          usePullUp: true // 是否启用上拉
        },
        offset:0,
        coupons:[]
      }
    },

    methods:{
      getCoupons(begin){
        return myAjax.post(getApiUrl('/coupon/list'), Object.assign({},this.$store.getters.publicArguments,{
          begin:begin,
          status: 0,
          // 区分是红包还是优惠券
          type:this.type,
          version:2
        }))
      },

      pullDown(){
        this.getCoupons(0).then(res=>{
          if (res.status !== 0) throw res
          this.coupons = res.data.map(item => new Coupon(item,this.type === 1))
          this.offset = this.coupons.length
          this.$refs.pullUpDown.update()
        }).catch(err=>{
          this.$refs.pullUpDown.update()
          if(err && err.msg){
            this.$_LIKE_toast(err.msg)
          }else{
            console.log(err)
          }
        })

      },

      pullUp(){
        this.getCoupons(this.offset).then(res=>{
          if(res.data.length === 0){
            this.$refs.pullUpDown.update({
              noMore:true
            })
          }else{
            this.coupons = this.coupons.concat(res.data.map(item => new Coupon(item,this.type === 1)))
            this.offset = this.coupons.length
            this.$refs.pullUpDown.update()
          }
        }).catch(err=>{
          this.$refs.pullUpDown.update()
          if(err && err.msg){
            this.$_LIKE_toast(err.msg)
          }else{
            console.log(err)
          }
        })

      }
    },
    created () {
      if(env.isInLike){
        appMutual.send.updateTitle(Number(this.$route.query.type) === 1 ? '红包':'优惠券')

        window.toInstructions = ()=>{
          appMutual.send.url({
            url:getH5Url('/app/coupons/index.html#/detail?type='+this.type),
            request_type:'get',
            destroy_current:0   // 是否销毁之前页
          })
        }

        appMutual.send.updateHeaderRight("使用说明","toInstructions")
      }

      let loading = this.$_LIKE_loading()

      this.getCoupons(0).then(res=>{
        if (res.status !== 0) throw res
        loading.close()
        this.dataReady = true
        this.coupons = res.data.map(item => new Coupon(item,this.type === 1))
        this.offset = this.coupons.length
        this.$nextTick(()=>{
          this.$refs.pullUpDown.update()
        })
      }).catch(err=>{
        loading.close()
        this.dataReady = true
        this.$nextTick(()=>{
          this.$refs.pullUpDown.update()
        })

        if(err && err.msg){
          this.$_LIKE_toast(err.msg)
        }else{
          console.log(err)
        }
      })
    }
  }
</script>

<style lang=less scoped>

</style>
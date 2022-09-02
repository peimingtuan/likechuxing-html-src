<template>
    <div class="CouponHistory">
        <div v-if="dataReady">
            <PullDownRefresh
                    v-if="coupons.length > 0"
                    :opt="opt"
                    @pullDown="pullDown"
                    @pullUp="pullUp"
                    ref="pullUpDown"
            >
                <CouponBox
                        v-for="item in coupons"
                        :key="item.id"
                        :data="item"
                />
            </PullDownRefresh>

            <div class="empty" v-else>
                <div class="img"></div>
                <p>历史优惠券为空</p>
            </div>
        </div>

    </div>
</template>

<script>
  import appArguments from '../../../../other_modules/app-arguments'
  import myAjax from '../../../../other_modules/like-request/withAxiosV2'
  import {getApiUrl} from '../../../../other_modules/url-constructor/index'
  import CouponBox from '../../../../other_modules/vue-coupon/couponBoxV2'
  import {Coupon} from '../../../../other_modules/like-model/'
  import PullDownRefresh from '../../../../other_modules/vue-pullDownRefresh'

  export default {
    name: "history",
    components: {
      PullDownRefresh,
      CouponBox
    },
    data () {
      return {
        dataReady: false,
        uuid: appArguments.uuid,
        sign: appArguments.sign,

        opt: {
          height: window.innerHeight,// 容器高度
          usePullDown: true,// 是否启用下拉
          usePullUp: true // 是否启用上拉
        },

        offset: 0,
        coupons: []
      }
    },
    methods:{
      getCoupons(){
        return myAjax.post(getApiUrl('/coupon/list'), {
          uuid: this.uuid,
          sign: this.sign,
          begin:this.offset,
          status: 1,
          version:2
        }).then(res=>{
          if(res.status === 0){
            res.data = res.data.map(item=>{
              item.valid = 0
              return item
            })
          }
          return res
        })
      },
      pullDown(){
        this.offset = 0

        this.getCoupons().then(res=>{
          if (res.status !== 0) throw res

          this.coupons = res.data.map(item => new Coupon(item))
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
        this.getCoupons().then(res=>{
          if (res.status !== 0) throw res

          if(res.data.length === 0){
            this.$refs.pullUpDown.update({
              noMore:true
            })
          }else{
            this.coupons = this.coupons.concat(res.data.map(item => new Coupon(item)))
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
      let loading = this.$_LIKE_loading()

      this.getCoupons().then(res=>{
        loading.close()
        if (res.status !== 0) throw res

        this.coupons = this.coupons.concat(res.data.map(item => new Coupon(item)))
        this.offset = this.coupons.length
        this.dataReady = true
      }).catch(err=>{
        loading.close()
        this.dataReady = true

        if(err && err.msg){
          this.$_LIKE_toast(err.msg)
        }else{
          console.log(err)
        }
      })
    },
  }
</script>

<style lang=less scoped>

</style>
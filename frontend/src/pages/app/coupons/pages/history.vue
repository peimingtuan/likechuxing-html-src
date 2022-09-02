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
                        bgColor="#f2f2f2"
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
  import myAjax from '../../../../../other_modules/like-request/withAxiosV3'
  import {getApiUrl} from '../../../../../other_modules/url-constructor/index'
  import CouponBox from '../../../../../other_modules/vue-coupon/couponBoxV3'
  import Coupon from '../../../../../other_modules/like-model/models/Coupon'
  import PullDownRefresh from '../../../../../other_modules/vue-pullDownRefresh'

  export default {
    name: "history",
    components: {
      PullDownRefresh,
      CouponBox
    },
    data () {
      return {

        opt: {
          height: window.innerHeight,// 容器高度
          usePullDown: true,// 是否启用下拉
          usePullUp: true // 是否启用上拉
        },

        coupons: [],

        dataReady: false,

        coupon_list: [],
        coupon_cash_list: [],

        coupon_empty: false,
        coupon_cash_empty: false
      }
    },
    methods: {
      getCoupons (isBeginFromZero,clear) {
        if (this.coupon_empty && this.coupon_cash_empty) {
          return
        }

        let promise_list = []
        let coupon_list = []
        let coupon_cash_list = []

        if (!this.coupon_empty) promise_list.push(myAjax.post(getApiUrl('/coupon/list'), Object.assign({},this.$store.getters.publicArguments,{
          begin: isBeginFromZero?0:this.coupon_list.length,
          status: 1,
          type: 0,
          version: 2
        })).then(res=>{
          if (res.status === 0) {
            if(res.data.length === 0){
              this.coupon_empty = true
            }else{
              coupon_list = res.data.map(item => new Coupon(item))
              this.coupon_list = this.coupon_list.concat(coupon_list)
            }
          }
        }))

        if (!this.coupon_cash_empty) promise_list.push(myAjax.post(getApiUrl('/coupon/list'), Object.assign({},this.$store.getters.publicArguments,{
          begin: isBeginFromZero?0:this.coupon_cash_list.length,
          status: 1,
          type: 1,
          version: 2
        })).then(res=>{
          if (res.status === 0) {
            if(res.data.length === 0){
              this.coupon_cash_empty = true
            }else{
              coupon_cash_list = res.data.map(item => new Coupon(item, true))
              this.coupon_cash_list = this.coupon_cash_list.concat(coupon_cash_list)
            }

          }
        }))


        return Promise.all(promise_list).then(res => {
          let coupon = coupon_list.concat(coupon_cash_list).sort((a,b)=>b.time_start-a.time_start)
          if(clear){
            this.coupons = coupon
          }else{
            this.coupons = this.coupons.concat(coupon)
          }
          return coupon
        })

      },
      pullDown () {
        this.coupon_empty = false
        this.coupon_cash_empty = false
        this.coupon_list = []
        this.coupon_cash_list = []

        this.getCoupons(true,true).then(res=>{
          this.$refs.pullUpDown.update()
        })
      },

      pullUp () {

        this.getCoupons().then(res=>{
          this.$refs.pullUpDown.update({
            noMore: res.length === 0
          })
        })
      }
    },
    created () {
      /*      window.toExchangeList = ()=>{
                appMutual.send.url({
                url:getH5Url(`/app/couponExchangeList/index.html${window.location.search}`),
                request_type:'get',
                destroy_current:0   // 是否销毁之前页
              })
            }
            appMutual.send.updateHeaderRight("兑换记录","toExchangeList")*/
      let loading = this.$_LIKE_loading()

      this.getCoupons().then(() => {
        this.dataReady = true
        loading.close()
      }).catch(err => {
        loading.close()
        if (err && err.msg) {
          this.$_LIKE_toast(err.msg)
        } else {
          console.log(err)
        }
      })

    },
  }
</script>

<style lang=less scoped>

</style>
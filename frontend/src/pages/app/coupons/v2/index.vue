<template>
    <div class="CouponPage">
        <div class="header" ref="header">
            <button class="btn exchange" @click="toExchange">添加/兑换优惠券</button>
        </div>

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
                <p>当前暂无优惠券 <span class="check_history_url" @click="toHistory">查看历史优惠券</span></p>
            </div>
        </div>

        <div class="footer" v-if="dataReady && coupons.length > 0">
            <button class="btn check_history_url" @click="toHistory">查看历史优惠券</button>
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
    name: "index",
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
          height: 300,// 容器高度
          usePullDown: true,// 是否启用下拉
          usePullUp: true // 是否启用上拉
        },

        offset: 0,
        coupons: []
      }
    },
    methods: {
      toExchange () {
        window.location.href = 'exchange.html?footerColor=ffffff&' + window.location.search
      },
      toHistory () {
        window.location.href = 'history.html?footerColor=f2f2f2&' + window.location.search
      },
      getCoupons(){
        return myAjax.post(getApiUrl('/coupon/list'), {
          uuid: this.uuid,
          sign: this.sign,
          begin:this.offset,
          status: 0,
          version:2
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
        console.log(this.coupons)
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
    mounted(){
        this.opt.height = window.innerHeight - (this.$refs.header.offsetHeight*2 - 1)
    }
  }
</script>

<style lang=less>

    .header{
        background-color: #fff;
        padding: 0.15rem;
        border-bottom: solid 1px #dfdfdf;
        box-sizing: border-box;
        .btn{
            width: 100%;
            height: 0.43rem;
            border:solid 1px #dfdfdf;
            border-radius: 3px;
            color:#111;
            font-size: 0.12rem;
            background-color: #fff;
        }
    }

    .footer{
        background-color: #f7f7f7;
        padding: 0.15rem;
        width: 100%;
        box-sizing: border-box;
        position: fixed;
        bottom:0;
        .btn{
            width: 100%;
            height: 0.43rem;
            border-radius: 3px;
            border:none;
            color:#fff;
            font-size: 0.15rem;
            background-color: #494b51;
        }
    }
</style>
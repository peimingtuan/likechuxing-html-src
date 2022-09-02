<template>
    <div class="CouponPage">
        <ActivityBox/>

        <ExchangeBox />

        <div v-if="dataReady" class="couponWrap">

            <div class="couponList" v-if="couponsList.num > 0">
                <div class="title">
                    优惠券
                    <span class="num">{{couponsList.num}} 个</span>
                    <span class="more" @click="toCoupon(0)">查看更多</span>
                </div>

                <CouponBox
                        v-for="item in couponsList.data"
                        :key="item.id"
                        :data="item"
                        bgColor="#fff"/>

            </div>

            <div class="couponList" v-if="show_cash && redPack.num > 0">
                <div class="title">红包 {{redPack.num}} 个
                    <span class="more" @click="toCoupon(1)">查看更多</span>
                </div>

                <CouponBox
                        v-for="item in redPack.data"
                        :key="item.id"
                        :data="item"
                        bgColor="#fff"/>

            </div>

            <div class="empty" v-if="couponsList.num <=0 && redPack.num<=0">
                <div class="img"></div>
                <p>当前暂无优惠 <span class="check_history_url" @click="toHistory">查看历史优惠</span></p>
            </div>
        </div>

        <div class="footer" v-if="dataReady && (redPack.num > 0 || couponsList.num > 0)">
            <p @click="toHistory">查看历史优惠</p>
        </div>
    </div>
</template>

<script>
  import myAjax from '../../../../../other_modules/like-request/withAxiosV3'
  import {getApiUrl, getH5Url} from '../../../../../other_modules/url-constructor/index'
  import CouponBox from '../../../../../other_modules/vue-coupon/couponBoxV3'
  import Coupon from '../../../../../other_modules/like-model/models/Coupon'
  import PullDownRefresh from '../../../../../other_modules/vue-pullDownRefresh'
  import {appMutual} from '../../../../../other_modules/app-mutual'
  import ExchangeBox from '../components/exchangeBox'
  import ActivityBox from '../components/activityBox'

  export default {
    name: "index",
    components: {
      PullDownRefresh,
      CouponBox,
      ExchangeBox,
      ActivityBox
    },
    data () {
      return {
        dataReady: false,

        show_cash: Boolean(this.$store.state.version > 2202),
        redPack: {
          title: "红包",
          num: 0,
          data: []
        },
        couponsList: {
          title: "优惠券",
          num: 0,
          data: []
        }
      }
    },
    methods: {

      toCoupon(type){
        this.$router.push({
          path:'/list',
          query:{
            type
          }
        })
      },
      toHistory () {
        this.$router.push({
          path:'/history'
        })
      }
    },
    created () {
      window.toExchangeList = () => {
        appMutual.send.url({
          url: getH5Url('/app/couponExchangeList/index.html'),
          request_type: 'get',
          destroy_current: 0   // 是否销毁之前页
        })
      }

      appMutual.send.updateHeaderRight("兑换记录", "toExchangeList")

      let loading = this.$_LIKE_loading()
      myAjax.post(getApiUrl('/voucher/list'), Object.assign({},this.$store.getters.publicArguments)).then(res => {
        // console.log(res);
        loading.close()
        if (res.status !== 0) throw res
        this.couponsList.data = res.data.coupon.map(item => new Coupon(item))
        this.redPack.data = res.data.coupon_cash.map(item => new Coupon(item,true))
        this.couponsList.num = Number(res.data.coupon_cnt)
        this.redPack.num = Number(res.data.coupon_cash_cnt)
        this.dataReady = true
      }).catch(err => {
        loading.close()
        this.dataReady = true
        if (err && err.msg) {
          this.$_LIKE_toast(err.msg)
        } else {
          console.log(err)
        }
      })

    },
    mounted(){
      /*if(!this.show_cash){
        this.$_LIKE_alert({
          title:'更新',
          msg:'红包仅可在最新版中使用，请及时更新',
          confirmButtonText:'我知道了'
        })
      }*/
    }

  }
</script>

<style lang=less>
    .couponWrap{
        padding-top:0;
    }
    .couponList{
        margin-top: .1rem;
        padding: .2rem 0 .1rem;
        background: #FFF;
        .title{
            padding: 0 0.15rem 0.05rem;
            font-size: 18px;
            color: #111;
            line-height: 1;

            .num{
                font-size: 16px;
            }

            .more{
                float: right;
                margin-top: .06rem;
                font-size: 12px;
                color: #888;
                padding-right: .09rem;
                background: url("../images/right_icon.png") no-repeat right center;
                background-size: 4.5px 7.5px;
            }
        }
    }

    .footer {
        background-color: #F2F2F2;
        padding: .35rem 0 .15rem;
        width: 100%;
        /* box-sizing: border-box; */
        /* position: fixed; */
        /* bottom:0; */
        p {
            font-size: 12px;
            text-align: center;
            color: #2E75A1;
        }
    }
</style>
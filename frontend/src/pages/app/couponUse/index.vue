<template>
    <div class="couponUse">
        <div v-if="data_ready">
            <div class="warn tips" v-if="left_num<1"><p class="i" @click="showRules">您今日的优惠可使用次数已用完</p></div>
            <div class="info tips" v-else><p class="i" @click="showRules">您今日还可使用<span
                    class="highlight">{{left_num}}</span>次优惠</p></div>
        </div>

        <div class="header">
            <button class="btn exchange" @click="()=>this.selectCoupon(0,0)">不使用{{type_name}}</button>
        </div>

        <div v-if="data_ready">
            <ul class="list coupon_list" v-if="coupons.length > 0">
                <CouponBox
                        v-for="item in coupons"
                        :key="item.id"
                        :data="item"
                        bgColor="#f7f7f7"
                        :choose="chosen_id===item.id"
                        @tapCoupon="tapCoupon"
                />
            </ul>

            <div class="empty" v-else>
                <div class="img"></div>
                <p>当前暂无{{type_name}}</p>
            </div>
        </div>

    </div>
</template>

<script>
  import appArguments from '../../../../other_modules/app-arguments'
  import {appMutual} from '../../../../other_modules/app-mutual/'
  import CouponBox from '../../../../other_modules/vue-coupon/couponBoxV3'
  import {Coupon} from '../../../../other_modules/like-model/'

  import myAjax from '../../../../other_modules/like-request/withAxiosV2'
  import {getApiUrl} from '../../../../other_modules/url-constructor/index'

  export default {
    name: "index",
    data () {
      return {
        // 0优惠券，1红包
        type: 0,

        data_ready: false,
        left_num: 3,
        is_reach_ceiling: 0,
        coupons: [],
        select_coupon_id: Number(appArguments.select_coupon_id) || 0,
        select_cash_id: Number(appArguments.select_cash_id) || 0
      }
    },
    computed: {
      type_name () {
        return this.type === 0 ? '优惠券' : '红包'
      },
      chosen_id () {
        if (this.type === 0) {
          // 优惠券
          return this.select_coupon_id
        } else {
          return this.select_cash_id
        }
      }
    },
    components: {
      CouponBox
    },
    methods: {
      showRules () {
        this.$_LIKE_alert({
          icon: 'tips',
          msg: '每位用户每日最多可使用3张优惠券',
          confirmButtonText: '知道了'
        })
      },
      tapCoupon (coupon) {
        if (!coupon.valid) return

        this.chosen_id = coupon.id

        this.selectCoupon(coupon.id, coupon.free_money)
      },
      selectCoupon (id, value) {
        let loading = this.$_LIKE_loading()
        myAjax.post(getApiUrl('/rental/visit'), {
          uuid: appArguments.uuid,
          sign: appArguments.sign,
          coupon_id: id,
          coupon_value: value
        }).then(res => {
          loading.close()

          if (this.type === 0) {
            appMutual.send.coupon(id, value)
          } else {
            appMutual.send.cash(id, value)
          }

        }).catch(err => {
          loading.close()
          if (this.type === 0) {
            appMutual.send.coupon(id, value)
          } else {
            appMutual.send.cash(id, value)
          }
        })
      },
      _getLeftNum(res){
        if(appArguments.app_version<2203){
          this.left_num = res.data.left_num
          this.is_reach_ceiling = res.data.is_reach_ceiling
        }else{
          // 装载剩余次数
          if (res.data.voucher.left_coupon_sum_cnt >= 0) {
            // 合并计算
            this.left_num = res.data.voucher.left_coupon_sum_cnt
          } else {
            // 独立计算
            if (this.type === 0) {
              // 当前是优惠券
              this.left_num = res.data.voucher.left_coupon_cnt
            } else {
              // 当前是红包
              this.left_num = res.data.voucher.left_coupon_cash_cnt
            }
          }
          if (this.type === 0) {
            if (this.select_cash_id !== 0) this.left_num--
          } else {
            if (this.select_coupon_id !== 0) this.left_num--
          }
        }
      }
    },
    created () {
      if (String(appArguments.cash) === '1') this.type = 1

      let loading = this.$_LIKE_loading()
      myAjax.post(getApiUrl('/rental/coupon-list'), {
        uuid: appArguments.uuid,
        sign: appArguments.sign,
        fee_total: appArguments.fee_total,
        version: 2,
        user_version:'h5_'+appArguments.app_version,
        type: this.type
      }).then(res => {
        loading.close()

        if (res.status === 0) {

          this._getLeftNum(res)

          if (this.type === 0) {
            this.coupons = res.data.coupons.map(item => {
              if(this.left_num < 1)item.valid = 0
              return new Coupon(item)
            })
          } else {
            this.coupons = res.data.coupon_cashs.map(item => {
              if(this.left_num < 1)item.valid = 0
              return new Coupon(item,true)
            })
          }

          this.data_ready = true
        } else {
          throw res
        }
      }).catch(err => {
        loading.close()
        if (err && err.msg) {
          this.$_LIKE_toast(err.msg)
        } else {
          console.log(err)
        }
      })
    }
  }
</script>

<style lang=less>
    .header {
        background-color: #fff;
        padding: 0.15rem;
        border-bottom: solid 1px #dfdfdf;
        .btn {
            width: 100%;
            height: 0.43rem;
            border: solid 1px #dfdfdf;
            border-radius: 3px;
            color: #111;
            font-size: 0.13rem;
            background-color: #fff;
        }
    }

    .tips {
        padding: 0.05rem 0.15rem;
        background: #FFFCE0;
        color: #999;
        font-size: 12px;
        .i {
            padding-left: 1.5em;
            background: url('./images/i.png') no-repeat left center;
            background-size: auto 80%;
        }

        .highlight {
            color: #FB4C3D;
            margin: 0 5px;
        }
        &.warn {
            background-color: #FFF1F1;
        }
    }

    .empty {
        position: fixed;
        top: 25%;
        left: 0;
        width: 100%;
        text-align: center;
        .img {
            margin: 0 auto;
            width: 60%;
            height: 1rem;
            background: url('./images/empty_coupon.png') no-repeat center;
            background-size: contain;
        }
        p {
            padding-top: 0.1rem;
            color: #999;
            font-size: 0.12rem;
        }
    }

</style>
<template>
  <div class="CouponUse">
    <div class="header">
      <button class="btn exchange" @click="()=>chooseCoupon(null)">不使用优惠券</button>
    </div>
    <div class="tips" v-if="is_reach_ceiling">优惠券每天限用3张，当前账号已达上限</div>
    <div class="list coupon_list">
      <CouponBox
        v-for="item in list"
        :key="item.id"
        :data="item"
        :choose="item.id === user_chosen_coupon_id"
        @tapCoupon="chooseCoupon"
      />
    </div>
    <div class="empty" v-if="is_empty">
      <div class="img"></div>
      <p>当前暂无优惠券</p>
    </div>
  </div>
</template>

<script>
  import API from '../../common/apiAddress'
  import myAjax from '../../common/myAjax'
  import {mapState} from 'vuex'
  import CouponBox from '../../../other_modules/vue-coupon/couponBox'

  export default {
    name: "coupon-use",
    components:{
      CouponBox
    },
    data() {
      return {
        is_empty: false,
        list: [],
        is_reach_ceiling: 0
      }
    },
    computed: {
      ...mapState('pay', [
        'order',
        'user_chosen_coupon_id'
      ])
    },
    methods:{
      chooseCoupon(coupon){
        if(coupon === null){
          coupon = {
            id:0,
            value:'0.00'
          }
        }
        this.$store.commit('pay/setUserChosenCoupon',coupon)
        this.$router.replace('/pay/confirm')
      }
    },
    created() {
      myAjax.postV2(API.rental.couponList, {
        fee_total: this.order.fee_total
      }).then(res => {
        if(res.status === 0){
          this.is_reach_ceiling = res.data.is_reach_ceiling
          this.list = res.data.coupons
          if (res.data.coupons.length === 0) {
            this.is_empty = true
          }
        }else{
          this.$_LIKE_toast(res.msg)
        }
      })
    }
  }
</script>

<style lang="less" scoped>
  .CouponUse {
    background-color: #f7f7f7;
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
        font-size: 0.12rem;
        background-color: #fff;
      }
    }

    .tips {
      width: 100%;
      background: #fdfdbf;
      color: #111;
      text-align: center;
      line-height: 26px;
      font-size: 0.12rem;
    }

    .empty {
      display: none;
      position: fixed;
      top: 25%;
      left: 0;
      width: 100%;
      text-align: center;
      .img {
        margin: 0 auto;
        width: 60%;
        height: 1rem;
        background: url('../../assets/images/empty_coupon.png') no-repeat center;
        background-size: contain;
      }
      p {
        padding-top: 0.1rem;
        color: #999;
        font-size: 0.12rem;
      }
    }
  }
  .coupon_list{
    border-top:solid 1px transparent;
  }
</style>

<template>
  <div class="PayConfirm">
    <div class="confirm-header" v-if="order">
      <div class="total">应付合计：{{order.fee_total}}元</div>
      <div class="detail clearfix" @click="toCouponUse">
        <span class="float-left">优惠券</span>
        <span class="coupon_cnt float-right" v-if="user_chosen_coupon_value !== '0.00'">-{{user_chosen_coupon_value}}元</span>
        <span class="coupon_cnt float-right" v-else :class="{warn:order.coupon_cnt>0}">{{order.coupon_cnt}} 张可用</span>
      </div>
      <div class="detail clearfix">
        <span class="float-left">
          余额
          <span class="yue" :class="{disabled:order.money==='0.00'}"> ( {{order.money}} 元 ) </span>
        </span>
        <span class="float-right" v-if="order.money>0">
          -{{reduce}} 元
          <span class="Switch" :class="{active:use_money}" @click="changeUseMoney"></span>
        </span>
      </div>
    </div>
    <div class="fee-box">
      <div>
        需支付
        <span class="fee">{{needPay}}</span>
        元
      </div>
      <span class="more" @click="changeShowDetail" :class="{down:!show_detail}">查看费用</span>
      <transition
        name="custom-classes-transition"
        enter-active-class="animated faster fadeInUp"
        leave-active-class="animated faster fadeOutDown">
        <div class="detail-box" v-if="show_detail">
          <ul class="detail-list">
            <li class="item clearfix"><span class="float-left">总里程（公里）</span><span class="float-right">{{order.distance}}</span></li>
            <li class="item clearfix"><span class="float-left">总时长（时间）</span><span class="float-right">{{human_time}}</span></li>
            <li class="item clearfix" v-if="order.discount_fee !==''"><span class="float-left">优惠里程（公里）</span><span class="float-right">{{order.discount_km}}</span></li>
            <li class="item clearfix" v-if="order.discount_fee !==''"><span class="float-left">优惠时长（时间）</span><span class="float-right">{{order.discount_min}}</span></li>
            <li class="item clearfix" v-if="order.discount_fee !==''"><span class="float-left">{{order.discount_msg}}</span><span class="float-right">{{order.discount_fee}}</span></li>
            <li class="item clearfix"><span class="float-left">里程费（元）</span><span class="float-right">{{order.km_fee}}</span></li>
            <li class="item clearfix"><span class="float-left">用时费（元）</span><span class="float-right">{{order.time_fee}}</span></li>
            <li class="item clearfix" v-if="order.price_extra !=='0.00'"><span class="float-left">动态加价（元）</span><span class="float-right">{{order.price_extra}}</span></li>
            <li class="item clearfix" v-if="order.parking_fee_in !=='0.00'"><span class="float-left">还车附加费（元）</span><span class="float-right">{{order.parking_fee_in}}</span></li>
          </ul>
          <ul class="detail-list">
            <li class="item clearfix"><span class="float-left">应付（元）</span><span class="float-right">{{order.fee_total}}</span></li>
            <li class="item clearfix"><span class="float-left">优惠券</span><span class="float-right">-{{user_chosen_coupon_value}}</span></li>
            <li class="item clearfix"><span class="float-left">余额（元）</span><span class="float-right">-{{reduce}}</span></li>
          </ul>
          <ul class="detail-list">
            <li class="item clearfix"><span class="float-left">实付（元）</span><span class="float-right">{{needPay}}</span></li>
          </ul>
        </div>
      </transition>
    </div>
    <div class="fee-detail"></div>
    <div class="btn_con">
      <button class="btn btn-primary btn-block" v-if="needPay>0" @click="confirmOrder">还需支付{{needPay}}元</button>
      <button class="btn btn-primary btn-block" v-else @click="confirmOrder">确定</button>
    </div>
  </div>
</template>

<script>
  import {mapState,mapGetters} from 'vuex'
  import PAGE from '../../common/pageAddress'
  import format from '../../common/Format'
  import API from '../../common/apiAddress'
  import myAjax from '../../common/myAjax'

  export default {
    name: "confirm",
    data(){
      return {
        show_detail:false,
        use_money:true,
        could_leave:false
      }
    },
    computed:{
      ...mapGetters('user',[
        'userLoginInfo'
      ]),
      ...mapState('user',[
        'uuid',
        'sign'
      ]),
      ...mapState('pay',[
        'order',
        'user_chosen_coupon_id',
        'user_chosen_coupon_value'
      ]),
      reduce(){
        if(this.use_money){
          if(this.user_chosen_coupon_value !== 0){
            let fee_left = format.money(Number(this.order.fee_total) - Number(this.user_chosen_coupon_value))
            return Number(this.order.money)>Number(fee_left) ? fee_left : this.order.money
          }else{
            return Number(this.order.money)>Number(this.order.fee_total) ? this.order.fee_total : this.order.money
          }
        }else{
          return '0.00'
        }
      },
      needPay(){
        if(this.order){
          return format.money(this.order.fee_total - this.user_chosen_coupon_value - this.reduce)
        }else{
          return '-'
        }
      },
      human_time(){
        if(this.order){
          return format.during(this.order.time*60)
        }else{
          return '-'
        }
      }
    },
    methods:{
      confirmOrder(){
        this.$store.dispatch('pay/confirm',{
          rental_no:this.order.rental_no,
          coupon_id:this.user_chosen_coupon_id,
          use_balance:this.use_money ? 1 : 0,
          client_total:this.order.fee_total,
          client_coupon:this.user_chosen_coupon_value,
          client_balance:this.use_money ? this.reduce : 0,
          client_amount:this.needPay
        }).then(res=>{
          if(res.status === 0){
            this.$router.push({
              path:'/rental/finish',
              query:{
                rental_no:this.order.rental_no
              }
            })
          }else if(res.status === 1001){
            //this.$router.replace('/pay/pay')
            let data = {
              type:1,
              methond:4,
              rental_no:this.order.rental_no,
              return_url:PAGE.selfFinish.href + '?rental_no='+this.order.rental_no
            }

            myAjax.postPage(API.pay.index, data)
          }else{
            this.$_LIKE_toast(res.msg)
          }
        })
      },
      changeUseMoney(){
        this.use_money = !this.use_money
      },
      changeShowDetail(){
        this.show_detail = !this.show_detail
      },
      toCouponUse(){
        this.$router.push('/pay/coupon')
      }
    },
    created(){
      this.$store.dispatch('pay/getRentalDetail').catch(err=>{
        if(err.msg && err.msg !== ''){
          this.$_LIKE_toast(err.msg)
          this.$router.push('/index')
        }
      })
    },
    beforeRouteLeave(to,from,next){
      let allow = [
        '/rental/finish',
        '/pay/pay',
        '/pay/coupon',
        //'/index'
      ]
      if(this.could_leave || allow.includes(to.path)){
        next()
      }else{
        let that = this
        this.$_LIKE_confirm({
          msg:'订单还未支付，请三思~',
          cancelButtonText:'去意已决',
          cancelButtonCallback:function(){
            that.could_leave = true
            next({path:'/index'})
          },
          confirmButtonText:'我再想想'
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .PayConfirm{
    .confirm-header{
      padding: 0 0.5rem;
      .total,.detail{
        border-bottom: solid 1px #f2f2f2;
      }
      .total{
        font-size: 0.18rem;
        padding: 0.25rem 0;
      }
      .detail{
        padding: 0.2rem 0;
        line-height: 0.2rem;
        .coupon_cnt::after{
          content:'';
          display: inline-block;
          vertical-align: top;
          width: 0.2rem;
          height: 0.2rem;
          background: url('../../assets/images/右copy3@3x.png') no-repeat right;
          background-size: 50%;
        }
        .yue.disabled{
          color:#ccc;
        }
      }
    }
    .fee-box{
      margin-top:0.4rem;
      .fee{
        font-size: 0.33rem;
      }
      .more{
        margin:0.05rem 0 0.1rem;
        font-size: 0.12rem;
        color:#999;
        position: relative;
        &::after{
          content: '';
          display: inline-block;
          vertical-align: middle;
          margin:-0.04rem 0.04rem 0;
          width: 0;
          height: 0;
          border-bottom: solid 0.04rem #c0c0c0;
          border-left:solid 0.04rem transparent;
          border-right:solid 0.04rem transparent;
          transition: transform 400ms;
        }
        &.down:after{
          transform: rotate(180deg);
        }
      }
    }
    .detail-box{
      padding: 0.1rem 0.5rem 0.7rem;
      .detail-list{
        border-top:solid 1px #F2F2F2;
        .item{
          font-size: 0.13rem;
          margin:0.1rem 0;
          .float-left{
            color:#999;
          }
        }
      }
    }

    .btn_con{
      position: fixed;
      padding: 0.1rem;
      width: 100%;
      box-sizing: border-box;
      background-color: #fff;
      left:0;
      bottom:0;
      .btn{
        height: 0.46rem;
        font-size: 0.16rem;
      }
    }
  }

  .Switch{
    display: inline-block;
    vertical-align: middle;
    width: 0.20rem;
    height: 0.12rem;
    border:solid 1px #ddd;
    border-radius: 0.07rem;
    position: relative;
    overflow: hidden;
    transition: background-color 200ms;
    &::before{
      content: '';
      display: block;
      width: 120%;
      height: 120%;
      position: absolute;
      top:-2px;
      left:-110%;
      background-color: #494B51;
      transition: left 200ms;
    }
    &::after{
      content: '';
      display: block;
      width: 0.12rem;
      height: 0.12rem;
      position: absolute;
      top:-1px;
      left:-1px;
      background: #fff;
      border:solid 1px #ddd;
      border-radius: 50%;
      transition: left 200ms;
    }
    &.active{
      border-color:#494B51;
      background-color:#494B51;
      &::before{
        left:-10%;
      }
      &::after{
        left:0.07rem;
      }
    }
  }
</style>

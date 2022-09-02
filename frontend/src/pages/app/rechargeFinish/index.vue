<template>
    <div class="index">
        <div class="status-box">
            <div class="icon icon-success"></div>
            <div class="msg">充值成功</div>
        </div>

        <div class="rights-box" v-if="list.length>0">
            <div class="msg">以下优惠已到账</div>
            <div class="rights-list" >
                <div class="list">
                    <RightsBox v-for="item in list" :key="item.name" :data="item" @totalClick="handleTotalClick"/>
                </div>
            </div>

        </div>

        <div class="btn-con">
            <button class="btn" @click="toMain">立刻用车</button>
        </div>

        <div class="footer-btn" :style="'padding-bottom: '+safeBottom+'px'">
            <div class="activity-con" @click="toActivity">
            </div>

        </div>


    </div>
</template>

<script>
  import RightsBox from './components/RightsBox'
  import appArguments from '../../../../other_modules/app-arguments'
  import myAjax from '../../../../other_modules/like-request/withAxiosV3'
  import {getApiUrl,getH5Url} from '../../../../other_modules/url-constructor/index'
  import {appMutual} from '../../../../other_modules/app-mutual'
  import env from '../../../../other_modules/like-env'

  export default {
    name: "indexPage",
    components: {
      RightsBox
    },
    data () {
      return {
        // 全面屏安全距离
        safeBottom:env.safeBottom || 10,

        list: [],

        activity:[]
      }
    },
    methods:{
      toActivity(){
        appMutual.send.url({
          url:getH5Url('/app/inviteCode?entry=6'),
          destroy_current:1,
          callback_url:'',
          request_type:'post',
          need_param:1
        })
      },
      toMain(){
        appMutual.jump.indexAndCloseThisWebview()
      },
      handleTotalClick(name){

        if(name === '余额'){
          // 去个人中心
          appMutual.jump.userCenter({
            destroy_current:1
          })
        }else{
          // 去优惠券页
          appMutual.send.url({
            url:getH5Url('/app/coupons')
          })
        }
      }
    },
    created () {
      // 本次充值的金额
      let recharge = appArguments.recharge || 0

      myAjax.post(getApiUrl('/charge/success'), {
        uuid: appArguments.uuid,
        sign: appArguments.sign,
        user_version: appArguments.user_version
      }).then(res => {
        if(res.status === 0){
/*          this.list = [
            {
              name:'余额',
              items:['10元','20元'],
              total:'30元'
            },
            {
              name:'优惠券',
              items:['10元','20元'],
              total:'30元'
            },
            {
              name:'红包',
              items:['10元','20元'],
              total:'30元'
            }
          ]*/

          if(res.data.hasOwnProperty('voucher')){

            let voucher = res.data.voucher

            // 余额
            if(voucher.hasOwnProperty('gift_balance') && voucher.gift_balance > 0){
              this.list.push({
                name:'余额',
                items:[voucher.gift_balance+'元'],
                total:res.data.balance+'元'
              })
            }

            // 优惠券
            if(voucher.hasOwnProperty('coupon') && voucher.coupon.length>0){
              this.list.push({
                name:'优惠券',
                items:voucher.coupon.map(item=>Number(item.money)+'元×'+item.cnt),
                total:res.data.coupon_cnt+'张'
              })
            }

            // 红包
            if(voucher.hasOwnProperty('coupon_cash') && voucher.coupon_cash.length>0){
              this.list.push({
                name:'红包',
                items:voucher.coupon_cash.map(item=>Number(item.money)+'元×'+item.cnt),
                total:res.data.coupon_cash_cnt+'张'
              })
            }
          }

          if([15,16,20,21,22,23,24,25,26,27,28,29].indexOf(Number(res.data.unpay_renta.status))>-1){
            this.$_LIKE_confirm({
              title: '您有一个未支付的订单，前往支付？',
              confirmButtonText: '立刻支付',
              cancelButtonText: "暂不处理",
              confirmButtonCallback: function () {
                appMutual.jump.undoneRental(res.data.unpay_renta)
              }
            })
          }

          if(res.data.activity){
            if(res.data.activity.length>0){
              this.activity = res.data.activity
            }
          }
        }else{
          this.$_LIKE_toast(res.msg)
        }
      })
    },
  }
</script>

<style lang=less scoped>
    @import "../../../../other_modules/css-animate/animateBase";
    @import "../../../../other_modules/css-animate/slideInDown";
    @import "../../../../other_modules/css-animate/slideOutUp";

    .index {
        width: 100vw;
        min-height: 100vh;
        text-align: center;
        position: relative;

        .status-box {
            padding-top: 0.5rem;
            .icon-success {
                margin: 0 auto;
                width: 0.6rem;
                height: 0.6rem;
                background-image: url(./images/icon-success.png);
                background-size: 100%;
            }
            .msg {
                line-height: 1;
                margin: 0.15rem 0 0;
                font-size: 18px;
            }
        }

        .rights-box {
            margin-top: 0.2rem;

            .msg{
                font-size: 12px;
                color:#999;
            }

            .rights-list{
                overflow: hidden;
                .list{
                    padding: 0.15rem 0.16rem;
                    display: flex;
                    justify-content: center;
                }
            }
        }

        .footer-btn{
            padding: 0.1rem;
            position: absolute;
            width: 100%;
            box-sizing: border-box;
            bottom:0;

            .activity-con{
                width: 100%;
                height: 1rem;
                background: url('./images/activity.png') no-repeat center;
                background-size: 100%;
            }
        }

        .btn-con{
            margin-top:0.4rem;
            padding: 0.1rem;
        }
        .btn{
            font-size: 15px;
            color:#fff;
            background-color: #494B51;
            border-radius: 2px;
            height: 0.46rem;
            width: 100%;
            border: none;
            outline: none;
        }
    }
</style>
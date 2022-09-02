<template>
    <div class="detail">

      <fieldset disabled="disabled">
        <legend>活动详情说明</legend>
      </fieldset>
      <div class="warp">
        <p>活动简介</p>
        <ul class="ulOne">
          <li>邀请好友注册并完成首单可得50元现金奖励，以及好友每笔订单实付金额5%的返现。您的好友邀请其朋友用车，您再返30元+3%，奖励更多！</li>
        </ul>
        <p class="rule">活动详细规则</p>
        <p class="ruleTitle">参与邀请好友活动即默认为您已阅读并同意《邀请注册协议》。当您邀请好友注册时，默认您已同意如下条款：</p>
        <ul :class=" androidStyle ? 'ulTowAnd' : 'ulTowIos' ">
          <li>您通过邀请好友获得的现金奖励没有额度上限和时间限制</li>
          <li>邀请好友时，您必须已完成首单（里程＞0），否则将无法获得邀请奖励</li>
          <li v-if="!newRule">好友通过您分享的邀请链接或个人二维码注册，完成有里程首单并支付后，您可获得{{invite}}元现金，现金可提现至支付宝账户</li>
          <li v-if="newRule">好友通过您分享的个人二维码注册，在立刻出行APP上完成有里程首单并支付后（通过支付宝小程序注册、免押、下单、以及支付的订单不计入奖励），您可获得50元奖金</li>
          <li>活动期间内，您邀请的好友完成每笔有实付订单，您可额外获得好友实付金额{{rental}}%的现金奖励（实付金额不包括优惠券支付；若之前参与过充返活动，不包括活动赠送金额支付）</li>
          <li>您邀请的好友也可分享其专属邀请链接或二维码给其他朋友，当好友的朋友完成首单时，您将获得30元现金奖励。活动期间，您好友的朋友每完成一笔含实付的订单，您将获得实付金额3%的现金奖励（实付金额不包括优惠券支付、不包括充值赠送金额支付）</li>
          <li>活动期间，您在每月28号（10点-19点）可提现，（每个月28号19点后开始计算下个月返现奖励），提现日当天限提现一次</li>
          <li>活动结束前，会通过短信提示您在活动页面自行操作提现，逾期未提现则视为放弃相关奖励</li>
          <li>点击提现后您需在活动页面自行填写支付宝账号和姓名，输入的姓名需与立刻出行账号中的姓名一致，在保证支付宝账户状态正常的情况下，奖金可顺利提现</li>
          <li>请勿将提现页面以任何方式分享给其他人，如奖金被他人冒领，所产生的损失将由用户自行承担</li>
          <li>提交支付宝账号和姓名并确认提现后，奖金将于3-5个工作日内到账，若超过5个工作日未到账请联系立刻客服</li>
          <li>若支付宝账号存在异常情况，请在活动页面自行修改支付宝账号和姓名，若错过提现时间，需在次月28日自行操作提现</li>
          <li>特别声明：活动中，一旦发现您存在利用我们的规则漏洞进行任何形式的作弊行为，将取消推荐奖励、追回相关奖励、关闭作弊账户以及与您相关的所有账户。并依法追究其法律责任</li>
        </ul>
      </div>
      <div class="footer">立刻出行拥有法律允许范围内对本活动的解释权<br>其他未尽事宜请咨询立刻出行客服</div>

    </div>
</template>

<script>
  import rate from '../js/rate.js'
  import { IsAndriod } from "../../../../js/UserAgent.js";
  import {mapState} from 'vuex'
  export default {
    name: "detail",
    data(){
      return {
        invite:rate.invite,
        rental:rate.rental,
        androidStyle:"",
        newRule:false
      }
    },
    computed: {
      ...mapState(['serverTime'])
    },
    created() {      
      if(this.serverTime - 1547395200>=0) this.newRule = true
      if(IsAndriod()){
        this.androidStyle = true
      }else{
        this.androidStyle = false
      }
    },
  }
</script>

<style lang=less scoped>
  .detail{
    padding-top: .25rem;
    fieldset{
      box-sizing: border-box;
      border: none;
      border-top: 1px solid #A9A9AB;
      width: 1.3rem; 
      text-align: center;
      padding: 0;
      margin: 0 auto;
      legend{
        background: #FFF;
        font-size: 16px;
        padding: 0 .06rem;
      }
    }
    .warp{
      padding:.15rem .25rem 0;
      p{
        font-size:15px;
        padding-bottom:.08rem   
      }
      .rule{padding-top: .05rem}
      .ruleTitle{font-size: 13px;line-height: 19px;}
      ul{
        li{
          font-size: 13px;
          line-height: 19px;
          margin-bottom: .08rem;
          position: relative;
        }
      }
      .ulOne{
        li{
          padding-left: .1rem;
          line-height: 0.2rem;
          /* width: 3.14rem; */
          &::before{
            content: "";
            width: .04rem;
            height: .04rem;
            display: inline-block;
            border-radius: .04rem;
            background: #A9A9AB;
            position: absolute;
            top: .08rem;
            left: 0;
          }
        }
      }
      .ulTowIos{
        .setIconIos(12);
        li{
          line-height: 0.2rem;
          padding-left: .18rem;
          /* width: 3rem; */
        }
        :last-child{
          padding-bottom: .3rem;
          border-bottom: 1px solid #ddd;
        }
      }
      .ulTowAnd{
        .setIconAnd(12);
        li{
          line-height: 0.2rem;
          padding-left: .18rem;
          /* width: 3rem; */
        }
        :last-child{
          padding-bottom: .3rem;
          border-bottom: 1px solid #ddd;
        }
      }
    }
    .footer{
      color: #A4A4A4;
      text-align: center;
      font-size: 12px;
      padding-top: .12rem;
      margin: 0 auto .25rem;
      line-height: .2rem;
    }
  }
  .setIconIos(@n, @i: 1) when (@i =< @n) {
    :nth-child(@{i}){
      &::before{
        content: "@{i}";
        width: .28rem;
        height: .28rem;
        display: inline-block;
        border-radius: .28rem;
        background: #CACACC;
        font-size: 18px;
        color: #FFF;
        position: absolute; 
        line-height: .28rem;
        text-align: center;
        transform:scale(0.5);
        top: -.05rem;
        left: -.07rem;
      }
    }
    .setIconIos(@n, (@i + 1));
  }
  .setIconAnd(@n, @i: 1) when (@i =< @n) {
    :nth-child(@{i}){
      &::before{
        content: "@{i}";
        width: .28rem;
        height: .28rem;
        display: inline-block;
        border-radius: .28rem;
        background: #CACACC;
        font-size: 18px;
        color: #FFF;
        position: absolute; 
        line-height: .28rem;
        text-align: center;
        transform:scale(0.5);
        top: -.05rem;
        left: -.07rem;
        padding-top: .02rem;
      }
    }
    .setIconAnd(@n, (@i + 1));
  } 
</style>
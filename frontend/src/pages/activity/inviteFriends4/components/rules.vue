<template>
    <div class="container" v-show="showRule" :style="footStyle">
        <div class="title">
            <span class="line"></span>
            <span class="txt">活动详细说明</span>
            <span class="line"></span>
        </div>
        <div class="h1">活动简介</div>
        <div class="p">邀请好友注册并完成首单可得50元现金奖励，以及好友每笔订单实付金额5%的返现。您的好友邀请其朋友用车，您再返30元+3%，奖励更多！</div>
        <div class="h1">活动详细规则</div>
        <div>参与邀请好友活动即默认为您已阅读并同意《邀请注册协议》。当您邀请好友注册时，默认您已同意如下条款：</div>
        <div class="item">
            <span :style="androidStyle">1</span>
            <div>您通过邀请好友获得的现金奖励没有额度上限和时间限制</div>
        </div>
        <div class="item">
            <span :style="androidStyle">2</span>
            <div>邀请好友时，您必须已完成首单（里程＞0），否则将无法获得邀请奖励</div>
        </div>
        <div class="item">
            <span :style="androidStyle">3</span>
            <div v-if="!newRule">好友通过您分享的邀请链接或个人二维码注册，完成有里程首单并支付后，您可获得{{invite}}元现金，现金可提现至支付宝账户</div>
            <div v-if="newRule">好友通过您分享的个人二维码注册，在立刻出行APP上完成有里程首单并支付后（通过支付宝小程序注册、免押、下单、以及支付的订单不计入奖励），您可获得50元奖金</div>
        </div>
        <div class="item">
            <span :style="androidStyle">4</span>
            <div>
                活动期间内，您邀请的好友完成每笔有实付订单，您可额外获得好友实付金额{{rental}}%的现金奖励（实付金额不包括优惠券支付；若之前参与过充返活动，不包括活动赠送金额支付）
            </div>
        </div>
        <div>
            <div class="item">
                <span :style="androidStyle">5</span>
                <div>您邀请的好友也可分享其专属邀请链接或二维码给其他朋友，当好友的朋友完成首单时，您将获得30元现金奖励。活动期间，您好友的朋友每完成一笔含实付的订单，您将获得实付金额3%的现金奖励（实付金额不包括优惠券支付、不包括充值赠送金额支付）</div>
            </div>
            <div class="item">
                <span :style="androidStyle">6</span>
                <div>活动期间，您在每月28号（10点-19点）可提现，（每个月28号19点后开始计算下个月返现奖励），提现日当天限提现一次</div>
            </div>
            <div class="item">
                <span :style="androidStyle">7</span>
                <div>活动结束前，会通过短信提示您在活动页面自行操作提现，逾期未提现则视为放弃相关奖励</div>
            </div>
            <div class="item">
                <span :style="androidStyle">8</span>
                <div>点击提现后您需在活动页面自行填写支付宝账号和姓名，输入的姓名需与立刻出行账号中的姓名一致，在保证支付宝账户状态正常的情况下，奖金可顺利提现</div>
            </div>
            <div class="item">
                <span :style="androidStyle">9</span>
                <div>请勿将提现页面以任何方式分享给其他人，如奖金被他人冒领，所产生的损失将由用户自行承担</div>
            </div>
            <div class="item">
                <span :style="androidStyle">10</span>
                <div>提交支付宝账号和姓名并确认提现后，奖金将于3-5个工作日内到账，若超过5个工作日未到账请联系立刻客服</div>
            </div>
            <div class="item">
                <span :style="androidStyle">11</span>
                <div>若支付宝账号存在异常情况，请在活动页面自行修改支付宝账号和姓名，若错过提现时间，需在次月28日自行操作提现</div>
            </div>
             <div class="item">
                <span :style="androidStyle">12</span>
                <div>特别声明：活动中，一旦发现您存在利用我们的规则漏洞进行任何形式的作弊行为，将取消推荐奖励、追回相关奖励、关闭作弊账户以及与您相关的所有账户。并依法追究其法律责任</div>
            </div>
        </div>
       
        <div class="footer">
            <div>立刻出行拥有法律允许范围内对本活动的解释权</div>
            <div>其他未尽事宜请咨询立刻出行客服</div>
        </div>
    </div>
</template>
<script>
    import rate from '../js/rate.js'
    import { IsAndriod } from "../../../../js/UserAgent.js";
    import {mapState} from 'vuex'
export default {
    name:'rules',
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
    props:['showRule','footStyle'],
    created() {
        // let nowTime = new Date().getTime()
        // let rulesTime = new Date("Oct 10, 2018 00:00:00").getTime()
        // if(nowTime>rulesTime){
        //     this.isShowRulesTow = true;
        // }
        if(this.serverTime - 1547395200>0) this.newRule = true
        if(IsAndriod()){
            this.androidStyle = "paddingTop: .02rem;width:.17rem;height: .17rem;"
        }else{
            this.androidStyle = ""
        }
    },
}
</script>
<style lang="less" scoped>
    .container{
        font-size: .13rem;
        color: #09090a; 
        padding: .24rem .3rem;
        // padding-bottom: .6rem;
        .title{
            display:flex;
            justify-content: center;
            align-items: center;
            font-size: .16rem;
            color: #09090a;
            .line{
                width: .15rem;
                height: 1px;
                background: #a9a9ab;
            }
            .txt{
                margin: 0 .12rem;
            }
        }
        .h1{
            font-size: .15rem;
            color: #09090a;
            margin: .08rem 0;
        }
        .p{  
            line-height: .2rem;
            position: relative;
            padding-left: .1rem;
            &::after{
                content: '';
                position: absolute;
                left:0;
                top:.08rem;
                width:.04rem;
                height: .04rem;
                background: #a9a9ab;
                border-radius: .04rem;
            }
        }
        .item{
            display: flex;
            margin-top: .12rem;
            span{
                width:.16rem;
                height: .16rem;
                background: #cacacc;
                display: block;
                text-align: center;
                line-height: .16rem;
                margin-right: .08rem;
                // margin-top: .035rem;
                font-size: 9px;
                border-radius: .16rem;
                color: #fff;
                box-sizing: border-box;
            }
            div{
                flex:1;
            }
        }
        .footer{
            font-size: .12rem;
            color: #a4a4a4;
            border-top: 1px solid #ededed;
            padding: .2rem 0;
            text-align: center;
            line-height: .2rem;
            margin-top: .3rem;
        }
    }
</style>




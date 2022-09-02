<template>
    <div class="ruleWrap">
        <!-- <div class="title" @click="toggleRule()">
            <span>活动规则</span>
            <span class="icon" :class="showRule?'active':''"></span>
        </div> -->
        <div class="title">
            <TextInLine text="活动规则" style="color:#1A1B1C"/>
        </div>
        <div class="detail">
            <!-- <transition
                    name="custom-classes-transition"
                    enter-active-class="animated faster slideInDown"
                    leave-active-class="animated faster slideOutUp"> -->
                <div class="ruleContent">
                    <ul :class=" androidStyle ? 'ulTowAnd' : 'ulTowIos' ">
                        <li>每位用户在活动期间内完成有效订单（里程≥2公里）并支付成功后可以分享红包链接给好友</li>
                        <li>新老用户均可点击红包链接领取红包</li>
                        <!-- <li>红包仅限在APP登录后，在线支付时使用，每个订单仅限使用一张红包</li> -->
                        <li>使用红包时下单的手机号需与抢红包时的手机号一致</li>
                        <li>每个链接可随机领取一个最大金额红包</li>
                        <li>每人每天至多可领取3个红包</li>
                        <li>红包不支持提现、找零</li>
                        <li>红包仅限在立刻出行已开通城市使用</li>
                        <li>其他未尽事宜，请咨询客服</li>
                    </ul>
                </div>
            <!-- </transition> -->
        </div>


    </div>
</template>

<script>
    import { IsAndriod } from "../../../../js/UserAgent.js";
    import TextInLine from './TextInLine'
    export default {
        name:"rules",
        data(){
            return {
                // showRule:false,
                androidStyle:""
            }
        },
        created() {                  
            if(IsAndriod()){
                this.androidStyle = true
            }else{
                this.androidStyle = false
            }
        },
        components:{
            TextInLine
        }
        // methods:{
        //     toggleRule(){
        //         this.showRule = !this.showRule
        //         this.$store.commit('setHeight',this.showRule) 
        //     }
        // }
    }
</script>

<style scoped lang="less">
    // @import "../../../../../other_modules/css-animate/animateBase";
    // @import "../../../../../other_modules/css-animate/slideInDown";
    // @import "../../../../../other_modules/css-animate/slideOutUp";

    .ruleWrap{
        padding: .36rem .35rem 0;
        .title {
            // display: flex;
            // justify-content: center;
            // align-items: center;
            // font-size: 13px;
            // line-height: 13px;
            padding-bottom: .25rem;
            // .icon {
            //     width: .08rem;
            //     height: .05rem;
            //     background: url('../images/icon_arrow.png') no-repeat;
            //     background-size: 100% 100%;
            //     margin-left: .07rem;
            //     transition: transform .35s;
            //     &.active {
            //         transform: rotate(180deg)
            //     }
            // }
        }

        .detail{
            overflow: hidden;
            // background: 
        }
        .ruleContent{
            padding-bottom:.34rem;
            ul{
                li{
                    color: #09090A;
                    font-size: 13px;
                    line-height: .19rem;
                    margin-bottom: .08rem;
                    position: relative;
                }
            }
            .ulTowIos{
                .setIconIos(8);
                li{
                    line-height: 0.2rem;
                    padding-left: .2rem;
                }
            }
            .ulTowAnd{
                .setIconAnd(8);
                li{
                    line-height: 0.2rem;
                    padding-left: .2rem;
                }
            }
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
                top: -.04rem;
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
                top: -.04rem;
                left: -.07rem;
                padding-top: .02rem;
            }
        }
    .setIconAnd(@n, (@i + 1));
  } 
</style>
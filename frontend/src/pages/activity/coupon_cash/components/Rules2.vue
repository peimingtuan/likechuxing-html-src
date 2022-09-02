<template>
    <div class="ruleWrap">
        <transition
            name="custom-classes-transition"
            enter-active-class="animated fast fadeIn"
            leave-active-class="animated fast fadeOut"
        >
            <div class="mask" v-if="show"></div>
        </transition>
        <transition
            name="custom-classes-transition"
            enter-active-class="animated faster zoomIn"
            leave-active-class="animated faster zoomOut"
            @after-leave="_destroy"
        >
            <div class="Detail" v-if="show">
                <div class="detail">
                    <div class="title">
                        <TextInLine text="活动规则" style="color:#000E20" :lineColor="true"/>
                    </div>
                    <div class="ruleContent">
                        <ul :class=" androidStyle ? 'ulTowAnd' : 'ulTowIos' ">
                            <li>每个链接随机出现一个最大金额红包</li>
                            <li>每人每天最多可领取3个红包</li>
                            <li>每个订单仅限使用1个红包，红包可与优惠券叠加使用</li>
                            <li>红包仅可在最新版立刻出行APP里使用</li>
                            <li>使用红包时下单的手机号需与抢红包时的手机号一致</li>
                            <li>红包有效期、可用范围以红包说明为准，请注意限用城市</li>
                            <li>红包、优惠券不支持提现、找零</li>
                            <li>每笔订单的里程≥1公里，并且成功支付后，可在24小时内将红包链接分享给好友</li>
                            <li>链接分享24小时后失效，不可再领取</li>
                            <li>其他未尽事宜，请咨询客服</li>

                           <!-- <li>每笔订单的里程≥1公里，并且成功支付后，可在24小时内将红包链接分享给好友</li>
                            <li>链接分享24小时后失效，不可再领取</li>
                            <li>每人每天最多可领取3个红包</li>
                            <li>每个链接随机出现一个最大金额红包</li>
                            <li>红包仅可在最新版立刻出行APP里使用</li>
                            <li>每个订单仅限使用1个红包，红包可与优惠券叠加使用</li>
                            <li>使用红包时下单的手机号需与抢红包时的手机号一致</li>
                            <li>红包有效期、可用范围以红包说明为准，请注意限用城市</li>
                            <li>红包、优惠券不支持提现、找零</li>
                            <li>其他未尽事宜，请咨询客服</li>-->
                        </ul>
                    </div>
                </div>
                <div class="close-box" @click="close"></div>
            </div>
        </transition>
    </div>
</template>

<script>
    import { IsAndriod } from "../../../../js/UserAgent.js";
    import TextInLine from './TextInLine'
    export default {
        name:"rules",
        components:{
            TextInLine
        },
        data(){
            return {
                androidStyle:"",
                show:false
            }
        },
        created() {                              
            if(IsAndriod()){
                this.androidStyle = true
            }else{
                this.androidStyle = false
            }
        },
        mounted () {
            this.show = true
        },
        methods:{
          prevent(e){
            e.preventDefault()
          },
            close () {
                this.show = false
            },
            _destroy () {
                this.$emit('ruleDestroy')
            },
            
        }
    }
</script>

<style scoped lang="less">
    @import "../../../../../other_modules/css-animate/animateBase";
    @import "../../../../../other_modules/css-animate/slideInDown";
    @import "../../../../../other_modules/css-animate/slideOutUp";


    .ruleWrap{
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 20;
        .mask {
            position: absolute;
            top:0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.44);
        }
        .Detail{
            position: absolute;
            width: 3.01rem;
            top: .60rem;
            left: .37rem;
            background: #FFF;
            border-radius:3px;
            box-sizing: border-box;
            padding: .05rem;
            .detail{
                border: 1px solid #FC241C;
                border-radius: 3px;
                box-sizing: border-box;
                padding: .24rem .16rem .17rem;
                .title {
                    padding-bottom: .2rem;
                }
                .ruleContent{
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
                        .setIconIos(10);
                        li{
                            line-height: 0.2rem;
                            padding-left: .2rem;
                        }
                    }
                    .ulTowAnd{
                        .setIconAnd(10);
                        li{
                            line-height: 0.2rem;
                            padding-left: .2rem;
                        }
                    }
                }
            }
            .close-box{
                position: absolute;
                width: 0.3rem;
                height: 0.3rem;
                background: url('../images/close.png') no-repeat center;
                background-size: 100%;
                left: 50%;
                margin-left: -.15rem;
                margin-top: .18rem;
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
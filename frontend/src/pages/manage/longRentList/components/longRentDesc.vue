<template>
    <div class="desc-container" v-show="show">
        <div class="desc-title">长租说明</div>
        <div class="p" v-for="(item,index) in list" :key="index">{{item}}</div>
        <div class="tip">注：请于前一日24：00之前将车辆调整为"长租空闲"状态。</div>
        <div class="desc-close-btn" @click="hide"></div>
    </div>
</template>
<script>

export default {
    name:'longRentDesc',
    props:{
        show:Boolean
    },
    data(){
        return{
            list:[
                '1.预定网点数：用户已预约的取车网点数量。',
                '2.预定车辆数：用户当日预定车辆的总数（已付款包含已认证及未认证）。',
                '3.已认证：用户已缴纳费用并完成线下认证的数量。',
                '4.已完成：已送车至用户需求网点并调整为长租空闲的车辆数。',
                '5.车型后数量：当日预约数（今日及明日的数量为用于已付款并完成认证的数量，明日之后展示的数量为用户已付款的数量）。',
            ]
        }
    },
    methods:{
        hide(){
            this.$emit('closeDesc')
        }
    }
}
</script>
<style lang="less" scoped>
    @import url('../css/common.less');
    .desc-container{
        background: #fff;
        .wh(100%,100%);
        position: fixed;
        top:0;
        left: 0;
        z-index: 2021;
        padding: 0 .25rem;
        .desc-title{
            .fco(.16rem,#333);
            padding: .11rem 0;
            border-bottom: 1px solid #F1F1F1;
            text-align: center;
            margin-bottom: .3rem;
        }
        .p{
            margin-bottom: .1rem;
            font-size: 14px;
            color: #333333;
            text-align: justify;
            line-height: 24px;
        }
        .tip{
            margin-bottom: .1rem;
            margin-top: .3rem;
            font-size: 14px;
            color: #333333;
            text-align: justify;
            line-height: 24px;
        }
        .desc-close-btn{
            width: .35rem;
            height: .35rem;
            position: absolute;
            left: 50%;
            bottom: .49rem;
            margin-left: -.175rem;
            background: url('../images/desc-close-btn.png') no-repeat center center;
            background-size: 100% 100%;
        }
    }
</style>



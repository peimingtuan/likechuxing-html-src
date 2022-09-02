<template>
    <div class="desc-component-mask" v-show="show">
        <div class="desc-component-wrap">
            <div class="title">统计说明</div>
            <p v-for="(item,index) in list" :key="index" class="item">{{item}}</p>
            <div class="close-btn" @click="hide"></div>
        </div>
    </div>
</template>
<script>
export default {
    name:'descComponent',
    props:['show'],
    data(){
        return {
            list:[
                '1.调度工单数：调度转加油的不算工单；调度转故障时有里程（车机、涂强有一个里程即为有里程）算有效工单，反之为无效工单不做统计；',
                '2.加油工单数：有加油信息（加油升数和加油金额）时即为有效加油工单，反之为无效工单不做统计；',
                '3.调度和加油工单 X号的数据为工单完成时间在X号8点到X+1号8点之间的数据（如2号数据为2号8点到3号8点的数据）；',
                '4.用户加油以审核通过时间的订单为统计依据，X号的数据为X号0点到X号24点的数据（如2号数据为2号0点到2号24点的数据；',
                '5.人均工单：(加油工单+调度工单)/工单人数去重；',
                '6.人均加油：加油工单/工单人数去重；',
                '7.人均调度：调度工单/工单人数去重；',
                '8.单车里程：工单总里程/工单数；',
                '9.单车时长：工单总时长/工单数；',
                '10.运维加油单价：每个加油工单的单价在取平均值；'
            ]
        }
    },
    methods:{
        hide(){
            this.$emit('hideDesc')
        }
    }
}
</script>
<style lang="less" scoped>
    .desc-component-mask{
        position: fixed;
        top:0;
        left:0;
        z-index: 2019;
        height: 100%;
        background-color: #fff;
        text-align: center;
        opacity: .95;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-direction: column;
    }
    .desc-component-wrap{
        width: 100%;
        min-height: 100vh;
        padding: .19rem;
        padding-bottom: .7rem;
        overflow-y: auto;
        .title{
            text-align: center;
            font-size: .2rem;
            color: #333;
            margin-bottom: .12rem;
            border-bottom: 2px solid #e0e0e0;
            padding-bottom: .15rem;
        }
        .item{
            text-align: left;
            color: #333;
            margin-bottom: .12rem;
            font-size: .15rem;
        }
        .close-btn{
            width: .35rem;
            height: .35rem;
            position: absolute;
            bottom: .25rem;
            left: 50%;
            transform:translateX(-50%);
            margin: 0 auto;
            background: url('../images/close-btn.png') no-repeat;
            background-size: 100% 100%;
        }
    }
</style>



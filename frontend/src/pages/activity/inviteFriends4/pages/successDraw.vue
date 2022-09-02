<template>
    <div>
        <draw-header :title="title" />
        <div class="wrap">
            <img src="../images/drowSuccess.png" alt="">
            <h3>提交成功</h3>
            <p><span>¥{{uMoney}}</span>将会在3-5个工作日内提现至您的</p>
            <p>“<span>{{uPhone}}</span>”支付宝账户</p>
            <p>请您耐心等待~</p>
        </div>
    </div>
</template>

<script>
    import DrawHeader from "../components/drawHeader"
    
    export default {
        name:"successDraw", // 提现人信息
        data(){
            return {
                title:"提交提现信息",
                uMoney:45,
                uPhone:15210226183
            }
        },
        components:{
            DrawHeader
        },
        methods:{
            
        },
        created() {
            this.uPhone = this.$route.query.uPhone;
            this.uMoney = this.$route.query.uMoney;
        }
    }
</script>

<style scoped lang="less">
    .wrap{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        padding-top: .1rem; 
        img{transform: scale(0.5)}
        h3{
            font-weight: normal;
            color: #4A4A54;
            font-size: 21px;
            padding-bottom: .14rem;
            margin-top: -.05rem;
        }
        p{
            font-size: 15px;
            color: #A0A0A0;
            padding-bottom: .08rem;
            span{
                color: #303030;
            }
            &:nth-of-type(1){
                span{padding-right: .06rem;}
            }
            &:nth-of-type(3){
                padding-top: .26rem;
            }
        }
    }
</style>
<template>
    <div class="drawTitle">
        <div><img src="../images/money.png" alt=""> <span>我的赏金</span></div>
        <div><div class="drawRight"><span>{{activeTitle}}</span><img src="../images/rigthArrow.png" alt=""></div></div>
        <div><img src="../images/aliPay.png" alt=""><span>支付宝</span></div>
    </div>
</template>

<script>
    export default {
        name:"drawHeader",
        props:[
            "title"
        ],
        data(){
            return {
                activeTitle : this.title
            }
        }
    }
</script>

<style scoped lang="less">
    .myFlex(@direction:row){    // flex布局公共样式
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: @direction 
    }

    .drawTitle{
        height: 1.5rem;
        background: #FE1A15;
        color: #FFF;
        font-size: 15px;
        box-sizing: border-box;
        padding: 0 .49rem 0 .42rem;
        .myFlex();       
        div{
            .myFlex(column);
            margin-top: -.1rem;
            &:nth-child(1),&:nth-child(3){
                img{
                    transform: scale(0.5);
                }
                span{
                    margin-top: -.12rem;
                }
            }
            &:nth-child(2){
                padding-top: .26rem;
                padding-right: .1rem;
                flex: 1;
                .drawRight{
                    img{
                        padding: 0;
                        transform: scale(1);
                    }
                    span{
                        opacity: 0.5;
                        padding-bottom: .05rem;
                        padding-left: .1rem;
                    }
                }
            }
        }
    }
</style>
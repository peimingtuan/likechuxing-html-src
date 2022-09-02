<template>
    <div class="wrap" v-show="show">
        <div class="header"></div>
        <div class="btn" @click="goDownload">点击体验免费出行</div>
        <div class="footer"></div>
    </div>
</template>
<script>
export default {
    name:'oldUser',
    props:{
        show:Boolean,
        downloadUrl:String
    },
    methods:{
        goDownload(){
            location.href = this.downloadUrl
        }
    }
}
</script>
<style lang="less" scoped>
    .wrap{
        .header{
            width: 100%;
            height: 4rem;
            background:url('../images/oldheader2.png') no-repeat;
            background-size:100% 100%;
        }
        .btn{
            width:2.75rem;
            height: 0.475rem;
            border-radius: .22rem;
            text-align: center;
            color:#fff;
            font-size: .15rem;
            text-indent: 0;
            background: #d34548;
            line-height: 0.475rem;
            margin: 0 auto ;
        }
        .footer{
            width: 100%;
            height: 2.195rem;
            background:url('../images/oldfooter2.png') no-repeat;
            background-size:100% 100%;
        }
    }
</style>



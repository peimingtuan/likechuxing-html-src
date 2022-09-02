<template>
    <div class="dialog" v-show="show">
        <div class="img"></div>
        <div class="btn-wrap">
            <div class="btn" @click="goDownload">立即查看</div>
        </div>
    </div>
</template>
<script>
export default {
    props:{
        show:Boolean,
        downloadUrl:String
    },
    methods:{
        goDownload(){
            console.log(this.downloadUrl)
            location.href = this.downloadUrl
        }
    }
}
</script>
<style lang="less" scoped>
    .dialog{
        width: 100%;
        position: absolute;
        top: 3.335rem;
        left: 0;
        .img{
            width: 100%;
            height: 2.185rem;
            background:url('../images/tip.png') no-repeat;
            background-size:100% 100%;
        }
        .btn-wrap{
            width: 100%;
            padding: 0 .38rem .23rem;
            position: absolute;
            left: 0;
            top:2.4rem;
            .btn{
                height: .45rem;
                font-size: .20rem;
                background: #0184FF;
                border-radius: .22rem;
                text-align: center;
                line-height: .45rem;
                color: #fff;
            }
        }
    }
</style>



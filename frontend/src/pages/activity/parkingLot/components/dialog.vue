<template>
    <div class="dialog" v-show="show">
        <div class="img"></div>
        <div class="btn-wrap">
            <div class="btn" @click="goDownload">立即使用</div>
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
            height: 2.445rem;
            background:url('../images/tip.png') no-repeat;
            background-size:100% 100%;
        }
        .btn-wrap{
            width: 100%;
            padding: 0 .38rem .23rem;
            position: absolute;
            left: 0;
            top:2.5rem;
            .btn{
                height: .45rem;
                font-size: .20rem;
                background: #d82630;
                border-radius: .22rem;
                text-align: center;
                line-height: .45rem;
                color: #fff;
            }
        }
    }
</style>



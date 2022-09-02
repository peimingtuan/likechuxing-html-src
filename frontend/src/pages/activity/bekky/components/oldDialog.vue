<template>
    <div class="dialog" v-show="show">
        <div class="img">
        </div>
        <a :href="downloadUrl" class="download"></a>
    </div>
</template>
<script>
export default {
    props:{
        show:Boolean,
        downloadUrl:String
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
            height: 3.335rem;
            background:url('../images/tiperr.png') no-repeat;
            background-size:100% 100%;
        }
        .download{
            width: 0.8rem;
            height: 0.24rem;
            position: absolute;
            left: 1.11rem;
            top:2.33rem;
        }
    }
</style>



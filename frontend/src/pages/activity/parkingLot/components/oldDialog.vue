<template>
    <div class="dialog" v-show="show">
        <div class="img"></div>
    </div>
</template>
<script>
export default {
    props:{
        show:Boolean,
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
    }
</style>



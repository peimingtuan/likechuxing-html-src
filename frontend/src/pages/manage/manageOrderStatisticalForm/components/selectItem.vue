<template>
    <div class="wrap" @click="click">
        <div class="label">{{label}}</div>
        <div class="icon" v-show="!hideIcon"></div>
    </div>
</template>
<script>
export default {
    name:'selectItem',
    props:['label','hideIcon'],
    methods:{
        click(){
            this.$emit('click')
        }
    }
}
</script>
<style lang="less" scoped>
    .wrap{
        display:flex;
        justify-content: center;
        align-items: center;
        height: .3rem;
        .label{
            color: #333;
            font-size: .14rem;
        }
        .icon{
            width: .09rem;
            height: .04rem;
            background: url('../image/icon_drop.png') no-repeat;
            background-size: 100% 100%;
        }
    }
</style>



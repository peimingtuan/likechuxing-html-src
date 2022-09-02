<template>
    <div class="wrap" @click="click" :class="mr?'mr':''">
        <div class="label">{{label}}</div>
        <div class="icon"></div>
    </div>
</template>
<script>
export default {
    name:'selectItem',
    props:{
        label:String,
        mr:Boolean
    },
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
        padding: 0 .1rem;
        height: .3rem;
        border: 1px solid #e4e4e4;
        border-radius: 2px;
        .label{
            color: #333;
            font-size: .14rem;
            margin-right: .06rem;
        }
        .icon{
            width: .09rem;
            height: .04rem;
            background: url('../image/icon_drop.png') no-repeat;
            background-size: 100% 100%;
        }
    }
    .mr{
        margin-right: .05rem;
    }
</style>



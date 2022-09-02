<template>
    <div class="list-item-container" @click="press">
        <div class="icon">
            <slot name="icon"/>
            <div class="num" v-if="num>0">{{num}}</div>
        </div>
        <div class="label" :class="maxsize?'maxsize':''">{{label}}</div>
    </div>
</template>
<script>
export default {
    name:'listItem',
    props:['label','iconClass','num','maxsize'],
    data(){
        return{

        }
    },
    methods:{
        press(){
            this.$emit('press')
        }
    }
}
</script>
<style lang="less" scoped>
    .list-item-container{
        width:100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: .15rem 0;
        .label{
            font-family: PingFang-SC-Medium;
            font-size: .13rem;
            color: #333;
            text-align: center;
        }
        .maxsize{
            font-size: .14rem;
        }
        .icon{
            margin-bottom: .03rem;
            position: relative;
            .num{
                padding: 0 6px;
                line-height: 16px;
                min-width: 14px;
                display: flex;
                justify-content: center;
                align-items: center;
                background: #ED3800;
                border-radius: 8px;
                position: absolute;
                bottom: .22rem;
                right: -20px;
                font-size: .12rem;
                color: #fff;
            }
        }
    }
</style>



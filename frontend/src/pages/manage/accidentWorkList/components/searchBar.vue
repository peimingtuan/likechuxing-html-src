<template>
    <div class="wrap">
        <div class="main">
            <div class="icon"></div>
            <input type="text" :placeholder="placeholder" @input="sendValue" v-model="value">
        </div>
        <slot name="rightBtn"></slot>
    </div>
</template>
<script>
export default {
    name:'searcchBar',
    props:{
        'placeholder':String
    },
    data(){
        return{
            value:''
        }
    },
    methods:{
        sendValue(){
            this.$emit('changeValue',this.value)  
        }
    },
    destroyed(){
        this.timer&&clearTimeout(timer)
    }
}
</script>
<style lang="less" scoped>
    .wrap{
        width: 100%;
        height: .54rem;
        padding: .1rem;
        background: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .main{
            height: 100%;
            flex:1;
            background: #F0F0F0;
            border-radius: 2px;
            display: flex;
            align-items: center;
            padding: 0 .1rem;
            .icon{
                width:.12rem;
                height: .12rem;
                background: url('../images/icon_search.png') no-repeat;
                background-size: 100% 100%;
            }
            input{
                display: block;
                flex:1;
                height: 100%;
                border: none;
                background: transparent;
                padding-left: .08rem;
                font-size: .12rem;
            }
        }
    }
</style>



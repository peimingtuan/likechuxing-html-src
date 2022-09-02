<template>
    <div class="imgView-container">
        <transition name="fade">
            <div class="mask" v-show="show"></div>
        </transition>
        <transition name="fade">
            <div class="img-wrap" v-show="show">
                <img :src="url" />
            </div>  
        </transition>
        <div class="pswp__button pswp__button--close btn" @click="hide" v-show="show"></div>
    </div>
</template>
<script>
export default {
    name:'imgView',
    props:{
        show:Boolean,
        url:String
    },
    methods:{
        hide(){
            this.$emit('closeImgview')
        }
    }
}
</script>
<style lang="less" scoped>
    .imgView-container{
        .mask{
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            z-index: 2010;
            background: #000;
        }
        .img-wrap{
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            padding: .4rem;
            z-index: 2011;
            display: flex;
            justify-content: center;
            align-items: center;
            img{
                display:block;
                width: 100%;
            }
        }
        .btn{
            position: fixed;
            right: 0;
            top: 0;
            z-index: 2012;
        }
    }
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }
    .fade-enter, .fade-leave-to{
        opacity: 0;
    }
    .slide-enter-active, .slide-leave-active {
        transition: transform .5s;
    }
    .slide-enter, .slide-leave-to{
        transform: translateY(100px)
    }
</style>



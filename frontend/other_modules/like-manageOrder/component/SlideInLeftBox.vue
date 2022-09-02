<template>
    <div class="SlideLeftContainer">
        <!--mask层-->
        <transition
                name="custom-classes-transition"
                enter-active-class="animated faster fadeIn"
                leave-active-class="animated faster fadeOut"
                @after-leave="afterLeave">
            <div class="mask" @touchmove="preventEvent" v-if="mask&&show"></div>
        </transition>

        <!--对话框层-->
        <transition
                name="custom-classes-transition"
                enter-active-class="animated faster slideInRight"
                leave-active-class="animated faster slideOutRight">
            <div class="container" @touchmove="preventEvent2" v-if="show">
                <div class="box-header">
                    {{title}}
                    <i class="close-confirm" @click="()=>this.show=false"></i>
                </div>
                <div class="box-body">
                    <slot/>
                </div>
            </div>

        </transition>
    </div>
</template>

<script>
  require('../../css-animate/animateBase.less')
  require('../../css-animate/fadeInOut.less')
  require('../../css-animate/slideInRight.less')
  require('../../css-animate/slideOutRight.less')

  export default {
    name: "slide-up-box",
    props:{
      title:{
        default:''
      },
      needTouchmove:{
        defalut:false
      }
    },
    data() {
      return {
        mask: true,
        show:false
      }
    },
    methods: {
      afterLeave() {
        this.$emit('close')
      },
      preventEvent(e) {
        e.preventDefault()
        e.stopPropagation()
        return false
      },
      preventEvent2 (e) {
        if(!this.needTouchmove){
          e.preventDefault()
          e.stopPropagation()
          return false
        }
      },
      close(){
        this.show = false
      }
    },
    mounted(){
      this.show = true
    }
  }
</script>

<style lang="less">
    .SlideLeftContainer {
        position: fixed;
        z-index: 40;
        top: 0;
        width: 100vw;
        height: 100vh;
        .mask {
            position: absolute;
            width: 100vw;
            height: 100vh;
            top: 0;
            background-color: rgba(0, 0, 0, 0.44);
        }
        .container {
            position: absolute;
            width: 85%;
            height: 100%;
            top:0;
            right:0;
            background-color: #fff;
            .box-header {
                text-align: center;
                padding: 0.15rem 0.2rem;
                position: relative;
                .close-confirm {
                    display: block;
                    width: 0.2rem;
                    height: 0.2rem;
                    background: url('../images/icon_close.png') no-repeat center;
                    background-size: 80%;
                    position: absolute;
                    top:0.15rem;
                    left:0.2rem;
                }
            }
            .box-body{
                position: absolute;
                top:0.5rem;
                left:0;
                right:0;
                bottom:0;
            }
        }
    }
</style>
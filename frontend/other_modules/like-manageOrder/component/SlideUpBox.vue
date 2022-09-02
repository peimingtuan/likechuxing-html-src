<template>
    <div class="SlideUpContainer">
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
                enter-active-class="animated faster slideInUp"
                leave-active-class="animated faster slideOutDown">
            <div class="container" @touchmove="preventEvent" v-if="show">
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
  require('../../css-animate/slideInUp.less')
  require('../../css-animate/slideOutDown.less')

  export default {
    name: "slide-up-box",
    props:{
      title:{
        default:''
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
//      e.preventDefault()
        e.stopPropagation()
        return false
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

<style lang="less" scoped>
    .SlideUpContainer {
        position: fixed;
        z-index: 40000;
        top: 0;
        left:0;
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
            width: 100%;
            bottom: 0;
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
                padding: 0.05rem 0.2rem 0.2rem;
                max-height: 80vh;
                overflow: scroll;
                -webkit-overflow-scrolling: touch;
            }
        }
    }
</style>
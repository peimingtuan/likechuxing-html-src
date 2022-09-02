<template>
    <div class="SlideUpContainer">
        <!--mask层-->
        <transition
                name="custom-classes-transition"
                enter-active-class="animated faster fadeIn"
                leave-active-class="animated faster fadeOut"
                @after-leave="afterLeave">
            <div class="mask" @click="maskClick" @touchmove="preventEvent" v-if="mask&&show"></div>
        </transition>

        <!--对话框层-->
        <transition
                name="custom-classes-transition"
                enter-active-class="animated faster slideInUp"
                leave-active-class="animated faster slideOutDown">
            <div class="container" v-if="show" @touchmove="preventEvent2">
                <div class="box-header" v-if="title">
                    {{title}}
                    <i class="close-confirm" @click="()=>this.show=false" ></i>
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
    props: {
      title: {
        default: ''
      },
      needTouchmove:{
        default:false
      },
      needMaskClose:{
        default:false
      }
    },
    data () {
      return {
        mask: true,
        show: false
      }
    },
    methods: {
      afterLeave () {
        this.$emit('close')
      },
      preventEvent (e) {
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
      close () {
        this.show = false
      },
      maskClick(){
        if(this.needMaskClose){
          this.close()
        }
      }
    },
    mounted () {
      this.show = true
    }
  }
</script>

<style lang="less" scoped>
    .SlideUpContainer {

        .mask {
            position: fixed;
            z-index: 80;
            width: 100vw;
            height: 100vh;
            top: 0;
            left:0;
            background-color: rgba(0, 0, 0, 0.44);
        }

        .container {
            position: fixed;
            z-index: 81;
            width: 100vw;
            bottom: 0;
            left:0;
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
                    top: 0.15rem;
                    left: 0.2rem;
                }
            }

            .box-body {
                max-height: 80vh;
                overflow: scroll;
            }
        }
    }
</style>
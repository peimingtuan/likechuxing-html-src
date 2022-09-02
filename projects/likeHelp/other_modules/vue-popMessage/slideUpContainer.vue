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
                <slot/>
            </div>

        </transition>
    </div>
</template>

<script>
  require('../css-animate/animate.less')

  export default {
    name: "slide-up-container",
    data() {
      return {
        mask: true
      }
    },
    props: ['show'],
    methods: {
      afterLeave() {
        this.$emit('close')
      },
      preventEvent(e) {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
    }
  }
</script>

<style lang="less">
    .SlideUpContainer {
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
            width: 100%;
            bottom: 0;
        }
    }
</style>

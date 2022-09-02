<template>
    <div class='like-alert'>
        <!--mask层-->
        <transition
                name="custom-classes-transition"
                enter-active-class="animated faster fadeIn"
                leave-active-class="animated faster fadeOut"
        >
            <div class="mask" @touchmove="preventEvent" v-if="show"></div>
        </transition>

        <!--对话框层-->
        <transition
                name="custom-classes-transition"
                enter-active-class="animated faster zoomIn"
                leave-active-class="animated faster zoomOut"
                @after-leave="destroy"
        >
            <div class="alert" v-if="show">
                <div class="dialogBox">
                    <div class="title" v-if="title">{{title}}</div>
                    <div class="icon" :data-type=icon v-else-if="icon"></div>

                    <div class="msg">
                        <p class="item" v-for="item in msg" :key="item" :class="{'text-left':msg.length>1}">
                            <span class="con" v-html="item"></span>
                        </p>
                    </div>

                    <!--alert单按钮-->
                    <div class="alert_btn_container clearfix">
                        <div class="alert_btn" @click="close">{{confirmButtonText}}</div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
  require('../css-animate/animate.less')

  export default {
    name: "alert",
    data() {
      return {
        show: false,
        title: '',
        icon: '',
        msg: '',
        confirmButtonText: "确定"
      }
    },
    methods: {
      preventEvent(e) {
        e.preventDefault()
        e.stopPropagation()
        return false
      },
      destroy() {
        this.$emit('popDestroy')
      },
      close() {
        this.show = false
        this.$emit('popConfirm')
      }
    },
    mounted() {
      this.show = true
    }
  }
</script>

<style lang="less">
    //@import '../css-animate/animate.less';
    @import './css/common.less';

    .like-alert {
        position: absolute;
        z-index: 100;

        .alert {
            position: fixed;
            width: 100vw;
            height: 100vh;
            top: 0;
        }

        .mask {
            @mask();
        }

        .dialogBox {
            @dialogBox();
            .alert_btn_container {
                border-top: solid 1px #e5e5e5;
                .alert_btn {
                    color: #111;
                    line-height: 0.48rem;
                    font-size: 16px;
                }
            }
        }
    }

</style>

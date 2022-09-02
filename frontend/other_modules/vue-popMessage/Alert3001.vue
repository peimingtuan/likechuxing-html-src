<template>
    <div class='like-alert-3001'>
        <!--mask层-->
        <transition name="custom-classes-transition"
                    enter-active-class="animated faster fadeIn"
                    leave-active-class="animated faster fadeOut">
            <div class="mask" v-on:touchmove="preventEvent" v-if="show"></div>
        </transition>

        <!--对话框层-->
        <transition
                name="custom-classes-transition"
                enter-active-class="animated faster zoomIn"
                leave-active-class="animated faster zoomOut"
                @after-leave="_destroy"
        >
            <div class="alert" v-if="show"  @touchmove="preventEvent">
                <div class="dialogBox">
                    <div class="title">账号异常提醒</div>

                    <div class="msg">
                        <p v-for="item in msg" v-html="item"></p>
                    </div>

                    <!--alert单按钮-->
                    <div class="alert_btn_container clearfix">
                        <button class="btn btn-primary" @click="close">{{confirmButtonText}}</button>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
  require('../css-animate/animateBase.less')
  require('../css-animate/fadeInOut.less')
  require('../css-animate/zoomInOut.less')

  export default {
    name: "alert",
    data () {
      return {
        show: false,
        msg: '',
        confirmButtonText: "确定"
      }
    },
    methods: {
      preventEvent (e) {
        e.preventDefault()
        e.stopPropagation()
        return false
      },
      _destroy () {
        this.$emit('popDestroy')
      },
      close () {
        this.show = false
        this.$emit('popConfirm')
      }
    },
    mounted () {
      this.show = true
    }
  }
</script>

<style lang="less">
    @import '../css-btn/index';

    .like-alert-3001 {
        position: absolute;
        z-index: 100;

        .alert, .mask {
            position: fixed;
            width: 100vw;
            height: 100vh;
            top: 0;
        }

        .mask {
            background-color: rgba(0, 0, 0, 0.44);
        }
        .dialogBox {
            text-align: center;
            background-color: #FFF;
            width: 3rem;
            margin-left: -1.5rem;
            position: absolute;
            top: 30%;
            left: 50%;
            padding-top: 0.15rem;
            border-radius: 3px;
            color: #999;
            .title {
                font-size: 0.16rem;
                margin: 0.1rem 0.3rem;
                color: #111;
            }
            .msg {
                text-align: left;
                font-size: 0.15rem;
                margin: 0.1rem 0.3rem;
            }
            .alert_btn_container {
                height: 0.4rem;
                margin: 0.1rem 0.3rem;
                padding: 0.15rem 0;
                .btn {
                    width: 100%;
                    height: 100%;
                    font-size: 16px;
                    border-radius: 3px;
                    border: none;
                    background-color: #494b51;
                }
            }
        }
    }

</style>
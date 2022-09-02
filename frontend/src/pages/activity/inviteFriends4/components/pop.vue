<template>
    <div class="pop">

        <transition
                name="custom-classes-transition"
                enter-active-class="animated fast fadeIn"
                leave-active-class="animated fast fadeOut"
        >
            <div class="mask" v-if="show"></div>
        </transition>

        <transition
                name="custom-classes-transition"
                enter-active-class="animated faster zoomIn"
                leave-active-class="animated faster zoomOut"
                @after-leave="_destroy"
        >
            <div class="box" v-if="show">
                <div class="container">
                    <div class="title-box">

                        <div class="text" v-if="type==='rental'">
                            <p style="fontSize:18px">完成一笔</p>
                            <p>有里程的订单才可以提现噢~</p>
                        </div>

                        <div class="pop-icon time" v-if="type==='time'"></div>

                        <div class="pop-icon scan" v-if="type==='scan'"></div>

                    </div>

                    <div class="content-box">

                        <button class="pop-btn" v-if="type==='rental'">立刻下单</button>

                        <div class="text" v-if="type==='time'">
                            <p style="fontSize:18px">现在还没到提现时间哦</p>
                            <p class="sub">每个月28号10点-19点可以提现</p>
                        </div>

                        <div class="text" v-if="type==='scan'">
                            <p style="fontSize:18px">仅支持微信扫码参与活动哦</p>
                        </div>

                    </div>

                </div>

                <div class="close-box" @click="close"></div>
            </div>
        </transition>
    </div>
</template>

<script>
  export default {
    name: "pop",
    props: [
      'type'
    ],
    data () {
      return {
        show: false
      }
    },
    methods: {
      _destroy () {
        this.$emit('popDestroy')
      },
      close () {
        this.show = false
      }
    },
    mounted () {
      this.show = true
    }
  }
</script>

<style lang=less scoped>
    .pop {
        width: 100vw;
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 10;

        .mask {
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.44);
        }

        .box {
            position: absolute;
            width: 2.95rem;
            top: 1.8rem;
            left: 0.4rem;

            .container {
                background-color: #fff;
                border-radius: 5px;
                overflow: hidden;
            }

            .title-box {
                padding: 0.2rem;
                font-size: 15px;
                background-color: #fe1a15;
                color: #fff;
                text-align: center;

                .pop-icon{
                    width: 0.6rem;
                    height: 0.6rem;
                    background: no-repeat center;
                    background-size: 100%;
                    margin:0 auto;

                    &.time{
                        background-image: url('../images/pop_time.png');
                    }

                    &.scan{
                        background-image: url('../images/pop_scan.png');
                    }
                }
            }

            .content-box {
                padding: 0.35rem 0.2rem;
                text-align: center;
                font-size: 15px;
                color:#1b1b1f;
                .sub{
                    color:#848484
                }

                .pop-btn {
                    font-size: 18px;
                    color: #fff;
                    outline: none;
                    background-color: #fe1a15;
                    height: 0.4rem;
                    width: 1.45rem;
                    border-radius: 3px;
                    border: none
                }
            }

            .close-box {
                width: 0.3rem;
                height: 0.3rem;
                background: url('../images/close.png') no-repeat center;
                background-size: 100%;
                margin: 0.15rem auto;
            }
        }
    }
</style>
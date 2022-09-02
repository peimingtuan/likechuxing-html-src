<template>
  <div class='YdAlert'>
    <div class="toast" v-if="mold === 'toast' ">
      <div class="msg">{{msg}}</div>
    </div>

    <transition name="custom-classes-transition"
                enter-active-class="animated fast slideInDown"
                leave-active-class="animated slideOutUp">
      <div class="tips" v-if="mold === 'tips'">
        {{msg}}
      </div>
    </transition>

    <div class="alert mask" v-on:touchmove="preventEvent" v-if="mold === 'alert' || mold === 'confirm'">
      <div class="dialogBox animated faster zoomIn">
        <div class="title">{{title}}</div>
        <div class="msg">{{msg}}</div>

        <div class="alert_btn_container" v-if="mold === 'alert'">
          <button class="btn_row_1 blue_btn btn_animate" v-on:click="confirmClick">{{confirmButtonText}}</button>
        </div>

        <div class="alert_btn_container" v-else>
          <button class="btn_row_2 white_btn btn_animate" v-on:click="cancelClick">{{cancelButtonText}}</button>
          <button class="btn_row_2 blue_btn btn_animate" v-on:click="confirmClick">{{confirmButtonText}}</button>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
  import {mapState} from 'vuex'
  export default {
    name: 'alert',
    computed: mapState({
      mold: state => state.YdAlert.mold,
      title: state => state.YdAlert.title,
      msg: state => state.YdAlert.msg,
      cancelButtonText: state => state.YdAlert.cancelButtonText,
      confirmButtonText: state => state.YdAlert.confirmButtonText
    }),
    methods: {
      confirmClick: function () {
        this.$store.state.YdAlert.confirmButtonCallback()
        this.$store.commit('YdAlert/hideAll')
      },
      cancelClick () {
        this.$store.state.YdAlert.cancelButtonCallback()
        this.$store.commit('YdAlert/hideAll')
      },
      preventEvent (e) {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .YdAlert {
    .toast {
      position: fixed;
      top: 35vh;
      width: 100vw;
      .msg {
        width: 60%;
        max-width: 320px;
        background-color: rgba(0, 0, 0, 0.8);
        color: #FFF;
        padding: 0.1rem 0.2rem;
        border-radius: 3px;
        margin: 0 auto
      }
    }

    .tips {
      position: fixed;
      top: 0;
      left: 3%;
      width: 94%;
      box-sizing: border-box;
      padding: 0.05rem 1em;
      border-radius: 0 0 5px 5px;
      background-color: rgba(0, 0, 0, 0.8);
      color: #fff;
    }

    .mask {
      position: fixed;
      width: 100vw;
      height: 100vh;
      top: 0;
      background-color: rgba(0, 0, 0, 0.3);
      .dialogBox {
        background-color: #FFF;
        width: 2.8rem;
        margin-left: -1.4rem;
        position: absolute;
        top: 30%;
        left: 50%;
        padding: 0.16rem 0;
        border-radius: 3px;
        color: #6B6D70;
        .title {

          font-size: 16px;
          margin: 0.1rem 0.2rem;
        }
        .msg {
          font-size: 13px;
          margin: 0.1rem 0.2rem;
        }
        .alert_btn_container {
          height: 0.4rem;
          margin: 0.1rem 0.2rem;
          padding-top: 0.08rem;
          button {
            height: 100%;
            font-size: 16px;
          }
          .btn_row_1 {
            width: 100%;
          }
          .btn_row_2 {
            width: 47.5%;
            &:nth-child(1) {
              float: left
            }
            &:nth-child(2) {
              float: right
            }
          }
        }

      }
    }
  }

</style>

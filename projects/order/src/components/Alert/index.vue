<template>
  <div class='Alert'>
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
        <img v-if="icon === 'clock'" src="./images/clock.png" class="alert_icon" />
        <img v-if="icon === 'list_car'" src="./images/list_car.png" class="alert_icon" />
        <img v-if="icon === 'list_money'" src="./images/list_money.png" class="alert_icon" />
        <img v-if="icon === 'money'" src="./images/money.png" class="alert_icon" />
        <img v-if="icon === 'park'" src="./images/park.png" class="alert_icon" />
        <img v-if="icon === 'ring'" src="./images/ring.png" class="alert_icon" />
        <div class="title">{{title}}</div>
        <div class="msg"><p v-for="item in msg">{{item}}</p></div>

        <div class="alert_btn_container" v-if="mold === 'alert'">
          <button class="btn_row_1 dark_btn btn_animate" v-on:click="confirmClick">{{confirmButtonText}}</button>
        </div>

        <div class="alert_btn_container" v-else>
          <button class="btn_row_2 white_btn btn_animate" v-on:click="cancelClick">{{cancelButtonText}}</button>
          <button class="btn_row_2 dark_btn btn_animate" v-on:click="confirmClick">{{confirmButtonText}}</button>
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
      mold: state => state.Alert.mold,
      icon: state => state.Alert.icon,
      title: state => state.Alert.title,
      msg: state => state.Alert.msg,
      cancelButtonText: state => state.Alert.cancelButtonText,
      confirmButtonText: state => state.Alert.confirmButtonText
    }),
    methods: {
      confirmClick: function () {
        this.$store.state.Alert.confirmButtonCallback()
        this.$store.commit('Alert/hideAll')
      },
      cancelClick () {
        this.$store.state.Alert.cancelButtonCallback()
        this.$store.commit('Alert/hideAll')
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
  .Alert {
    position: absolute;
    z-index: 100;
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
        }
        .msg {
          font-size: 0.15rem;
          margin: 0.1rem 0.3rem;
        }
        .alert_btn_container {
          height: 0.4rem;
          margin: 0.1rem 0.3rem;
          padding: 0.15rem 0;
          border-top:solid 1px #DFDFDF;
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

    .alert_icon{
      display: block;
      margin:0 auto;
      width:0.5rem
    }
  }

</style>

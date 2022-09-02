<template>
  <div class='Alert'>
    <!--mask层-->
    <transition
      name="custom-classes-transition"
      enter-active-class="animated faster fadeIn"
      leave-active-class="animated faster fadeOut"
      v-on:after-leave="afterLeave">
      <div class="mask" v-on:touchmove="preventEvent" v-if="show"></div>
    </transition>

    <!--对话框层-->
    <transition
      name="custom-classes-transition"
      enter-active-class="animated faster zoomIn"
      leave-active-class="animated faster zoomOut">
      <div class="alert" v-if="show">
        <div class="dialogBox">
          <!--显示icon-->
          <img v-bind:src="require('../../assets/images/branch/立刻还有车@3x.png')" class="alert_icon"/>

          <div class="title">立刻还网点说明</div>

          <div class="msg">
            <p>此标志为立刻出行非合作网点，您在此取车需正常缴纳停车费。</p>
          </div>

          <!--单按钮-->
          <div class="alert_btn_container" @click="closeWindow">
            知道了
          </div>

        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'branch-explain',
    props: ['close'],
    data(){
      return{
        show:false
      }
    },
    mounted() {
      this.show = true
    },
    methods: {
      afterLeave() {
        this.$store.dispatch('Widget/toggle','branchExplain')
      },
      closeWindow() {
        this.show = false
      },
      preventEvent(e) {
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
      background-color: #FFF;
      width: 2.8rem;
      margin-left: -1.4rem;
      position: absolute;
      top: 30%;
      left: 50%;
      padding-top: 0.15rem;
      border-radius: 3px;
      color: #999;
      .title {
        color: #494B51;
        font-size: 0.17rem;
        margin: 0.13rem 0.3rem;
      }
      .msg {
        text-align: left;
        font-size: 0.14rem;
        margin: 0.13rem 0.3rem 0.2rem;
      }
      .alert_btn_container {
        color: #111;
        font-size: 0.16rem;
        padding: 0.15rem 0;
        border-top: solid 1px #DFDFDF;
      }
    }

    .alert_icon {
      display: block;
      margin: 0 auto;
      width: 0.5rem
    }
  }

</style>

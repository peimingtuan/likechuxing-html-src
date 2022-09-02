<template>
  <div id="app">
    <transition
      name="custom-classes-transition"
      enter-active-class="animated faster fadeIn"
      leave-active-class="animated faster fadeOut">
        <router-view class="MainView" name="mainView"/>
    </transition>
    <!--<transition
      name="custom-classes-transition"
      enter-active-class="animated faster fadeIn"
      leave-active-class="animated faster fadeOut">
      <router-view class="UpperView" name="upperView"/>
    </transition>-->
  </div>
</template>

<script>
  export default {
    name: 'app',
    data() {
      return {}
    },
    // 全局组件
    components: {}
  }
</script>

<style lang="less">
  @import "./assets/css/reset.css";
  @import "./assets/css/buttons/button-v2";
  @import "./assets/css/common.less";

  #app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #111;
    width: 100vw;
    margin: 0 auto;
    text-align: center;

    .PAGE{
      min-height: 100vh;
      position: absolute;
      width: 100%;
      z-index: 20;
      top: 0;
    }

    .MainView {
      min-height: 100vh;
      position: absolute;
      width: 100%;
      z-index: 1;
      top: 0;
    }

    .UpperView {
      min-height: 100vh;
      position: absolute;
      width: 100%;
      z-index: 2;
      top: 0;
    }
  }
</style>

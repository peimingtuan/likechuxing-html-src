<template>
  <div id="app" v-bind:class='sideBarClass'>
    <router-view class="SideBar" name="sideBar"></router-view>
    <router-view class="MainView" name="mainView"></router-view>
    <YdAlert></YdAlert>
    <YdLoading></YdLoading>
  </div>
</template>

<script>
  import YdAlert from './components/YdAlert/index.vue'
  import YdLoading from './components/YdLoading/index.vue'

  export default {
    name: 'app',
    data () {
      return {}
    },
    components: {
      YdAlert,
      YdLoading
    },
    computed: {
      sideBarClass: function () {
        return this.$store.state.sideBar.open ? 'side_open' : ''
      }
    },
    created () {

    }
  }
</script>

<style lang="less">
  @import "../static/css/reset.css";
  @import "../static/css/font.css";
  @import "./assets/css/button.less";
  @import "./assets/css/animates.less";

  @sideBarWidth: 80vw;

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;

    &.side_open {
      .SideBar {
        margin-left: @sideBarWidth;
      }
      .MainView {
        margin-left: @sideBarWidth;
      }
    }

    .SideBar {
      width: @sideBarWidth;
      height: 100vh;
      position: absolute;
      left: -@sideBarWidth;
      top: 0;
      background-color: #7f7f7f;
      transition: margin 200ms ease-in-out;
    }

    .MainView {
      width: 100vw;
      min-height: 100vh;
      transition: margin 200ms ease-in-out;
    }
  }
</style>

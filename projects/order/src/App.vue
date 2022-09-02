<template>
  <div id="app" v-bind:class='sideBarClass'>
    <router-view class="SideBar" name="sideBar"></router-view>
    <router-view v-wechat-title="$route.meta.title" class="MainView" name="mainView"></router-view>
    <Alert></Alert>
    <Loading></Loading>
  </div>
</template>

<script>
  import Alert from './components/Alert/index.vue'
  import Loading from './components/Loading/index.vue'
  import 'css-loading'
  import myaxios from './common/myaxios'
  import API from './common/apiAddress'
  import {IsWeiXin} from './common/UserAgent'
  const wx = window.wx

  export default {
    name: 'app',
    data () {
      return {}
    },
    components: {
      Alert,
      Loading
    },
    computed: {
      sideBarClass: function () {
        return this.$store.state.sideBar.open ? 'side_open' : ''
      }
    },
    beforeCreate () {
    	// 从本地取出user的信息
      this.$store.dispatch('user/readLocalUser')
    },
    methods: {
      getWxSign () {
        myaxios.post(API.wxjs.signPackage, {url: window.location.href.split('#')[0]}, {showStatus1: false}).then(function (res) {
          if (+res.data.status === 0) {
            let sign = res.data.data
            this.$store.commit('data/set', sign)
            wx.config({
              debug: false,
              appId: sign.appId,
              timestamp: sign.timestamp,
              nonceStr: sign.nonceStr,
              signature: sign.signature,
              jsApiList: [
                'checkJsApi',
                'chooseImage',
                'uploadImage',
                'getLocation',
                'getLocalImgData',
                'chooseWXPay',
                'onMenuShareTimeline',
                'onMenuShareAppMessage'
              ]
            })
            wx.ready(function () {
            	let shareOptions = {
                title: '立刻出行', // 分享标题
                desc: API.self, // 分享描述
                link: API.self, // 分享链接
                imgUrl: API.self + '/images/activity_spread/logo.png', // 分享图标
                type: 'link', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {},
                cancel: function () {}
              }
              let pyqOptions = {
                title: shareOptions.desc,
                link: shareOptions.link,
                imgUrl: shareOptions.imgUrl,
                type: shareOptions.type,
                success: shareOptions.success,
                cancel: shareOptions.cancel
              }
              wx.onMenuShareAppMessage(shareOptions)
              wx.onMenuShareTimeline(pyqOptions)
            })
          }
        }.bind(this))
      }
    },
    created () {
      if (IsWeiXin() && !this.$store.state.data.appId) { this.getWxSign() }
    	// 获取服务器时间
      this.$store.dispatch('data/getTime')
      // 定位
      this.$store.dispatch('data/location')
    },
    updated () {
      if (IsWeiXin() && this.$router.history.current.meta.needWx && !this.$store.state.data.appId) { this.getWxSign() }
    }
  }
</script>

<style lang="less">
  @import "./assets/css/reset.css";
  @import "./assets/css/font.css";
  @import "./assets/css/button.less";
  @import "./assets/css/animates.less";

  #app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    width: 100vw;
    max-width: 640px;
    margin: 0 auto;

    &.side_open {
      .SideBar {
        margin-left: 100vw;
      }
    }

    .SideBar {
      width: 100vw;
      height: 100vh;
      position: absolute;
      left: -100vw;
      top: 0;
      z-index: 80;
      transition: margin 300ms ease-in-out;
    }

    .MainView {
      min-height: 100vh;
      transition: margin 300ms ease-in-out;
    }
  }
</style>

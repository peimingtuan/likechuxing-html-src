<template>
  <div class="MainIndex">
    <div class="header">
      <img src="../../assets/images/logo.png" @click="toggle" class="logo" />
      <p @click="toggle">{{user_name}}</p>
      <img src="../../assets/images/main_index_bg.png" class="main_bg" />
    </div>
    <div class="btn_con">
      <button class="invite_btn" style="display: none">邀请好友</button>
      <button class="sub_btn" @click="download">立刻下载</button>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import {IsIos} from '../../common/UserAgent'
  export default {
    data () {
      return {
      	is_login: false
      }
    },
    computed: mapState({
      user_name: state => {
        let name = state.user.phone
        if (name.match(/\d{11}/)) {
          return name.substr(0, 3) + ' **** ' + name.substr(7, 11)
        } else {
          return '请登录'
        }
      }
    }),
    methods: {
    	download () {
    		if (IsIos()) {
          window.open('https://itunes.apple.com/cn/app/id1245529926?mt=8')
        } else {
          window.open('http://a.app.qq.com/o/simple.jsp?pkgname=com.like.car')
        }
      },
      toggle: function () {
        this.$store.dispatch('sideBar/openSideBar')
      }
    },
    created: function () {
    	// 获取个人中心用户数据，没登录登出
      this.$store.dispatch('user/getMenuInfo')
    }
  }
</script>

<style lang="less" scoped>
  .MainIndex{
    .logo{
      width:0.6rem;
      display: block;
      margin:0 auto;
      padding-top: 0.5rem;
    }
    p{
      font-size: 0.15rem;
      color:#111;
      padding: 0.1rem;
    }
    .main_bg{
      width:2.6rem;
      display: block;
      margin:0 auto;
      padding: 0.1rem 0 1.3rem;
    }
    .btn_con{
      position: absolute;
      padding: 0.15rem 0;
      left:0.15rem;
      right:0.15rem;
      bottom:0;
      background-color: #FFF;
      button{
        width: 100%;
        height: 0.46rem;
        font-size: 0.15rem;
        border-radius: 2px;
      }
      .sub_btn{
        background-color: #111;
        color:#fff;
        margin-top: 0.1rem;
      }
      .invite_btn{
        background-color: #fff;
        color: #111;
        border:solid 1px #dfdfdf
      }
    }
  }
</style>

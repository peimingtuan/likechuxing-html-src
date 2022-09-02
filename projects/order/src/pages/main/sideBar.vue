<template>
  <div class="UserBar" @touchmove.prevent="stop">
    <div :class="['mask', {show: open}]" @click="closeBar"></div>
    <div class="mainBar">
      <div class="header">
        <img src="../../assets/images/logo.png" class="logo"/>
        <p class="name">{{user_name}}</p>
        <div class="close" @click="closeBar"></div>
      </div>
      <ul class="menus">
        <li class="license menu">
          <div class="menu_name">身份认证</div>
          <div class="desc" @click="jumpToLicense">{{licenseStatusDesc}}<span class="right_arrow"></span></div>
        </li>
        <li class="deposit menu">
          <div class="menu_name">用车押金</div>
          <div class="desc" @click="toDeposit">{{depositStatusDesc}}<span class="right_arrow"></span></div>
        </li>
      </ul>
      <div class="logout">
        <div class="menu_name" @click="logout">退出登录</div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  export default {
    data () {
      return {}
    },
    computed: mapState({
      open: state => state.sideBar.open,
      user_name: state => {
        let name = state.user.phone
        if (name.match(/\d{11}/)) {
          return name.substr(0, 3) + ' **** ' + name.substr(7, 11)
        } else {
          return '请登录'
        }
      },
      licenseStatusDesc: state => {
        const desc = ['审核通过', '待审核', '未通过', '未认证']
        return desc[+state.user.license]
      },
      depositStatusDesc: state => {
        // status=3时状态是退款，此时显示'未支付'
        const desc = ['无需支付', '未支付', '已支付', '未支付', '退款中']
        return desc[state.user.deposit]
      }
    }),
    methods: {
      closeBar () {
        this.$store.dispatch('sideBar/closeSideBar')
      },
      logout () {
      	this.$store.dispatch('Alert/show', {
          mold: 'confirm',
          msg: ['退出当前账号？'],
          confirmButtonText: '退出',
          confirmButtonCallback: function () {
            this.$store.dispatch('sideBar/closeSideBar')
            this.$store.dispatch('user/logout')
            this.$router.push({name: 'login'})
          }.bind(this)
        })
      },
      toDeposit () {
        if ([1, 3].indexOf(this.$store.state.user.deposit) > -1) {
          this.$router.push('/deposit/index')
        } else if (+this.$store.state.user.deposit === 2) {
        	this.$router.push('/deposit/return')
        }
      },
      stop () {
      	return false
      },
      jumpToLicense () {
      	let status = this.$store.state.user.license
        switch (+status) {
          case 0:
          	this.$store.dispatch('Alert/show', {
          		mold: 'toast',
              msg: '审核通过，无需再次提交'
            })
          	break
          case 1:
            this.$store.dispatch('Alert/show', {
              mold: 'toast',
              msg: '我们会尽快审核，请耐心等待'
            })
          	break
          default:
            this.$router.push({name: 'license'})
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .UserBar {
    width: 100%;
    height: 100%;
    position: relative;
    .mainBar {
      width: 85%;
      min-height: 100%;
      position: fixed;
      background-color: #fff;
    }
    .header {
      height: 1rem;
      position: relative;
      border-bottom: solid 1px #DFDFDF;
      .logo {
        width: 0.45rem;
        display: block;
        position: absolute;
        left: 0.23rem;
        top: 50%;
        margin-top: -0.23rem;
      }
      .name {
        line-height: 1rem;
        margin-left: 0.9rem;
        text-align: left;
      }
      .close {
        position: absolute;
        width: 0.15rem;
        height: 0.15rem;
        right: 0.16rem;
        top: 0.16rem;
        background: url('../../assets/images/icon_close_btn.png') no-repeat center;
        background-size: 100%;
      }
    }
    .menus {
      margin-left: 0.5rem;
      border-bottom: solid 1px #dfdfdf;
      font-size: 0.14rem;
      padding-bottom: 0.15rem;
      .menu {
        text-align: left;
        padding: 0.15rem 0;
        position: relative;
        line-height: 0.2rem;
        &::before {
          content: '';
          display: block;
          width: 0.3rem;
          height: 0.3rem;
          top: 0.1rem;
          left: -0.4rem;
          position: absolute;
          background: no-repeat center;
          background-size: 90%;
        }
        &.license::before {
          background-image: url('../../assets/images/icon_menu_license.png');
        }
        &.deposit::before {
          background-image: url('../../assets/images/icon_menu_deposit.png');
        }
      }
      .menu_name {
        width: 6em;
      }
      .desc {
        position: absolute;
        width:9em;
        text-align: right;
        right: 0;
        top: 0.15rem;
        color: #999;
        font-size: 0.12rem;
        .right_arrow {
          display: inline-block;
          width: 0.4rem;
          height: 0.2rem;
          float: right;
          background: url('../../assets/images/icon_right_arrow.png') no-repeat center;
          background-size: 20%;
        }
      }
    }
    .logout {
      margin-left: 0.5rem;
      text-align: left;
      padding-top: 0.3rem;
      position: relative;
      &::before {
        content: '';
        display: block;
        width: 0.3rem;
        height: 0.3rem;
        top: 0.25rem;
        left: -0.4rem;
        position: absolute;
        background: url('../../assets/images/icon_menu_logout.png') no-repeat center;
        background-size: 90%;
      }
    }
    .mask {
      width: 100%;
      height: 100%;
      position: fixed;
      top: 0;
      left: -100%;
      background-color: #323232;
      opacity: 0;
      z-index: -1;
      transition: opacity 300ms ease-in;
      &.show {
        left: 0;
        opacity: 0.5;
      }
    }
  }
</style>

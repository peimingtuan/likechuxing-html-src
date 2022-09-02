<template>
  <div class="UserIndex">
    <div class="header">
      <div class="logout" @click="logout">
        <i class="icon icon-logout">登出</i>
        <span class="icon-text">退出登录</span>
      </div>
    </div>
    <div class="content">

      <div class="userBox">
        <div class="profile-con" @click="test">
          <div :style="'backgroundImage:url('+profile_photo+')'" class="profile" @click="toFinish"></div>
        </div>
        <div class="username">{{username}}<span v-if="license_desc!==''" class="desc" :class="{warn:license_status!==0}">{{license_status===0?'已认证':'未认证'}}</span>
        </div>
        <div class="money">余额：{{money}} 元</div>
      </div>
      <ul class="grid-btn clearfix">
        <li v-for="btn in btns" class="fun-btn float-left" @click="()=>btnClick(btn.cb)">
          <div class="icon-con" :style="'backgroundImage:url('+btn.icon+')'"></div>
          <p>
            {{btn.text}}
            <span v-if="btn.append!==''"> ( <span class="warn" >{{btn.append}}</span> ) </span>
          </p>
        </li>
      </ul>
    </div>
    <div class="footer">
      <div class="invite" @click="toInvite" :style="'backgroundImage:url('+activity_img_url+')'"></div>
      <div class="footer_desc">更多功能请使用<span class="strong" @click="toDownload">立刻出行APP</span></div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import store from '../../store/store'
  import PAGE from '../../common/pageAddress'
  import ENV from '../../common/env'
  import {Confirm,Toast} from '../../../other_modules/vue-plugins/like-base'

  export default {
    computed: {
      btns: () => [
        {icon: require('../../assets/images/身份认证@3x.png'), text: '身份认证',append:'', cb: 'license'},
        {icon: require('../../assets/images/保证金@3x.png'), text: '保证金',append:'', cb: 'deposit'},
        {icon: require('../../assets/images/优惠券@3x.png'), text: '优惠券',append:store.state.user.coupon_num, cb: 'coupons'},
      ],
      ...mapState('user', [
        'profile_photo',
        'money',
        'username',
        'license_status',
        'license_desc',
        'activity_img_url',
        'activity_url'
      ])
    },
    methods: {
      test(){
        this.$router.push({
          path:'/rental/finish',
          query:{
            rental_no:'RE15323317121451'
          }
        })
      },
      toFinish(){
        this.$router.push({
          path:'/rental/accidentCall/'
        })
      },
      toDownload() {
        if (ENV.isIos) {
          window.open('https://itunes.apple.com/cn/app/id1245529926?mt=8')
        } else {
          window.open('http://a.app.qq.com/o/simple.jsp?pkgname=com.like.car')
        }
      },
      btnClick(type) {
        switch (type) {
          case 'license':
            this.toLicense()
            break;
          case 'deposit':
            this.toDeposit()
            break;
          case 'coupons':
            this.toCoupons()
        }
      },
      logout(){
        Confirm({
          msg:'确认退出？',
          confirmButtonCallback:()=>{
            this.$router.push({
              path:'/user/login'
            })
          }
        })
      },
      toLicense() {
        if (this.$store.state.user.license_status === 3) {
          this.$router.push({
            path:'license',
            append:true
          })
        } else {
          this.$router.push({
            path:'licenseInfo',
            append:true
          })
        }
      },
      toDeposit() {
        if ([1, 3].includes(this.$store.state.user.deposit_status)) {
          this.$router.push({
            path:'deposit',
            append:true
          })
        } else if (+this.$store.state.user.deposit_status === 2) {
          this.$router.push({
            path:'deposit/refund',
            append:true
          })
        } else{
          Toast('保证金将在1-3个工作日到账，请耐心等待')
        }
      },
      toCoupons() {
        SDK.openWindow(PAGE.coupons.href + this.$store.getters['user/userLoginInfo'])
      },
      toInvite() {
        window.location.href = this.activity_url + this.$store.getters['user/userLoginInfo']
      }
    },
    created: function () {
      this.$store.dispatch('user/getUserCenter')
    }
  }
</script>

<style lang="less" scoped>
  .UserIndex {
    background-color: #fff;
    .header {
      height: 1.15rem;
      background: #494B51 linear-gradient(-180deg, #494B51 0%, #313236 100%);
      .logout{
        font-size: 0.12rem;
        float: right;
        margin-top: 0.1rem;
        margin-right: 0.15rem;
        line-height: 0.2rem;
        color:#fff;
        .icon-logout{
          margin-top:-1px;
          background-image: url('../../assets/images/退出登录copy@3x.png');
          background-size: 60%;
        }
      }
    }
    .content {

      .userBox {
        position: relative;
        width: 3.45rem;
        height: 0.95rem;
        margin: -.4rem auto 0;
        background-color: #fff;
        box-shadow: 0 0 2px 2px rgba(0, 0, 0, 0.1);
        border: solid 1px transparent;
        .username, .desc {
          margin-top: 0.02rem;
          font-size: 0.16rem;
          line-height: 0.2rem;
        }
        .desc {
          margin-left: 0.5em;
          margin-right:-4.5em;
          width: 4em;
          line-height: 0.16rem;
          font-size: 0.12rem;
          display: inline-block;
          vertical-align: top;
          border: solid 1px #5FB500;
          color:#5FB500;
          background-color: rgba(126,211,33,0.05);
          border-radius: 3px;
          box-sizing: border-box;
          transform: scale(0.8);
          &.warn {
            color: #FF4E00;
            border-color: #FF4E00;
            background-color: rgba(237,56,0,0.05);
          }
        }
        .profile-con {
          border-radius: 50%;
          border: solid 5px rgba(242, 242, 242, 0.2);
          width: 0.65rem;
          height: 0.65rem;
          margin: -0.35rem auto 0;
          .profile {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: #fff no-repeat center;
            background-size: 100%;
          }
        }
        .money {
          font-size: 0.12rem;
          width: 100%;
          position: absolute;
          bottom:0.08rem;
        }
      }

      .grid-btn {
        width: 3.45rem;
        margin: 0.15rem auto;
        .fun-btn {
          width: 1.15rem;
          box-sizing: border-box;
          font-size: 0.12rem;
          .icon-con {
            width: 0.5rem;
            height: 0.5rem;
            margin: 0 auto;
            background: no-repeat center;
            background-size: 80%;
          }
          .warn{
            color:#ED3800;
          }
        }
      }
    }

    .footer {
      position: absolute;
      width: 100%;
      bottom: 0;
      .invite {
        width: 3.45rem;
        height: 1rem;
        margin: 0 auto;
        background: no-repeat center;
        background-size:cover;
      }
      .footer_desc{
        font-size: 0.12rem;
        color:#999;
        margin:0.1rem auto;
        .strong{
          color:#000;
        }
      }
    }
  }
</style>

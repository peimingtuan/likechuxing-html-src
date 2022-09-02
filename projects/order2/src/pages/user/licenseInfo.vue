<template>
  <div class="LicenseInfo">
    <div class="info-box">
      <img :src="info.icon" class="icon-img"/>
      <p>{{info.title}}</p>
      <p class="msg">{{info.msg}}</p>
    </div>
    <div class="footer">
      <p class="tel" @click="toTel">客服热线：400-666-2333</p>
      <button v-if="license_status === 2" class="btn btn-primary btn-block" @click="toLicense">重新认证</button>
      <button v-if="show_main" class="btn btn-primary btn-block" @click="toMain">去首页</button>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'

  const LICENSE_INFOS = [
    {
      icon: require('../../assets/images/认证通过@3x.png'),
      title: '认证已通过',
      msg: '证件图片已做隐私处理，不显示具体内容'
    },
    {
      icon: require('../../assets/images/审核中copy@3x.png'),
      title: '信息审核中',
      msg: '请耐心等待'
    },
    {
      icon: require('../../assets/images/未通过审核@3x.png'),
      title: '认证未通过审核',
      msg: ''
    }
  ]

  export default {
    data(){
      return{
        show_main:false
      }
    },
    computed: {
      ...mapState('user', [
        'license_status',
        'license_reason'
      ]),
      info(){
        let info = null

        if([0,1,2].includes(this.license_status)){
          info =  LICENSE_INFOS[this.license_status]
        }else{
          info = LICENSE_INFOS[2]
        }

        if(this.license_reason)info.msg = this.license_reason
        return info
      }

    },
    methods: {
      toLicense() {
        this.$router.replace('/user/license')
      },
      toMain(){
        this.$router.replace('/index')
      },
      toTel(){
        SDK.makePhoneCall('4006662333')
      }
    },
    created() {
      // 从认证过程来的，显示去首页按钮
      this.show_main = this.$route.query.from === 'license'
      // 刷userInformation接口，只为拿不通过原因
      this.$store.dispatch('user/getUserInformation',0)
    },
    beforeRouteLeave(to,from,next){
      let allow = [
        '/user/license',
        '/index'
      ]
      if(from.query.from === 'license' && !allow.includes(to.path)){
        // 从登录页来的，且返回目标不是首页的话，去首页
        next({
          path:'/index'
        })
      }else{
        next()
      }
    }
  }
</script>

<style lang="less" scoped>
  .LicenseInfo {
    background-color: #fff;
    .info-box{
      padding:0.6rem 0 0.8rem;
      font-size: 0.18rem;
      color:#111;
      .icon-img{
        display: block;
        margin:0 auto 0.15rem;
        width: 0.6rem;
        height: 0.6rem;
      }
      .msg{
        font-size: 0.14rem;
        color:#999;
      }
    }
    .footer {
      .tel{
        font-size: 12px;
        color:#999;
        line-height: 0.3rem;
      }
      .btn{
        height: 0.46rem;
        font-size: 0.16rem;
      }
      position: absolute;
      width: 3.45rem;
      left: 0.15rem;
      bottom: 0.15rem;
    }
  }
</style>

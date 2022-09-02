<template>
    <div class="Login">
      <div class="input_con">
        <div class="row">
          <div class="input_icon icon_phone"></div>
          <input class="input" type="text" maxlength="11" v-model="phone" placeholder="手机号"/>
        </div>
        <div class="row">
          <div class="input_icon icon_code"></div>
          <input class="input" type="text" maxlength="4" @input="checkCode" v-model="code" placeholder="验证码"/>
          <div class="code" v-if="step===3">{{count}}s</div>
          <div class="code" v-else @click="getCode">{{steps[step]}}</div>
        </div>
        <div class="agree_con">
          <div class="agree_icon"></div>
          我已同意
          <span class="strong" @click="toRegisterAgreement">《立刻出行服务条款》</span>
        </div>
      </div>
    </div>
</template>

<script>
  import myREG from '../../assets/js/reg.js'
  import myAjax from '../../common/myAjax'
  import API from '../../common/apiAddress'
  import {mapState} from 'vuex'
  import PAGE from '../../common/pageAddress'
  import {Loading,Toast} from '../../../other_modules/vue-plugins/like-base'

  export default {
    name: 'login',
    data() {
      return {
        phone: '',
        code: '',
        count: 60,
        steps: ['获取验证码', '发送中...', '发送成功', 'count'],
        step: 0,
        isNotGetCode: true,
        count_flag: null
      }
    },
    computed: {
      isPhoneLegal: function () {
        return myREG.phone.test(this.phone)
      },
      isCodeLegal: function () {
        let code = myREG.verCode.test(this.code)
        // 同时检测手机号
        return this.isPhoneLegal && code
      },
      ...mapState('user',[
        'deposit_status',
        'license_status'
      ])
    },
    methods: {
      init(){
        this.phone = ''
        this.code = ''
        this.count = 60
        this.step = 0
        this.isNotGetCode = true
        clearTimeout(this.count_flag)
        this.count_flag = null
      },
      countDown: function () {
        if (this.count === 60) {
          this.step = 3
        }

        if (this.count > 1) {
          this.count--
          this.count_flag = setTimeout(this.countDown, 1000)
        } else {
          this.step = 0
          this.count = 60
        }
      },
      getCode: function () {
        if (this.step !== 0) {
          return
        }

        if (!this.isPhoneLegal) {
          Toast('请输入正确手机号')
          return
        }

        this.step = 1

        myAjax.postV2(API.login.getCode, {
          phone: this.phone
        }).then(res => {
          if(res.status === 0){
            this.isNotGetCode = false
            this.step = 2
            this.count_flag = setTimeout(this.countDown, 1000)
          }else{
            this.step = 0
          }
        })
      },
      checkCode: function (e) {
        if (this.isCodeLegal) {
          // 失去焦点，隐藏手机键盘
          e.target.blur()
          this.login()
        }
      },
      login: function () {
        // 是否请求过发送验证码
        if (this.isNotGetCode) {
          Toast('请先获取获取验证码')
          return
        }

        // 登录
        let loading = Loading('登录中...')

        myAjax.postV2(API.login.verifyCode, {
          phone: this.phone,
          code: this.code
        }, {errAgent: false}).then(res => {
          loading.close()
          if(res.status === 1){
            // 登录异常
            Toast(res.msg)
          }else{
            let data = res.data
            // 记下用户账号
            data.phone = this.phone
            // 存储登录信息
            this.$store.dispatch('user/login', data)

            this.$store.dispatch('user/getUserCenter').then(res=>{
              if(this.deposit_status === 1){
                // 未支付
                this.$router.replace({
                  path:'/user/deposit',
                  query:{
                    from:'login'
                  }
                })
              }else{
                // 已支付
                if(this.license_status === 2){
                  // 未通过
                  this.$router.replace({
                    path:'/user/licenseInfo',
                    query:{
                      from:'login'
                    }
                  })
                }else if(this.license_status === 3){
                  // 未提交
                  this.$router.replace({
                    path:'/user/license',
                    query:{
                      from:'login'
                    }
                  })
                }else{
                  // 通过
                  this.init()

                  if (this.$route.query.next) {
                    // 从首页进个人中心-登录-个人中心
                    switch (this.$route.query.next){
                      case 'userCenter':
                        this.$router.replace({path:'/user'})
                    }
                  } else {
                    this.$router.replace('/index')
                  }
                }
              }
            })
          }
        })
      },
      toRegisterAgreement: function () {
        SDK.openWindow(PAGE.describeRegisterAgreement.href)
      }
    },
    mounted() {
      this.$store.commit('rental/clear')
      this.$store.dispatch('user/logout')
    },
    beforeDestroy() {
      clearTimeout(this.count_flag)
    }
  }
</script>

<style lang="less" scoped>
  .Login {
    background: #150c09 url('../../assets/images/login/登录Bg@3x.png') no-repeat center top;
    background-size: 100% auto;
    height: 100vh;

    .input_con {
      margin: 0 0.5rem;
      padding: 1.1rem 0;
      .row {
        position: relative;
        margin-left: 0.3rem;
        font-size: 0.15rem;
        border-bottom: solid 1px #fff;
        opacity: 0.6;
        line-height: 0.2rem;
        padding: 0.15rem 0;
        &:hover {
          opacity: 1;
        }
        .input_icon {
          width: 0.2rem;
          height: 0.2rem;
          left: -0.25rem;
          top: 50%;
          margin-top: -0.1rem;
          position: absolute;
          background: no-repeat center;
          background-size: auto 90%;
          &.icon_phone {
            background-image: url('../../assets/images/login/手机号@3x.png');
          }
          &.icon_code {
            background-image: url('../../assets/images/login/验证码@3x.png');
          }
        }
      }
      .input {
        outline: none;
        font-size: 0.15rem;
        background-color: transparent;
        border: none;
        height: 0.2rem;
        color: #fff;
        width: 100%;
        box-sizing: border-box;
        padding-left: 0.05rem;
        &::-webkit-input-placeholder {
          color: #ccc;
        }
      }
      .code {
        color: #fff;
        font-size: 0.13rem;
        width: 7em;
        text-align: center;
        line-height: 0.18rem;
        position: absolute;
        border-left: solid 1px #DBDBDB;
        right: 0;
        top: 50%;
        margin-top: -0.09rem;
      }
      .agree_con {
        position: relative;
        text-align: left;
        font-size: 0.12rem;
        color: #888;
        padding: 0.26rem 0.3rem;
        .agree_icon {
          width: 2em;
          height: 2em;
          position: absolute;
          left: 0;
          top: 50%;
          margin-top: -1em;
          background: url('../../assets/images/login/选中_light.png') no-repeat center;
          background-size: 70% auto;
        }
        .strong {
          color: #fff;
        }
      }
    }
  }
</style>

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
        <input id="fakeInput" type="hidden"/>
        <div class="code">
          <a v-if="step==0" @click="getCode">{{countDesc}}</a>
          <span v-else class="count">{{countDesc}}</span>
        </div>
      </div>
      <div class="agree_con">
        <div :class="['agree_icon', {'disable' : !agree}]" @click="toggleAgree"></div>
        我已同意<span @click="jumpRegisAgreement">《立刻出行服务条款》</span>
      </div>
    </div>
  </div>
</template>

<script>
  import myREG from '../../assets/js/reg.js'
  import myaxios from '../../common/myaxios'
  import API from '../../common/apiAddress'

  export default {
    data () {
      return {
        phone: '',
        code: '',
        count: 60,
        steps: ['获取验证码', '发送中...', '发送成功', 'count'],
        step: 0,
        agree: true,
        isNotGetCode: true
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
      countDesc: function () {
        if (this.step < 3) {
          return this.steps[this.step]
        } else {
          return this.count + 's'
        }
      }
    },
    methods: {
      countDown: function () {
        if (this.count === 60) {
          this.step = 3
        }

        if (this.count > 1) {
          this.count--
          setTimeout(this.countDown, 1000)
        } else {
          this.step = 0
          this.count = 60
        }
      },
      getCode: function () {
        if (!this.isPhoneLegal) {
          this.$store.dispatch('Alert/show', {
            mold: 'toast',
            msg: '请输入正确手机号'
          })
          return
        }

        this.isNotGetCode = false
        this.step = 1
        myaxios.post(API.login.getCode, {
          phone: this.phone
        }).then(function (res) {
          if (res.data.status === 0) {
          	this.$store.dispatch('Alert/show', {
          		mold: 'toast',
              msg: res.data.msg
            })
            this.step = 2
            setTimeout(this.countDown, 1000)
          } else {
            this.step = 0
          }
        }.bind(this)).catch(function () {
          this.step = 0
        }.bind(this))
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
          this.$store.dispatch('Alert/show', {
            mold: 'toast',
            msg: '请先获取获取验证码'
          })
          return
        }
        // 是否同意服务条款
        if (!this.agree) {
          this.$store.dispatch('Alert/show', {
            mold: 'toast',
            msg: '请同意《立刻出行服务条款》'
          })
          return
        }

        // 登录
        this.$store.commit('Loading/show', {
          text: '登录中...',
          preventEvent: true
        })
        myaxios.post(API.login.verifyCode, {
          phone: this.phone,
          code: this.code
        }).then(function (res) {
          this.$store.commit('Loading/hide')
          if (+res.data.status === 0 || +res.data.status === 1002) {
          	// 登录成功
            let data = res.data.data
            data.phone = this.phone
            // 存储登录信息
            this.$store.dispatch('user/login', data)
            // 请求个人中心接口获取license和deposit状态
            this.$store.dispatch('user/getMoreUserInfo')
          } else {
            this.$store.dispatch('Alert/show', {
              mold: 'toast',
              msg: res.data.msg
            })
          }
        }.bind(this))
      },
      toggleAgree: function () {
        this.agree = !this.agree
      },
      jumpRegisAgreement: function () {
        this.$router.push({name: 'static', query: {page: 'describeRegisAgreement'}})
      }
    },
    created () {
      this.$store.dispatch('user/logout')
    }
  }
</script>

<style lang="less" scoped>
  .Login {
    background-color: #FFF;
    height: 100vh;

    .input_con {
      margin: 0 0.4rem;
      padding: 0.8rem 0;
      .row {
        position: relative;
        .input_icon {
          width: 2em;
          height: 2em;
          left: 0;
          top: 50%;
          margin-top: -1em;
          position: absolute;
          background: no-repeat center;
          background-size: 70% auto;
          &.icon_phone {
            background-image: url('../../assets/images/icon_phone.png');
          }
          &.icon_code {
            background-image: url('../../assets/images/icon_key.png');
          }
        }
      }
      .input {
        font-size: 0.15rem;
        border: none;
        border-bottom: solid 1px #E3E3E3;
        width: 100%;
        box-sizing: border-box;
        padding: 1em 1em 1em 0.3rem;
        &::-webkit-input-placeholder {
          color: #ccc;
        }
      }
      .code {
        font-size: 0.13rem;
        width: 7em;
        text-align: center;
        line-height: 0.3rem;
        position: absolute;
        border-left: solid 1px #DBDBDB;
        right: 0;
        bottom: 0.1rem;
        a {
          color: #111;
        }
      }
      .count {
        color: #999
      }
      .agree_con {
        position: relative;
        text-align: left;
        font-size: 0.12rem;
        color: #999;
        padding: 0.26rem 0.3rem;
        .agree_icon {
          width: 2em;
          height: 2em;
          position: absolute;
          left: 0;
          top: 50%;
          margin-top: -1em;
          background: url('../../assets/images/icon_chosen.png') no-repeat center;
          background-size: 70% auto;
          &.disable {
            background-image: url('../../assets/images/icon_unchosen.png');
          }
        }
        span {
          color: #111
        }
      }
    }
  }
</style>

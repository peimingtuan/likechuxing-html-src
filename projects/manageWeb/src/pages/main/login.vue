<template>
  <div class="Login">
    <div>
      <img class="app_icon" src="../../assets/images/app_icon.png"/>
      <p class="title" >新管理APP<span class="note">（ web版 ）</span></p>
    </div>
    <div class="input_con">
      <input class="input" v-model="phone" placeholder="输入您的手机号码"/>
      <input class="input" v-model="code" placeholder="输入验证码"/>
      <div class="code">
        <a v-if="step==0" @click="getCode">{{countDesc}}</a>
        <span v-else class="count">{{countDesc}}</span>
      </div>
      <button class="blue_btn login_btn" :class="{disabled:!isBtnEnable}" @click="login">开始使用</button>
    </div>
  </div>
</template>

<script>
  import myREG from '../../assets/js/reg.js'
  export default {
    data () {
      return {
        phone: '',
        code: '',
        count: 10,
        steps: ['获取验证码', '发送中...', '发送成功', 'count'],
        step: 0
      }
    },
    computed: {
      isPhoneLegal: function () {
        return myREG.phone.test(this.phone)
      },
      isBtnEnable: function () {
        let code = myREG.verCode.test(this.code)
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
        if (this.count === 10) {
          this.step = 3
        }

        if (this.count > 1) {
          this.count--
          setTimeout(this.countDown, 1000)
        } else {
          this.step = 0
          this.count = 10
        }
      },
      getCode: function () {
        if (!this.isPhoneLegal) {
          this.$store.dispatch('YdAlert/show', {
            mold: 'toast',
            msg: '请输入中国大陆手机号'
          })
          return
        }
        this.step = 1
        // todo 加上正式接口代码
        let promise = new Promise(function (resolve, reject) {
          setTimeout(function () {
            let data = {
              status: 0,
              msg: '',
              data: {}
            }
            resolve(data)
          }, 1000)
        })

        promise.then(function (data) {
          if (data.status === 0) {
            this.step = 2
            setTimeout(this.countDown, 1000)
          } else {
            this.step = 0
          }
        }.bind(this), function (data) {

        })
      },
      login: function () {
        if (!this.isBtnEnable) {
          return
        }
        this.$store.commit('YdLoading/show', {
          text: '登录中...',
          preventEvent: true
        })

        // todo 加上正式接口代码
        let promise = new Promise(function (resolve, reject) {
          setTimeout(function () {
            let data = {
              status: 0,
              msg: '',
              data: {
                uid: 10,
                key: '12342343242342'
              }
            }
            resolve(data)
          }, 1000)
        })
        promise.then(function (data) {
          this.$store.commit('YdLoading/hide')

          if (data.status === 0) {
            this.$store.commit('user/login', data.data)
          } else {

          }
        }.bind(this), function (data) {

        })
      }
    },
    created: function () {
    	console.log(1)
    }
  }
</script>

<style lang="less">
  .Login {
    background-color: #F7F7F8;
    height: 100vh;

    .app_icon {
      width: 0.5rem;
      height: 0.5rem;
      margin: 0.4rem 0 0.1rem;
    }
    .title {
      font-size: 26px;
      .note {
        font-size: 12px
      }
    }
    .input_con {
      position: relative;
      margin: 0.4rem auto;
      width: 80%;
      max-width: 320px;
      .input {
        font-size: 13px;
        border: solid 1px #DBDBDB;
        width: 100%;
        box-sizing: border-box;
        padding: 1em;
        &:nth-of-type(1) {
          border-bottom: none;
        }
      }
      .code {
        font-size: 13px;
        width: 7em;
        text-align: center;
        position: absolute;
        border-left: solid 1px #DBDBDB;
        right: 0;
        top: 4.3em;
      }
      .count {
        color: #999
      }

      .login_btn {
        margin: 0.2rem 0;
        font-size: 16px;
        width: 100%;
        height: 0.4rem;
      }
    }

  }
</style>

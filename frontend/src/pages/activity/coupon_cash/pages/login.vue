<template>
    <div class="login">
        <HeaderMain/>
        <div class="getCoupon">
            <div class="inputWrap">
                <input type="number" placeholder="输入手机号最高领20元优惠券" v-model="phone"  @blur.prevent="changeCount()"/>
                <img src="../images/icon_reset.png" alt="" @click="resetPhone()" v-show="iconReset">
            </div>
            <div class="inputCode" v-show="showInputCode">
                <input type="number" placeholder="输入验证码" v-model="code" @blur.prevent="changeCount()" />
            </div>
            <button @click="verifyCode()">点击领红包</button>
        </div>
    </div>
</template>

<script>
  import HeaderMain from '../components/HeaderMain'
  import myAjax from "../../../../../other_modules/like-request/withAxiosV2";
  import {getApiUrl} from "../js/getApiUrl"
  import {umeng} from "../js/umeng";

  export default {
    name: "login",
    components: {
      HeaderMain
    },
    data () {
      return {
        phone: "", // 手机号
        showInputCode: false,  // 是否显示验证码输入框
        code: "", // 验证码
        shareKey: "",
        openid: ""
      }
    },
    created () {
      this.shareKey = this.$store.state.shareKey
      this.openid = this.$store.state.open_id
    },
    mounted () {
      umeng.addEvent(['login', 'view'])
    },
    methods: {
      // 清空电话号码
      resetPhone () {
        this.phone = this.code = ""
        this.showInputCode = false;
      },
      // 点击领取红包按钮逻辑
      verifyCode () {
        if (!this.showInputCode) {
          this.getCode();
        } else {
          this.getCoupon()
        }
      },
      // 获取验证码
      getCode () {
        let phoneReg = /^1[3456789]\d{9}$/
        if (this.phone == '') {
          this.$_LIKE_toast('手机号不能为空')
          return
        }
        if (!phoneReg.test(this.phone)) {
          this.$_LIKE_toast('请输入正确的手机号')
          return
        }
        myAjax.post(getApiUrl('share-coupon/get-code'), {phone: this.phone}).then(res => {
          // console.log(res);
          if (res.status == 0 || res.msg === "验证码已发送,请注意查收") {
            this.$_LIKE_toast(res.msg)
            this.showInputCode = true;
          } else {
            this.$_LIKE_toast(res.msg)
          }
        })
      },
      // 领取红包
      getCoupon () {
        let {phone, shareKey, code, openid} = this;
        let phoneReg = /^1[3456789]\d{9}$/
        if (phone == '') {
          this.$_LIKE_toast('手机号不能为空')
          return
        }
        if (!phoneReg.test(phone)) {
          this.$_LIKE_toast('请输入正确的手机号')
          return
        }
        if (code == '') {
          this.$_LIKE_toast('验证码不能为空')
          return
        }
        if (code.length != 4) {
          this.$_LIKE_toast('请输入正确的验证码')
          return
        }
        let data = {
          phone,
          code,
          openid,
          shareKey,
          channel: "0_9107"
        }
        myAjax.post(getApiUrl('/share-coupon/verify-code'), data).then(res => {
          if (res.status === 1) {
            this.$_LIKE_toast(res.msg)
          } else {
            umeng.addEvent(['login', 'loginSuccess'])
            this.$store.dispatch('handleGetCoupon', res)
          }

        }).catch(err => {
          console.log('http', err)
        })
      },
      changeCount(){
        setTimeout(function(){
          document.body.scrollTop = 0
          document.documentElement.scrollTop = 0
        },100)
      }
    },
    computed: {
      // 重置图标的显示隐藏
      iconReset () {
        if (this.phone) {
          return true
        } else {
          this.showInputCode = false;
          this.code = "";
          return false;
        }
      }

    }
  }
</script>

<style lang=less scoped>
    .login {
      background: #fc241c;
      min-height: 100vh;
        .getCoupon {
            padding: .31rem .35rem 0;
            text-align: center;
            input {
                width: 100%;
                box-sizing: border-box;
                outline: none;
                font-size: 17px;
                border-radius: 2px;
                padding: .13rem .38rem .13rem .2rem;
                line-height: 1;
                background: #FFF;
                border: none;

                &::-webkit-input-placeholder {
                    font-size: 16px;
                    color: #A4A5A7;
                    padding-top: 2px !important;
                }
            }

            .inputWrap {
                position: relative;
                img {
                    position: absolute;
                    transform: scale(0.5);
                    top: .02rem;
                    right: .04rem;
                }
            }

            .inputCode {
                margin-top: .15rem;
            }

            button {
                height: .45rem;
                background: #FDDF4C;
                color: #000E2E;
                width: 100%;
                border-radius: .02rem;
                border: none;
                margin-top: .15rem;
                font-size: 18px;
                outline: none;
            }
        }
    }
</style>
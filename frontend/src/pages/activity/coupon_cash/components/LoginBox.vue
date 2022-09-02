<template>
    <div class="loginBox">
        <div class="box input-parent">
            <input class="input" type="number" v-model.trim="phone" placeholder="输入您的手机号"/>
            <div class="clear" v-if="phone!==''" @click="clearPhone"></div>
        </div>

        <div class="box input-parent" v-if="step === 2">
            <input class="input" type="number" v-model.trim="code" placeholder="请输入验证码"/>
        </div>

        <div class="box">
            <LikeButton
                    v-if="!is_loading"
                    class="btn"
                    type="couponBtn"
                    :text="data.btn_text || '确定'"
                    :disabled="!btn_enabled"
                    @click="handleBtnClick"
            />
            <div v-else class="btn loading"></div>
        </div>
    </div>
</template>

<script>
  import LikeButton from './Button'
  import Regular from '../../../../../other_modules/like-function/Regular'
  import myAjax from "../../../../../other_modules/like-request/withAxiosV2";
  import {getApiUrl} from "../js/getApiUrl"

  export default {
    name: "loginBox",
    components: {
      LikeButton
    },
    props: ['data'],
    data () {
      return {
        phone: '',
        code: '',
        step: 1,//1=输入手机号，2=输入验证码
        is_getting_code: false,
        is_verify_code: false
      }
    },
    computed: {
      btn_enabled () {
        if (this.step === 2) {
          return Regular.phone.test(this.phone) && Regular.verCode.test(this.code)
        } else {
          return Regular.phone.test(this.phone)
        }
      },
      is_loading () {
        return this.is_getting_code || this.is_verify_code
      }
    },
    methods: {
      clearPhone () {
        this.phone = ''
        this.code = ''
        this.step = 1
      },
      handleBtnClick () {
        if (this.step === 1) {
          this.getCode()
        } else {
          this.verifyCode()
        }
      },
      getCode () {
        if (typeof this.data.beforeGetCode === 'function') {
          // 验证不通过，中断获取验证码
          if (!this.data.beforeGetCode(this.phone)) return
        }

        // 防止连击
        if (this.is_getting_code) return

        this.is_getting_code = true
        myAjax.post(getApiUrl('share-coupon/get-code'), {phone: this.phone}).then(res => {
          if (res.status === 0 || res.msg === "验证码已发送,请注意查收") this.step = 2
          this.$_LIKE_toast(res.msg)
          this.is_getting_code = false
        }).catch(err => {
          console.warn(err)
          this.is_getting_code = false
        })
      },
      verifyCode () {
        this.is_verify_code = true
        this.data.verifyCode({
          phone: this.phone,
          code: this.code
        }, this._hideLoading)
      },
      _hideLoading () {
        this.is_verify_code = false
      }
    }
  }
</script>

<style lang=less scoped>
    .loginBox {
        .box {
            width: 100%;
            height: 0.45rem;
            margin: 0.15rem 0;
            position: relative;
            border-radius: 2px;
            overflow: hidden;

            &.input-parent{
                border: 1px solid rgba(192, 193, 194, 1);
            }

            .input,.btn {
                width: 100%;
                box-sizing: border-box;
                outline: none;
                font-size: 18px;
                border-radius: 2px;
            }

            .input {
                padding: 0 0.15rem;
                margin:0.14rem 0;
                height: 0.19rem;
                line-height: 1;
                background: #FFF;
                border:none;

                &::-webkit-input-placeholder{
                    font-size: 17px;
                    color: #A4A5A7;
                }
            }

            .btn{
                height: 100%;
            }

            .loading {
                width: 100%;
                height: 0.45rem;
                background: rgba(204, 204, 204, 1);
                border-radius: 2px;
                &::before {
                    content: '';
                    margin: 0 auto;
                    width: 0.26rem;
                    height: 100%;
                    display: block;
                    background: url('../images/loading.png') no-repeat center;
                    background-size: 100%;
                    animation: circle infinite .75s linear;
                }
            }

            .clear {
                position: absolute;
                width: 0.4rem;
                height: 0.4rem;
                right: 0;
                top: 0.02rem;
                background: url('../images/icon_reset.png') no-repeat center;
                background-size: 50%;
            }
        }
    }

    @keyframes circle {
        from {
            transform: rotate(0);
        }

        to {
            transform: rotate(360deg);
        }
    }
</style>
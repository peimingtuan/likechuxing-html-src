<template>
    <div class="share">
            <div class="title">
                <p>新用户再送</p>
                <p>50元出行大礼</p>
            </div>

            <div class="from">
                <p>您的好友 {{invite_mobile_h}} 送您 30元 红包</p>
                <p>输入手机号即可领取</p>
                <p class="code" v-if="invite_code">TA的立刻专属优惠码：{{invite_code}}</p>
                <p>在“个人中心” - “优惠”兑换即可领取红包</p>
            </div>

            <div class="login-box" :style="'margin-top:'+offset+'px'">
                <div class="item">
                    <input class="input" type="number" @blur.prevent="changeCount()" v-model="mobile" placeholder="请输入手机号" />
                    <img class="resetIcon" src="../images/icon_reset.png" alt="" @click="resetInfo()" v-show="iconReset">
                </div>
                <div class="item">
                    <input class="input" type="number" @blur.prevent="changeCount()" v-model="code" placeholder="请输入验证码" v-show="showCode" />
                    <!-- <button class="btn code float-right" :class="{disabled:!couldGetCode}" @click="getCode">{{code_btn}} -->
                    <!-- </button> -->
                </div>
                <div class="item last">
                    <button class="btn" :class="{disabled:!couldGetCoupon}" @click="verifyCode()">领取红包</button>
                </div>
            </div>
    </div>
</template>

<script>
  import appArguments from '../../../../../other_modules/app-arguments'
  import {maskMobile} from '../../../../../other_modules/like-function/desensitized'
  import Regular from '../../../../../other_modules/like-function/Regular'
  import myAjax from '../../../../../other_modules/like-request/withAxiosV3'
  import {getActivityApiUrl} from "../../../../../other_modules/url-constructor";

  export default {
    name: "share",
    data () {
      return {
        invite_mobile: '',
        invite_mobile_h: '',
        invite_code: '',

        mobile: '',
        code: '',

        count: 61,

        showCode:false,
        oldMobile:'',

        offset:window.innerHeight-window.innerWidth-100
      }
    },
    computed: {
      // code_btn () {
      //   if(this.count > 60){
      //     return '获取验证码'
      //   }else if(this.count === 60){
      //     return '发送成功'
      //   }else{
      //     return this.count+'s'
      //   }
      // },
      // couldGetCode () {
      //   return this.count > 60 && Regular.phone.test(this.mobile)
      // },
      couldGetCoupon () {
        return Regular.phone.test(this.mobile)
      },
      iconReset () {
        if (this.mobile) {
          return true
        } else {
          this.showCode = false;
          this.code = "";
          return false;
        }
      }
    },
    methods: {
      verifyCode(){
        if (!this.showCode) {
          this.getCode();
        } else {
          this.getCoupon()
        }
      },
      getCoupon(){
        if(!this.code){
          this.$_LIKE_toast('验证码不能为空');
          return;
        } 
        if(this.code.length != 4){
          this.$_LIKE_toast('验证码错误');
          return;
        }
        let loading = this.$_LIKE_loading()

        let data={
          phone:this.mobile,
          code:this.code,
          share_code:this.invite_code
        }
        if(/\d_\d{4,5}/.test(appArguments.channel))data.channel=appArguments.channel

        myAjax.post(getActivityApiUrl('/web/verify-code'), data).then(res=>{
          loading.close()
          if(res.status === 0){
            this.mobile = ''
            this.code = ''
            this.count = 1

            window.resData = res.data
            this.$router.push({
              path:'/couponList'
            })

          }else{
            this.$_LIKE_toast(res.msg)
          }
        })
      },
      countDown(){
        this.count--;
        if(this.count > 0) {
          setTimeout(this.countDown,1000)
        }else{
          this.count = 61
        }

      },
      getCode () {
        if (this.mobile !="" && this.oldMobile == this.mobile){
          this.$_LIKE_toast(`请在${this.count}秒后重试`)
          return
        }

        // 手机号有误
        if(!this.mobile){
          this.$_LIKE_toast("手机号不能为空")
          return;
        } 
        if(!this.couldGetCoupon){
          this.$_LIKE_toast("请输入正确的手机号")
          return;
        } 

        // 邀请自己
        if (this.mobile === this.invite_mobile) {
          this.$_LIKE_toast('邀请自己拿不到奖励哦~')
          return
        }

        myAjax.post(getActivityApiUrl('/login/get-code'),{
          phone:this.mobile
        }).then(res=>{
            if(res.status === 0 || res.status === 3016){
              this.oldMobile = this.mobile;
              this.countDown()
              this.showCode = true;
              this.$_LIKE_toast(res.msg)
            }else{
              this.$_LIKE_toast(res.msg)
            }
        })
      },
      resetInfo () {
        this.mobile = this.code = ""
        this.showCode = false;
      },
      changeCount(){
        setTimeout(function(){
          document.body.scrollTop = 0
          document.documentElement.scrollTop = 0
        },100)
      }
    },
    created () {
      this.invite_mobile = appArguments.mobile
      this.invite_mobile_h = maskMobile(appArguments.mobile)
      this.invite_code = appArguments.favourCode
    }
  }
</script>

<style lang=less scoped>
    .share {
        min-height: 100vh;
        background: #000 url('../images/banner_2.png') no-repeat top;
        background-size: 100% auto;
        color: #fff;
        position: relative;

        .title, .from, .login-box {
            padding: 0 0.3rem;
        }

        .title {
            font-size: 36px;
            padding-top: 1rem;
            line-height: 1.2;
        }

        .from {
            font-size: 14px;
            padding-top: 0.3rem;
            font-weight: 300;
            p{
              margin-top: .03rem;
            }
            .code {
              padding-top: 0.15rem;
            }
        }

        .login-box {
            width: 100%;
            box-sizing: border-box;
            .item {
                margin-top: 0.1rem;
                position: relative;
                &.last {
                    margin-top: 0.2rem;
                }
                .resetIcon{
                  position: absolute;
                  transform: scale(0.35);
                  top:0;
                  right: 0;
                }
            }
            .input {
                width: 100%;
                padding: 0 .4rem 0 .15rem;
                box-sizing: border-box;
                height: 0.4rem;
                border: none;
                background-color: #fff;
                border-radius: 2px;
                outline: none;
                &.code {
                    width: 2.1rem;
                }
            }

            .btn {
                font-size: 14px;
                border: none;
                outline: none;
                height: 0.4rem;
                margin: 0;
                padding: 0;
                color: #fff;
                width: 100%;
                border-radius: 2px;
                font-weight: 300;
                background: #494B51;
                position: relative;
                &.code {
                    width: 0.95rem;
                }
                &.disabled {
                    background: #DBDBDB;
                }

                // 覆盖一层遮罩，平时隐藏
                &::after {
                    content: " ";
                    opacity: 0;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    left: 0;
                    position: absolute;
                    transition: opacity 100ms;
                }
                // 激活时显示黑色
                &:not(.disabled):active::after {
                    background-color: #000;
                    opacity: 0.4;
                }
            }
        }
    }
</style>
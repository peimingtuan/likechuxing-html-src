<template>
    <div class="edit">
        <div v-if="step===1">
            <div class="text">
                <span>当前绑定手机号：</span>
                <span class="danger">{{phone}}</span>
            </div>
            <div class="change">

                <LoginBox :data="loginBoxData"/>

                <p class="desc"> • 修改后，下次领取的红包将自动放入新手机号</p>

            </div>
        </div>
        <div v-else>
            <div class="success"></div>
            <div class="box">
                <div class="text">
                    <span>手机号成功修改为：</span>
                    <span class="danger">{{phone}}</span>
                    <p class="desc"> • 下次领取的红包将自动放入该手机号</p>
                </div>
            </div>
            <LikeButton
                    class="btn2"
                    type="couponBtn"
                    text="返回"
                    @click="back"
            />
        </div>
    </div>
</template>

<script>
  import LikeButton from '../components/Button'
  import Regular from '../../../../../other_modules/like-function/Regular'
  import {mapState} from 'vuex'
  import myAjax from "../../../../../other_modules/like-request/withAxiosV2";
  import {getApiUrl} from "../js/getApiUrl";
  import LoginBox from '../components/LoginBox'

  export default {
    name: "edit",
    components: {
      LikeButton,
      LoginBox
    },
    data () {
      return {
        loginBoxData: {
          btn_text: '确定',
          beforeGetCode: this.beforeGetCode,
          verifyCode: this.toChange
        },

        new_phone: '',
        changing: false,
        step: 1,

        show_code: false,
        code: ''
      }
    },
    computed: {
      ...mapState(['phone', 'shareKey', 'open_id']),
      btn_enabled () {
        if (this.show_code) {
          return Regular.phone.test(this.new_phone) && Regular.verCode.test(this.code)
        } else {
          return Regular.phone.test(this.new_phone)
        }
      }
    },
    methods: {
      beforeGetCode (phone) {
        if (phone === String(this.phone)) {
          this.$_LIKE_toast('新旧手机号相同，无需修改')
          return false
        } else {
          return true
        }
      },

      toChange (data, cb) {
        myAjax.post(getApiUrl('share-coupon/change-phone'), {
          shareKey: this.shareKey,
          openid: this.open_id,
          phone: data.phone,
          code: data.code,
          channel:"0_9107"
        }).then(res => {
          cb()
          if (res.status === 0) {

            // 将新手机号记录下来
            this.$store.commit('setPhone', data.phone)
            // 修改 uuid
            // this.$store.commit('setUser', res.data.uuid)

            this.$store.commit('setInviteCode', res.data.share_code)

            this.step = 2

          } else {
            throw res
          }
        }).catch(err => {
          console.warn(err)
          if (err && err.msg) {
            this.$_LIKE_toast(err.msg)
          }
        })
      },
      back () {
        this.$router.back()
      }
    }
  }
</script>

<style lang=less scoped>
    .edit {
        width: 100vw;
        min-height: 100vh;
        padding: 0.25rem 0.35rem;
        box-sizing: border-box;
        .text {
            margin: 0.2rem 0;
            font-size: 17px;
            text-align: center;
        }

        .btn2 {
            width: 100%;
            margin: 0.4rem 0;
            font-size: 17px;
        }
        .desc {
            margin: 0.1rem 0;
            font-size: 13px;
            color: rgba(151, 151, 155, 1);
            text-align: left;
            &::before {
                content: '';
                display: inline-block;

            }
        }

        .success {
            width: 0.5rem;
            height: 0.5rem;
            margin: 0.2rem auto 0.15rem;
            background: url('../images/change_success.png') no-repeat center;
            background-size: 100%;
        }
        .box {
            text-align: center;
            .text {
                display: inline-block;
                margin: 0;
            }
        }

    }


</style>
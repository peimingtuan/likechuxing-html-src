<template>
    <div class="InviteFriend">
        <div v-if="show">
            <div class="mask"></div>

            <div class="big-box">
                <div class="img big" @click="couponClick"></div>
                <div class="close" @click="closeBig"></div>
            </div>
        </div>
    </div>
</template>

<script>
  import {appMutual} from '../../../../../other_modules/app-mutual'
  import {getH5Url} from "../../../../../other_modules/url-constructor";

  export default {
    name: "CouponCash",
    props: ['data'],
    data () {
      return {
        show:true
      }
    },
    methods: {
      closeBig () {
        this.show = false
        this.$emit('close')
      },
      couponClick () {
        appMutual.send.url({
          url:getH5Url('/app/inviteCode?entry=4'),
          destroy_current:0,
          callback_url:'',
          request_type:'post',
          need_param:1
        })
      }
    }
  }
</script>

<style lang=less>

    .InviteFriend {
        .mask {
            position: absolute;
            width: 100%;
            height: 100vh;
            background-color: rgba(0, 0, 0, 0.4);
            top: 0;
            z-index: 20;

        }

        .big-box {
            position: absolute;
            width: 100%;
            top: 0.7rem;
            z-index: 21;

            .img {
                //margin:0 auto;
                width: 100%;
                background: no-repeat center;
                background-size: 100%;
                transition: all 600ms ease-in-out;
                &.big {
                    margin-top: 0;
                    margin-left: 0.475rem;
                    width: 2.8rem;
                    height: 3.75rem;
                    background-image: url('../images/activity.png');
                }
            }

            .close {
                margin: 0.2rem auto;
                width: 0.3rem;
                height: 0.3rem;
                background: url('../images/pop_close.png') no-repeat center;
                background-size: 100%;
            }
        }

    }
</style>
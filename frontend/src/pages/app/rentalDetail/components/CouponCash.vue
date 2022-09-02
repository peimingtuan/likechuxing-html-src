<template>
    <div class="CouponCash">
        <transition
                name="custom-classes-transition"
                enter-active-class="animated faster fadeIn"
                leave-active-class="animated faster fadeOut"
        >
            <div class="mask" v-if="mask_show"></div>
        </transition>

        <div class="big-box">
            <div class="img" :class="type === 0 ? 'big': 'small'" @click="couponClick"></div>
            <!-- <transition
                    name="custom-classes-transition"
                    enter-active-class="animated faster fadeIn"
                    leave-active-class="animated faster fadeOut"
            > -->
            <div class="close" @click="closeBig" v-if="mask_show"></div>
            <!-- </transition> -->
        </div>
    </div>
</template>

<script>
  import {appMutual} from '../../../../../other_modules/app-mutual'
  import wxShareSelector from '../../../../component/wxShareSelector'
  import {umeng} from "../../../activity/coupon_cash/js/umeng";

  require('../../../../../other_modules/css-animate/animateBase.less')
  require('../../../../../other_modules/css-animate/fadeInOut.less')

  export default {
    name: "CouponCash",
    props: ['data'],
    data () {
      return {
        type: 0, // 0=big,1=small
        mask_show: true
      }
    },
    methods: {
      closeBig () {
        this.mask_show = false
        this.type = 1
        this.$emit('hide')
      },
      couponClick () {
        if (this.type === 0) {
          umeng.addEvent(['rentalDetail','click'])
          let that = this
          wxShareSelector({
            msg: '分享',
            cb: function (des) {

              let count = ['rentalDetail','share']
              count.push(des === '1' ? 'pyq' : "friend")

              umeng.addEvent(count).then(()=>{
                appMutual.share.wx({
                  share_type: 12,
                  destination: des,
                  activity_id: that.data
                })
              })
            }
          })
        } else {
          this.mask_show = true
          this.type = 0
        }
      }
    },
    mounted(){
      umeng.addEvent(['rentalDetail','view'])
    }
  }
</script>

<style lang=less>

    .CouponCash {
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
            top: 1.3rem;
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
                    height: 3.04rem;
                    background-image: url('../images/pop_img.png');
                }
                &.small {
                    margin-top: 2rem;
                    margin-left: 3.1rem;
                    width: 0.55rem;
                    height: 0.73rem;
                    background-image: url('../images/pop_small.png');
                }
            }

            .close {
                margin:-0.5rem auto 0;
                width: 2.8rem;
                height: 0.4rem;
                //background: url('../images/pop_close.png') no-repeat center;
                background-size: 100%;
            }
        }

    }
</style>
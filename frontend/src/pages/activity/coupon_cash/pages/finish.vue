<template>
    <div class="finish">

        <!--头图-->
        <HeaderMain/>
        <div class="couponWrap">
            <div class="my-coupon-box">
                <div class="coupon-list">
                    <CouponBox v-for="item in coupon_list" :key="item.money" :data="item"/>
                </div>
                <div class="account">
                    红包已放入账号{{phone_show}}
                    <span class="edit" @click="toEdit">编辑</span>
                </div>
                <LikeButton
                        class="btn"
                        type="couponBtn"
                        text="立刻使用"
                        @click="toDownload"
                />
                <div class="invite">
                    <span class="text" @click="toInvite">邀请好友一起用车</span>
                </div>
            </div>
        </div>
        <!--抢红包列表-->
        <ShareList/>
    </div>
</template>

<script>
  import LikeButton from '../components/Button'
  import HeaderMain from '../components/HeaderMain'
  import ShareList from '../components/ShareList'
  import CouponBox from '../components/CouponBox'
  import {mapState} from 'vuex'
  import {umeng} from "../js/umeng";

  export default {
    name: "finish",
    components: {
      HeaderMain,
      ShareList,
      LikeButton,
      CouponBox,
    },
    computed: {
      ...mapState(['phone','coupon_list',"uuid"]),
      phone_show(){
        return this.phone.substr(0,3)+'****'+this.phone.substr(7,4)
      }
    },
    methods: {
      toEdit () {
        this.$router.push('/edit')
      },
      toDownload () {
        umeng.addEvent(['finish','use']).then(()=>{
          window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.like.car'
        })
      },
      toInvite(){
        this.$store.dispatch('toInviteCode')
      }
    },
    mounted(){
      umeng.addEvent(['finish','view'])
    }
  }
</script>

<style lang=less scoped>
.finish{
    min-height: 100vh;
    background: #fc241c;
    .couponWrap{
        padding: .23rem .13rem 0;
        box-sizing: border-box;
        .my-coupon-box {
            /* padding: 0.2rem 0.33rem; */
            background: #FFF;
            border-radius:2px;
            box-sizing: border-box;
            padding: .34rem .22rem .33rem;
            .coupon-list{
                padding-bottom: 0.1rem;
            }

            .account {
                font-size: 15px;
                line-height: 1;
                .edit {
                    color: #A0A0A0;
                    float: right;
                    position: relative;
                    padding-left: 20px;

                    &::before {
                        content: '';
                        display: block;
                        width: 15px;
                        height: 15px;
                        position: absolute;
                        top: -1px;
                        left: 0;
                        background: url('../images/icon_edit.png') no-repeat center;
                        background-size: auto 90%;

                    }
                }
            }

            .btn{
                margin:0.36rem 0 .32rem;
                display: block;
                width: 100%;
                height: 0.45rem;
                font-size: 18px;
            }

            .invite{
                text-align: center;
                color:#181D1B;
                line-height: 1;
                font-size: 16px;
                /* padding:0.1rem 0; */
                .text{
                    padding-right: 0.12rem;
                    background: url('../images/icon_right.png') no-repeat center right;
                    background-size: auto 86%;
                }
            }
        }
    }
}
</style>
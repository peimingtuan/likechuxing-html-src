<template>
    <div class="couponList">
        <div class="loading" v-if="!dataReady">加载中...</div>
        <div class="content" v-else>

            <div class="empty" v-if="list.length === 0">
                <div class="text">
                    领取成功<br />
                    快去邀请好友获得更多红包吧
                </div>
                <img src="../images/coupon.png" class="img" />
            </div>

            <div class="list-box" v-else>
                <div class="welcome" v-if="new_user === 1">恭喜您！获得{{amount}}元红包</div>
                <div class="welcome" v-else>您已经领取！已有{{amount}}元红包</div>

                <div class="list">
                    <CouponBox
                            v-for="item in list"
                            :key="item.id"
                            :data="item"
                            bgColor="#f2f2f2"
                    />
                </div>
            </div>

            <div class="footer">
                <button class="btn" @click="toDownload">{{btn_text}}</button>
            </div>
        </div>
    </div>
</template>

<script>
  import myAjax from '../../../../../other_modules/like-request/withAxiosV3'
  import {getActivityApiUrl} from "../../../../../other_modules/url-constructor";
  import Coupon from '../../../../../other_modules/like-model/models/Coupon'
  import CouponBox from '../../../../../other_modules/vue-coupon/couponBoxV3'
  import downloadUrl from '../../../../component/downloadUrl'
  import env from '../../../../../other_modules/like-env'

  export default {
    name: "couponList",
    components: {
      CouponBox
    },
    data(){
      return {
        dataReady:false,
        list:[],
        amount:0,
        new_user:1
      }
    },
    computed: {
      btn_text(){
        return this.list.length === 0 ? '我要领红包' : '立即使用'
      }
    },
    methods:{
      toDownload(){
        if (env.isIos) {
          window.location.href = downloadUrl.appleStore
        } else {
          window.location.href = downloadUrl.yingyongbao
        }
      }
    },
    created(){
      let data = window.resData
      this.new_user = Number(data.new_user)

      myAjax.post(getActivityApiUrl('/coupon/list'),{
        uuid: data.uuid,
        sign: data.sign,
        status: 0,
        begin: 0,
        type:1
      }).then(res=>{
        if(res.status === 0){
          this.list = res.data.map(item=>{
            let coupon = new Coupon(item,1)
            this.amount+=Number(coupon.free_money)
            return coupon
          })
        }else{
          this.$_LIKE_toast(res.msg)
        }
        this.dataReady = true
      })
    }
  }
</script>

<style lang=less scoped>
.couponList{
    min-height: 100vh;
    position: relative;
    background-color: #f7f7f7;

    .loading{
        padding-top: 2rem;
        color:#999;
        font-size: 13px;
        text-align: center;
    }

    .empty{
        padding-top: 0.4rem;
        text-align: center;
        .text{
            margin:0.1rem 0;
            text-align: center;
            font-size: 15px;
        }
        .img{
            width: 1.8rem;
        }
    }

    .list-box{
        padding-bottom: 0.8rem;
        .welcome{
            padding-top: 0.4rem;
            text-align: center;
            font-size: 14px;
        }

        .list{
            padding:1px 0;
        }
    }

    .footer{
        position: absolute;
        bottom:0.15rem;
        width: 100%;
        padding: 0 0.15rem;
        box-sizing: border-box;
        .btn{
            width: 100%;
            line-height: .46rem;
            outline: none;
            border: none;
            background: #494b51;
            border-radius: 2px;
            text-align: center;
            color: #fff;
            font-size: 15px;
            position: relative;

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
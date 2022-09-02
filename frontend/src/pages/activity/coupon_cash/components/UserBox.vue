<template>
    <div class="UserBox">
        <div class="head-img" :style="'background-image: url('+img+')'">
            <div class="best" v-if="data.is_lucky"></div>
        </div>
        <div class="text-box">
            <div class="name">{{data.nickname}}</div>
            <div class="time">{{get_time_h}}</div>
        </div>

        <div class="money-box">
            <span class="flag">¥</span>
            <span class="money">{{money}}</span>
        </div>
        <button class="bestBox" v-if="data.is_lucky">手气最佳</button>
    </div>
</template>

<script>
  import format from '../../../../../other_modules/like-function/format'

  export default {
    name: "UserBox",
    props:['data'],
    computed:{
      get_time_h(){
        return format.time(this.data.create_time,0)
      },
      money(){
        return format.money(this.data.coupon_value)
      },
      img(){
        // 用户头像，最后一个数值代表正方形头像大小（有0、46、64、96、132数值可选，0代表640*640正方形头像）
        return this.data.headimgurl + '/132'
      }
    }
  }
</script>

<style lang=less scoped>
.UserBox{
    padding: .15rem 0.2rem;
    display: flex;
    justify-content: space-around;
    background-color: #fff;
    border-bottom: solid 1px #E1E1E3;
    position: relative;
    &:nth-last-of-type(1){
        border-bottom: none;
        border-radius: 0 0 .02rem .02rem;
    } 
    &:nth-of-type(1){
        border-radius: .02rem .02rem 0 0;
    }
    .bestBox{
        position: absolute;
        width: .4rem;
        height: .15rem;
        border: 1px solid #fe1a15;
        outline: none;
        font-size: 9px;
        padding: 0;
        right:.2rem;
        color: #fe1a15;
        background: #fff;
        box-sizing: border-box;
        border-radius: 2px;
    }
    .head-img{
        width: 0.42rem;
        height: 0.42rem;
        border-radius: 50%;
        background: no-repeat center;
        background-size: 100% auto;
        position: relative;

        .best{
            position: absolute;
            width: 0.21rem;
            height: 0.17rem;
            background: url('../images/the_best.png') no-repeat center;
            background-size: 100% auto;
            top:-0.11rem;
            left:-0.02rem
        }
    }

    .head-img,.money-box{
        flex:none
    }
    .text-box{
        flex:1;
        line-height: 0.2rem;
        padding: 0.01rem 0.1rem 0;
        .name{
            font-size:16px;
            color:#030303
        }
        .time{
            font-size:13px;
            color:#908F8F
        }
    }
    .money-box{
        color:#FE1A15;
        line-height: 0.2rem;
        padding-top: 0.2rem;
        .flag{
            font-size: 13px;
            margin-right: 0.03rem;
        }
        .money{
            font-size: 16px;

        }
    }
}
</style>
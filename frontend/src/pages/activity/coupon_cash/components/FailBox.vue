<template>
    <div class="FailBox">
      <div class="failBox">
        <div class="img " :class="style[0]" ></div>
        <h3 :style="style[2]==''?'margin-bottom: .24rem;':'margin-bottom: .06rem;'">{{style[1]}}</h3>
        <p>{{style[2]}}</p>
        <button @click="toDownload">打开APP</button>
        <div class="invite" @click="toInvite">邀请好友一起用车</div>
      </div>
    </div>
</template>

<script>
    // type: 1=红包过期，2=领取次数完了，3=红包抢完了
  import {umeng} from "../js/umeng";
  export default {
    name: "FailBox",
    props:['type'],
    computed:{
      style(){
        switch (Number(this.type)){
          case 1:
            return ['icon_1','这个红包过期啦！','记得下次早点来哦']
          case 2:
            return ['icon_2','一天只能抢三个红包哦！','明天再来吧']
          case 3:
            return ['icon_3','这个红包被抢完啦！','']
          default:
            return ['icon_2','领取失败']
        }
      }
    },
    methods:{
      toInvite(){
        this.$store.dispatch('toInviteCode')
      },
      toDownload(){
        umeng.addEvent(['finish','use']).then(()=>{
          window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.like.car'
        })
      }
    }
  }
</script>

<style lang=less scoped>
.FailBox{
    width: 100%;
    padding: .23rem .13rem 0;
    text-align: center;
    box-sizing: border-box;
    background: #fc241c;
    .failBox{
      width: 100%;
      background: #FFF;
      height: 2.9rem;
      border-radius: 2px; 
      display: flex;
      box-sizing: border-box;
      padding: 0 .22rem;
      flex-direction: column;
      /* justify-content: center; */
      align-items: center; 
      .img{
        width: .41rem;
        height: .41rem;
        margin: .34rem 0 .16rem;
        &.icon_1{
            background: url('../images/icon_1.png') no-repeat;
            background-size: .41rem .41rem;
        }
        &.icon_2{
            background: url('../images/icon_2.png') no-repeat;
            background-size: .41rem .41rem;
        }
        &.icon_3{
            background: url('../images/icon_3.png') no-repeat;
            background-size: .41rem .41rem;
        }
      }
      h3{
        font-size:18px;
        color: #000E20;
        line-height: 1;
        margin-bottom: .06rem;
        font-weight: normal;
        padding-left: .1rem;
      }
      p{
        color: #97979B;
        font-size:18px;
        line-height: 1;
      }
      button{
        width: 100%;
        background: #FDDF4C;
        height: .45rem;
        border: none;
        outline: none;
        font-size: 18px;
        color: #010F21;
        margin: .34rem 0 .32rem;
      }
      .invite{
        font-size: 16px;
        color: #000E20;
        padding-right: .14rem;
        background: url('../images/icon_right.png') no-repeat right center;
        background-size: .08rem .15rem;
      }
    }
}
</style>
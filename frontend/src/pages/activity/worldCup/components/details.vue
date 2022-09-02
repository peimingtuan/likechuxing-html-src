<template>
    <div class="Details" @touchmove="stop">
        <div class="mask" ></div>
        <div class="box">
            <div class="close" @click="close"></div>
            <p class="msg">竞猜攻略</p>
            <ul class="detail_list">
                <li class="detail" v-for="item,index in details" :key="item">
                    <span class="index">{{index+1}}、</span>
                    <div class="item">{{item}}</div>
                </li>
            </ul>
        </div>

    </div>
</template>

<script>
  export default {
    name: "bet-in-app",
    data(){
      return{
        details:[
          '活动时间：2018年6月30日—2018年7月15日。',
          '每场比赛前可选择您支持的球队，竞猜结果与比赛结果一致即可得10积分。' ,
          '将活动页面分享至微信可邀请好友参与，邀请新用户注册可获得10积分，邀请已注册用户参加可获得5积分，每期最多可邀请5位好友参加。活动期内，每个用户仅可被成功邀请一次。' ,
          '积分满300分可在商城兑换30元话费，满500分可兑换50元话费。' ,
          '世界杯总决赛后，通过活动获得的积分排行前5的用户，可获得半年期的免费开车名额。' ,
          '通过订单获得的里程积分不计入活动排名。' ,
          '免费开车名额将通过发放优惠券方式使用。自2018年7月16日起至2018年12月31日止，用户可获得不限量的50元出行券，持续免费用车。'
        ]
      }
    },
    methods:{
      close(){
        this.$emit('close')
      },
      stop(e){
        e.stopPropagation()
        e.preventDefault()
      }
    }
  }
</script>

<style lang=less>
    .Details {
        position: fixed;
        width: 100%;
        height: 100%;
        top:0;
        .mask{
            width: 100%;
            height: 100%;
        }
        .box{
            position: absolute;
            top: 0.5rem;
            left: 50%;
            margin-left: -1.35rem;
            width: 2.7rem;
            background-color: #082d60;
            border-radius: 10px;
            padding: 0.5rem 0.2rem;
            box-sizing: border-box;
            text-align: center;
            color: #fff;
            font-size: 14px;
            .text{
                margin:0.2rem 0;
            }
            .msg {
                font-size: 18px;
                line-height: 0.2rem;
                margin:0.1rem 0 0.2rem 0;
            }
            .close {
                width: 0.22rem;
                height: 0.22rem;
                position: absolute;
                right: 0.2rem;
                top: 0.2rem;
                background: url('../images/close.png') no-repeat center;
                background-size: 100%;
            }
            .detail_list{
                text-align: left;
                font-size: 12px;
                position: relative;
                .index{
                    position: absolute;
                    width: 0.2rem;
                }
                .item{
                    margin-left:0.2rem
                }
            }

        }

    }
</style>
<template>
  <div class="Pay">
    <div class="payHeader">
      <div class="title">需支付</div>
      <div class="money warn">{{order.actual_fee}}<span class="tail">元</span></div>
    </div>
    <PayWays :list="payWayList" @changePayWay="setPayWay"/>
    <div class="btn_con">
      <button class="btn btn-primary btn-block" @click="pay">立即支付</button>
    </div>
  </div>
</template>

<script>
  import {mapState,mapGetters} from 'vuex'
  import PayWays from '../../components/PayWays'
  import API from '../../common/apiAddress'
  import PAGE from '../../common/pageAddress'
  import myAjax from '../../common/myAjax'

  export default {
    name: "pay",
    components:{
      PayWays
    },
    data(){
      return {
        payWayList:['zfb'],
        pay_way:''
      }
    },
    computed:{
      ...mapState('pay',[
        'order'
      ]),
      ...mapGetters('user',[
        'userLoginInfoLike'
      ])
    },
    methods:{
      setPayWay(way){
        this.pay_way = way
      },
      pay(){
        let data = {
          type:1,
          methond:4,
          rental_no:this.order.rental_no,
          return_url:PAGE.selfFinish.href + '?rental_no='+this.order.rental_no
        }

        myAjax.postPage(API.pay.index, data)
      }
    },
    created(){
      this.$store.dispatch('pay/getRentalDetail').catch(err=>{
        if(err.msg && err.msg !== ''){
          this.$_LIKE_toast(err.msg)
          this.$router.push('/index')
        }
      })
    }
  }
</script>

<style lang="less" scoped>
  .Pay{
    background-color: #F7F7F7;
    .payHeader{
      background-color: #fff;
      padding: 0.4rem 0.2rem;
      color:#111;
      font-size: 0.14rem;
      .money{
        font-size: 0.36rem;
        .tail{
          font-size: 0.12rem;
        }
      }
    }
    .btn_con{
      position: absolute;
      left:0.1rem;
      right:0.1rem;
      bottom:0.1rem;
      .btn{
        height: 0.46rem;
        font-size: 0.16rem;
      }
    }
  }
</style>

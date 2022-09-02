<template>
  <div class="Deposit">
    <div class="header">
      <div class="title">
        用车保证金
        <img src="../../assets/images/icon_deposit_desc.png" id="deposit_desc" @click="toDescribe" />
      </div>
      <div class="money">{{formatMoney}}<span>元</span></div>
    </div>
    <PayWays :list="payWayList" @changePayWay="setPayWay"/>
    <router-link to="history" append>
      <div class="deposit_log">保证金记录 ></div>
    </router-link>
    <div class="btn_con">
      <button class="btn btn-block btn-primary" @click="pay">立即支付</button>
    </div>
  </div>
</template>

<script>
  import PayWays from '../../components/PayWays/'
  import {mapState} from 'vuex'
  import format from '../../common/Format'
  import myAjax from '../../common/myAjax'
  import API from '../../common/apiAddress'
  import PAGE from '../../common/pageAddress'
  import {Alert,Loading,Toast} from '../../../other_modules/vue-plugins/like-base'

  export default {
    data () {
      return {
        payWayList:['zfb'],
        pay_way:''
      }
    },
    components: {
    	PayWays
    },
    computed: {
      ...mapState('user',[
        'deposit',
        'is_3001',
        'reason_3001',
        'license_status'
      ]),
    	formatMoney () { return format.money(this.deposit) }
    },
    methods: {
      setPayWay(way){
        this.pay_way = way
      },
    	toDescribe () {
        SDK.openWindow(PAGE.describeDeposit.href)
      },
      pay () {
        if(this.is_3001){
          Alert({
            title:'账号异常提醒',
            msg:'因您有<span class="warn">'+this.reason_3001+'</span>行为，当前账号无权进行该操作'
          })
          return
        }

        let data = {
          type:3,
          methond:4,
          return_url:this.license_status === 3 ? PAGE.selfLicense.href+'?from=pay' :PAGE.selfMain.href+'?from=pay'
        }

        myAjax.postPage(API.pay.index, data)
      }
    },
    created: function () {
      if(!this.deposit){
        this.$store.dispatch('user/getDeposit')
      }
    },
    beforeRouteLeave(to,from,next){
      let allow = [
        '/user/deposit/history'
      ]
      if(from.query.from === 'login' && !allow.includes(to.path) && to.path!=='/index'){
        // 从登录页来的，且返回目标不是首页的话，去首页
        next({
          path:'/index'
        })
      }else{
        next()
      }
    }
  }
</script>

<style lang="less" scoped>
  .Deposit{
    background-color: #F7F7F7;
  }
  .header{
    padding: 0.54rem 0;
    background-color: #fff;
    color:#111;
  }
  .title{
    font-size: 0.15rem;
    line-height: 0.3rem;
    position: relative;
    #deposit_desc{
      margin-left: 0.08rem;
      height:0.15rem;
      position: absolute;
      top:50%;
      margin-top: -0.08rem;
    }
  }
  .deposit_log{
    margin-top: 0.2rem;
    font-size: 0.12rem;
    color:#999
  }

  .money{
    color:#ED3800;
    font-size: 0.36rem;
    span{
      font-size: 0.13rem;
    }
  }
  .btn_con{
    padding: 0.1rem;
    width: 100%;
    box-sizing: border-box;
    position: absolute;
    bottom:0;
    .btn{
      font-size: 0.15rem;
      height: 0.46rem;
    }
  }

</style>

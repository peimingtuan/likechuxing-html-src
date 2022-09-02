<template>
  <div class="Deposit">
    <div class="header">
      <router-link to="/deposit/history">
        <div class="deposit_log">押金记录</div>
      </router-link>
      <div class="title">用车押金<img src="../../assets/images/icon_deposit_desc.png" id="deposit_desc" @click="toDescribe" /></div>
      <div class="money">{{formatMoney}}<span>元</span></div>
    </div>
    <PayWays :list=payWayList></PayWays>
    <div class="btn_con">
      <button class="btn" @click="pay">立即支付</button>
    </div>
    <iframe id="if" name="if"></iframe>
  </div>
</template>

<script>
  import PayWays from '../../components/PayWays/'
  import format from '../../common/Format'
  import myaxios from '../../common/myaxios'
  import API from '../../common/apiAddress'
  const wx = window.wx

  export default {
    data () {
      return {
      	payWayList: ['wx'],
        money: 499,
        open_id: ''
      }
    },
    components: {
    	PayWays
    },
    computed: {
    	formatMoney () { return format.money(this.money) }
    },
    methods: {
    	toDescribe () { this.$router.push({name: 'static', query: {page: 'describeDeposit'}}) },
      pay () {
    		let that = this
    		myaxios.post(API.pay.index, {
          type: '3',
          methond: '3',
          open_id: this.open_id
         }).then(res => {
         	if (res.data.status === 0) {
         		let pay = res.data.data
            wx.chooseWXPay({
              timestamp: pay.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
              nonceStr: pay.nonceStr, // 支付签名随机串，不长于 32 位
              package: pay.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
              signType: pay.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
              paySign: pay.paySign, // 支付签名
              success: function (res) {
                if (res.errMsg === 'chooseWXPay:ok') {
                	that.$router.push({
                    name: 'main'
                  })
                }
              }
            })
          }
        })
      }
    },
    created: function () {
      let hash = window.location.hash
      // 此处一定会有get的open_id，否则无法进入此页面，逻辑见router.beforeEach
      let query = {}
      hash.split('?')[1].split('&').forEach(item => {
        let key = item.split('=')
        query[key[0]] = key[1]
      })
      this.open_id = query.open_id
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
    font-size: 0.12rem;
    position: absolute;
    right:1em;
    top:1em;
    color:#111
  }

  .money{
    color:#ED3800;
    font-size: 0.36rem;
    span{
      font-size: 0.13rem;
    }
  }
  .btn_con{
    padding: 0.15rem 0;
    position: fixed;
    left:0.2rem;
    right:0.2rem;
    bottom:0;
    .btn{
      width:100%;
      height: 0.46rem;
      border-radius: 3px;
      font-size: 0.15rem;
      color:#fff;
      background-color:#111 ;
    }
  }

  #if{
    display: none;
  }
</style>

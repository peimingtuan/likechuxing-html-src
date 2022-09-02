<template>
  <div class="DepositReturn">
    <div class="header">
      <router-link to="/deposit/history">
        <div class="deposit_log">押金记录</div>
      </router-link>
      <div class="title">用车押金<img src="../../assets/images/icon_deposit_desc.png" id="deposit_desc"
                                  @click="toDescribe"/></div>
      <div class="money">{{formatMoney}}<span>元</span></div>
    </div>
    <div class="btn_con">
      <button class="btn" @click="returnMoney">退押金</button>
    </div>
    <div class="tips">
      <p v-for="item in desc" :key="item">{{item}}</p>
    </div>
  </div>
</template>

<script>
  import format from '../../common/Format'

  export default {
    data () {
      return {
        money: '-',
        desc: []
      }
    },
    computed: {
      formatMoney: function () {
        if (this.money === '-') {
          return '-'
        } else {
          return format.money(this.money)
        }
      }
    },
    methods: {
      toDescribe: function () {
        this.$router.push({name: 'static', query: {page: 'describeDeposit'}})
      },
      returnMoney () {
        this.$router.push({name: 'reasonList'})
      }
    },
    created: function () {
      this.$store.dispatch('user/getDepositQuery').then(res => {
        this.money = res.data.current_deposit
        this.desc = res.data.des.split('\n')
      })
    }
  }
</script>

<style lang="less" scoped>
  .DepositReturn {
    background-color: #f7f7f7;
  }

  .header {
    padding: 0.54rem 0 0.4rem;
    color: #111;
  }

  .title {
    font-size: 0.15rem;
    line-height: 0.3rem;
    position: relative;
    #deposit_desc {
      margin-left: 0.08rem;
      height: 0.15rem;
      position: absolute;
      top: 50%;
      margin-top: -0.08rem;
    }
  }

  .deposit_log {
    font-size: 0.12rem;
    position: absolute;
    right: 1em;
    top: 1em;
    color: #111
  }

  .money {
    color: #ED3800;
    font-size: 0.36rem;
    span {
      font-size: 0.13rem;
    }
  }

  .btn_con {
    padding: 0 0.2rem;
    .btn {
      width: 100%;
      height: 0.46rem;
      border-radius: 3px;
      font-size: 0.15rem;
      color: #fff;
      background-color: #111;
    }
  }

  .tips {
    margin-top: 0.4rem;
    padding: 0 0.2rem;
    color: #999;
    font-size: 0.13rem;
    text-align: left;
    line-height: 0.22rem;
  }
</style>

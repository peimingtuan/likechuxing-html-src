<template>
  <ul class="PayWays">
    <li v-for="item in ways" @click="()=>changeWay(item.key)">
      <img :src=item.icon class="pay_icon"/>
      {{item.name}}
      <div class="choose_icon" :class="{active: chosen === item.key}"></div>
    </li>
  </ul>
</template>

<script>
  const PAY_WAYS = {
    zfb: {
      name: '支付宝',
      key: 'zfb',
      icon: require('./images/zfb.png')
    },
    wx: {
      name: '微信钱包',
      key: 'wx',
      icon: require('./images/wx.png')
    }
  }

  export default {
    data() {
      return {
        ways: [],
        chosen: ''
      }
    },
    props: [
      'list'
    ],
    methods: {
      changeWay(way) {
        this.chosen = way
        this.$emit('changePayWay', way)
      }
    },
    created: function () {
      this.ways = this.list.map(item => PAY_WAYS[item])
      this.chosen = this.list[0]
      this.$emit('changePayWay', this.list[0])
    }
  }
</script>

<style lang="less" scoped>
  .PayWays {
    width: 100%;
    background-color: #fff;
    border-top: solid 1px #DFDFDF;
    border-bottom: solid 1px #DFDFDF;
    li {
      position: relative;
      margin-left: 0.2rem;
      font-size: 0.15rem;
      line-height: 0.3rem;
      padding: 0.15rem;
      text-indent: 0.3rem;
      text-align: left;
      border-bottom: solid 1px #DFDFDF;
      &:nth-last-of-type(1) {
        border-bottom: none;
      }
    }
    .pay_icon {
      display: block;
      position: absolute;
      left: 0;
      top: 50%;
      margin-top: -0.15rem;
      height: 0.3rem;
    }
    .choose_icon {
      position: absolute;
      height: 0.3rem;
      width: 0.3rem;
      background: url('./images/choose.png') no-repeat center;
      background-size: 70%;
      right: 0.15rem;
      top: 50%;
      margin-top: -0.15rem;
      &.active {
        background-image: url('./images/choose_active.png');
      }
    }
  }
</style>


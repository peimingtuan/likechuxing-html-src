<template>
  <ul class="PayWays">
    <li data-name="zfb" v-if="zfb_display" @click="(changeWay)('zfb')">
      <img src="./images/zfb.png" class="pay_icon" />
      支付宝
      <div :class="['choose_icon', {active: chosen === 'zfb'}]"></div>
    </li>
    <li data-name="wx" v-if="wx_display" @click="(changeWay)('wx')">
      <img src="./images/wx.png" class="pay_icon" />
      微信钱包
      <div :class="['choose_icon', {active: chosen === 'wx'}]"></div>
    </li>
  </ul>
</template>

<script>
  import {mapState} from 'vuex'
  export default {
    data () {
      return {}
    },
    props: [
    	'list'
    ],
    computed: mapState({
      zfb_display: state => state.PayWays.way_list.indexOf('zfb') > -1,
      wx_display: state => state.PayWays.way_list.indexOf('wx') > -1,
      chosen: state => state.PayWays.chosen
    }),
    methods: {
    	changeWay (way) { this.$store.commit('PayWays/change', way) }
    },
    created: function () {
      let data = this.list
      if (data) {
      	this.$store.commit('PayWays/init', data)
      }
    }
  }
</script>

<style lang="less" scoped>
  .PayWays{
    width: 100%;
    background-color: #fff;
    border-top:solid 1px #DFDFDF;
    border-bottom:solid 1px #DFDFDF;
    li{
      position: relative;
      margin-left:0.2rem;
      font-size: 0.15rem;
      line-height: 0.3rem;
      padding: 0.15rem;
      text-indent: 0.3rem;
      text-align: left;
      border-bottom: solid 1px #DFDFDF;
      &:nth-last-of-type(1){
        border-bottom: none;
      }
    }
    .pay_icon{
      display: block;
      position: absolute;
      left:0;
      top:50%;
      margin-top:-0.15rem;
      height: 0.3rem;
    }
    .choose_icon{
      position: absolute;
      height: 0.3rem;
      width:0.3rem;
      background: url('./images/choose.png') no-repeat center;
      background-size: 70%;
      right:0.15rem;
      top:50%;
      margin-top: -0.15rem;
      &.active{
        background-image: url('./images/choose_active.png');
      }
    }
  }
</style>

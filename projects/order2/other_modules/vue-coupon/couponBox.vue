<template>
  <div class="CouponBox" :class="{disabled:data.valid===0}" @click="tapCoupon">

    <div class="type">{{type_desc}}</div>

    <div class="main_box">

      <div class="value_box">
        <div v-if="data.type === '2'" class="value_desc">免费
          <div class="type_cut2">2小时</div>
        </div>
        <div v-else class="value">{{value}}</div>
        <div v-if="data.type === '1' && data.use_condition>0" class="condition">(满{{data.use_condition}}可用)</div>
      </div>

      <div class="desc">
        <div class="name">{{data.name}}</div>
        <div class="time">{{coupon_time}}</div>
        <ul class="limit">
          <li v-for="item in coupon_des" :key="item" class="item">{{item}}</li>
        </ul>
      </div>
    </div>
    <ul class="circles">
      <li class="circle"></li>
      <li class="circle"></li>
      <li class="circle"></li>
      <li class="circle"></li>
      <li class="circle"></li>
      <li class="circle"></li>
    </ul>
    <!--<div class="useless_desc"></div>-->
    <div v-if="choose" class="choose"></div>
  </div>
</template>

<script>
  import format from '../like-function/format'

  export default {
    name: "coupon-box",
    props: ['data','choose'],
    computed: {
      type_desc() {
        switch (Number(this.data.type)) {
          case 1:
            return '满减券'
          case 2:
            return '免费券'
          default:
            return '通用券'
        }
      },
      value() {
        return Number(this.data.value)
      },
      coupon_des() {
        return this.data.des.split('/')
      },
      coupon_time() {
        return format.time(this.data.begin_time, 6) + ' - ' + format.time(this.data.end_time, 6) + ' 有效'
      }
    },
    methods: {
      tapCoupon() {
        if (this.data.valid === 1) {
          this.$emit('tapCoupon', this.data)
        }
      }
    }
  }
</script>

<style lang="less">
  .CouponBox {
    margin: 0.15rem;
    color: #111;
    background-color: #333;
    overflow: hidden;
    position: relative;
    display: flex;
    &.disabled {
      color: #999;
      background-color: #999;
    }

    .type {
      font-size: 0.14rem;
      text-align: center;
      color: #fff;
      width: 0.3rem;
      box-sizing: border-box;
      padding: 0 0.5em;
      line-height: 0.2rem;
      display: flex;
      justify-content: center;
      flex-direction: column;
    }

    .main_box {
      flex: 1;
      border: solid 1px #dfdfdf;
      box-sizing: border-box;
      padding: 0.15rem 0;
      background-color: #fff;
      display: flex;

      .value_box {
        padding: 0 0.15rem;
        text-align: center;
        .value {
          min-width: 0.6rem;
          padding-left: 0.1rem;
          font-size: 0.44rem;
          position: relative;
          &::before {
            content: ' ¥ ';
            font-size: 0.18rem;
            position: absolute;
            bottom: 15%;
            margin-left: -0.14rem;
          }
        }
        .value_desc {
          padding: 0 0.05rem;
          min-width: 0.6rem;
          font-size: 0.3rem;
          .type_cut2 {
            font-size: 0.2rem;
            line-height: 0.2rem;
            margin-top: -0.05rem;
          }
        }
        .condition {
          font-size: 0.11rem;
          line-height: 1;
          margin-top: -0.5em;
        }
      }

      .desc {
        padding: 0 0.15rem;
        text-align: left;
        border-left: dashed 1px #dfdfdf;
        .name {
          font-size: 0.16rem;
        }
        .time {
          font-size: 0.11rem;
        }
        .limit {
          padding-top: 0.05rem;
          .item {
            font-size: 0.11rem;
            word-break: break-all;
            &::before {
              content: '· '
            }
          }
        }
      }
    }

    .circles > .circle {
      position: absolute;
      width: 0.1rem;
      height: 0.1rem;
      background-color: #f7f7f7;
      border: solid 1px #dfdfdf;
      border-radius: 50%;
      &:nth-of-type(1) {
        left: -0.05rem;
        top: -0.05rem;
      }
      &:nth-of-type(2) {
        left: 0.25rem;
        top: -0.05rem;
      }
      &:nth-of-type(3) {
        right: -0.05rem;
        top: -0.05rem;
      }
      &:nth-of-type(4) {
        left: -0.05rem;
        bottom: -0.05rem;
      }
      &:nth-of-type(5) {
        left: 0.25rem;
        bottom: -0.05rem;
      }
      &:nth-of-type(6) {
        right: -0.05rem;
        bottom: -0.05rem;
      }
    }
    .useless_desc {
      background-color: #999;
      color: #fff;
      position: absolute;
      right: -0.2rem;
      top: 0.1rem;
      width: 0.8rem;
      font-size: 0.11rem;
      text-align: center;
      transform: rotate(45deg);
    }

    .choose {
      width: 0.7rem;
      height: 0.5rem;
      position: absolute;
      background-color: #111;
      right: -0.35rem;
      top: -0.25rem;
      transform: rotate(45deg);
      &:before {
        content: '';
        position: absolute;
        left: 0.3rem;
        bottom: 0.05rem;
        width: 0.06rem;
        height: 0.12rem;
        border-bottom: solid 1px #fff;
        border-right: solid 1px #fff;
      }

    }
  }
</style>

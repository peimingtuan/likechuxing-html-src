<template>
  <div class='Alert'>
    <!--mask层-->
    <transition
      name="custom-classes-transition"
      enter-active-class="animated faster fadeIn"
      leave-active-class="animated faster fadeOut"
      v-on:after-leave="afterLeave">
      <div class="mask" v-on:touchmove="preventEvent" v-if="show"></div>
    </transition>

    <!--对话框层-->
    <transition name="custom-classes-transition"
                enter-active-class="animated faster zoomIn"
                leave-active-class="animated faster zoomOut">
      <div class="alert" v-if="show">
        <div class="dialogBox">
          <img :src="car.car_pic" class="img"/>
          <div class="title">{{car.plate_no}}</div>
          <div class="desc">
            {{car.brand_name +' '+ car.model_name}}<span class="strong">|</span>
            {{car.seat_cnt}}<span class="strong">|</span>
            {{car.power_type}}
          </div>
          <div class="desc" v-if="car.remain_km">
            续航约<span class="strong">{{car.remain_km}}</span>公里
          </div>
          <div class="desc last">
            <span style="color:#111">{{car.price_km}}</span>元/公里 + <span style="color:#111">{{car.price_min}}</span>元/分钟
          </div>

          <!--单按钮-->
          <div class="alert_btn_container" @click="closeWindow">
            关闭
          </div>

        </div>
      </div>
    </transition>
  </div>
</template>

<script>

  export default {
    name: 'car-info',
    props: ['car'],
    data() {
      return {
        show: false
      }
    },
    mounted() {
      this.show = true
    },
    methods: {
      afterLeave() {
        this.$emit('closeCarInfo')
      },
      closeWindow() {
        this.show = false
      },
      preventEvent(e) {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .Alert {
    position: fixed;
    z-index: 100;

    .alert, .mask {
      position: fixed;
      width: 100vw;
      height: 100vh;
      top: 0;
      left:0;
    }

    .mask {
      background-color: rgba(0, 0, 0, 0.44);
    }
    .dialogBox {
      background-color: #FFF;
      width: 2.8rem;
      margin-left: -1.4rem;
      position: absolute;
      top: 25%;
      left: 50%;
      padding-top: 0.15rem;
      border-radius: 3px;
      color: #111;
      .img {
        display: block;
        height: 0.6rem;
        margin: 0 auto;
      }
      .title {
        color: #494B51;
        font-size: 0.18rem;
        margin: 0.15rem 0.2rem;
      }
      .desc {
        text-align: left;
        font-size: 0.14rem;
        margin: 0 0.2rem;
        .strong {
          margin: 0 0.3em;
          color: #111;
        }
        &.last {
          margin-bottom: 0.1rem;
          color: #999;
        }
      }
      .alert_btn_container {
        color: #111;
        font-size: 0.16rem;
        padding: 0.15rem 0;
        border-top: solid 1px #DFDFDF;
      }
    }

    .alert_icon {
      display: block;
      margin: 0 auto;
      width: 0.5rem
    }
  }

</style>

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
          <div class="title" v-if="!checkFail">
            系统自动检测
            <span class="countDown"> ( {{count}}s ) </span>
          </div>
          <div class="title" v-else>
            请检查以下未通过的项目
          </div>
          <ul class="list">
            <li v-for="(item,index) in result" class="item">
              <span class="icon" :class="['loading','succ','fail'][item]"></span>
              <span>{{text[index]}}</span>
            </li>
          </ul>
          <div class="btn-con" v-if="checkFail">
            <button class="btn btn-primary btn-block" @click="close">确定</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import {Confirm,Toast} from '../../../other_modules/vue-plugins/like-base'

  export default {
    name: 'return-car-check',
    data() {
      return {
        show: false,
        count: 30,
        count_flag: null,
        text: [
          '车辆大灯已关闭...',
          '车辆车门已锁好...',
          '车辆已熄火...',
          '后备箱已关闭...'
        ]
      }
    },
    props: ['result'],
    computed: {
      checkFail(){
        return this.result.some(item=>item>1)
      }
    },
    mounted() {
      this.show = true
      this.countDown()
    },
    beforeDestroy(){
      clearTimeout(this.count_flag)
    },
    methods: {
      countDown() {
        let that = this
        this.count_flag = setTimeout(function () {
          that.count--;
          if (that.count < 1) {
            Toast('检测超时，请重新还车，将在后台执行检测')
            that.close()
          } else {
            that.countDown()
          }
        }, 1000)
      },
      stopCountDown(){
        clearTimeout(this.count_flag)
        this.count = 30
      },
      close(){
        this.$emit('timeout')
        this.show = false
      },

      afterLeave() {
        this.$emit('hideMe')
      },
      closeWindow() {
        this.stopCountDown()
        this.show = false
      },
      preventEvent(e) {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
    },
    updated(){
      if(this.count !== 30 && this.checkFail){
        this.stopCountDown()
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

  @-webkit-keyframes circle
  {
    0%
    {
      -webkit-transform: rotate(0);
      -ms-transform: rotate(0);
      -o-transform: rotate(0);
      transform: rotate(0);
    }
    100%
    {
      -webkit-transform: rotate(-360deg);
      -ms-transform: rotate(-360deg);
      -o-transform: rotate(-360deg);
      transform: rotate(-360deg);
    }
  }
  @-moz-keyframes circle
  {
    0%
    {
      -webkit-transform: rotate(0);
      -ms-transform: rotate(0);
      -o-transform: rotate(0);
      transform: rotate(0);
    }
    100%
    {
      -webkit-transform: rotate(-360deg);
      -ms-transform: rotate(-360deg);
      -o-transform: rotate(-360deg);
      transform: rotate(-360deg);
    }
  }
  @-o-keyframes circle
  {
    0%
    {
      -webkit-transform: rotate(0);
      -ms-transform: rotate(0);
      -o-transform: rotate(0);
      transform: rotate(0);
    }
    100%
    {
      -webkit-transform: rotate(-360deg);
      -ms-transform: rotate(-360deg);
      -o-transform: rotate(-360deg);
      transform: rotate(-360deg);
    }
  }
  @keyframes circle
  {
    0%
    {
      -webkit-transform: rotate(0);
      -ms-transform: rotate(0);
      -o-transform: rotate(0);
      transform: rotate(0);
    }
    100%
    {
      -webkit-transform: rotate(-360deg);
      -ms-transform: rotate(-360deg);
      -o-transform: rotate(-360deg);
      transform: rotate(-360deg);
    }
  }

  .Alert {
    position: absolute;
    z-index: 100;

    .alert, .mask {
      position: fixed;
      width: 100vw;
      height: 100vh;
      top: 0;
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
      border-radius: 3px;
      color: #111;
      .title {
        color: #494B51;
        font-size: 0.17rem;
        margin: 0.15rem 0.2rem;
        .countDown {
          font-size: 0.14rem;
          color: #999;
        }
      }
      .list {
        margin:0.15rem 0 0.2rem;
        color: #999;
        .item {
          text-align: left;
          line-height: 0.2rem;
          margin:0.1rem auto;
          width: 10em;

          .icon{
            width: 0.2rem;
            height: 0.2rem;
            display: inline-block;
            vertical-align: top;
            background: no-repeat center;
            background-size: 90%;
            &.loading{
              background-image: url('../../assets/images/check/自动检测@3x.png');
              animation: circle infinite .75s linear;
            }
            &.succ{
              background-image: url('../../assets/images/check/完成@3x.png');
            }
            &.fail{
              background-image: url('../../assets/images/check/未关闭@3x.png');
            }
          }
        }
      }
      .btn-con{
        padding: 0.1rem;
        .btn{
          height: 0.4rem;
        }
      }
    }
  }

</style>

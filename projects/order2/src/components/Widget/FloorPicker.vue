<template>
  <div class='FloorPicker'>
    <!--mask层-->
    <transition
      name="custom-classes-transition"
      enter-active-class="animated faster fadeIn"
      leave-active-class="animated faster fadeOut"
      v-on:after-leave="afterLeave">
      <div class="mask" v-on:touchmove="preventEvent" v-if="show"></div>
    </transition>

    <!--对话框层-->
    <transition
      name="custom-classes-transition"
      enter-active-class="animated faster slideInUp"
      leave-active-class="animated faster slideOutDown">
      <div class="fun-con" v-if="show">
        <div class="box">
          <div class="title clearfix">
            <p class="float-left" @click="closeWindow">取消</p>
            <p class="float-right" @click="pickerThis">确认</p>
          </div>
          <div class="picker-con">
            <mt-picker :slots="slots" @change="onValuesChange"></mt-picker>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import {Picker} from 'mint-ui'

  export default {
    data() {
      return {
        show: false,
        value:'',
        slots: [
          {
            values: ['5层', '4层', '3层', '2层', '地面', 'B1','B2','B3','B4','B5','B6'],
            defaultIndex:4
          }
        ]
      }
    },
    components:{
      [Picker.name]:Picker
    },
    mounted() {
      this.show = true
    },
    methods: {
      afterLeave() {
        this.$emit('hideMe')
      },
      closeWindow() {
        this.show = false
      },
      preventEvent(e) {
        e.preventDefault()
        e.stopPropagation()
        return false
      },
      onValuesChange(picker) {
        this.value = picker.getValues()[0]
      },
      pickerThis(){
        this.$emit('changeFloor',this.value)
        this.show = false
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .FloorPicker {
    position: absolute;
    z-index: 90;
    top:0;

    .mask {
      position: absolute;
      width: 100vw;
      height: 100vh;
      top: 0;
      background-color: rgba(0, 0, 0, 0.44);
    }

    .fun-con {
      position: fixed;
      bottom: 0;
      background-color: #fff;
      width: 100%;
      .box {
        background-color: #fff;
        line-height: 0.2rem;
        color:#999;
        text-align: left;
        .title{
          text-align: left;
          font-size: 0.15rem;
          line-height: 0.2rem;
          color:#111;
          padding: 0.2rem;
          border-bottom: solid 1px #f2f2f2;
          .float-left{
            color:#999;
          }
        }
      }

    }
  }

</style>

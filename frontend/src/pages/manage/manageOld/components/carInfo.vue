<template>
    <div class="CarInfo">
        <div class="mask" @click="close"></div>
        <div class="modal searchToast" v-html="data"></div>
    </div>
</template>

<script>
  export default {
    name: "car-info",
    props:['data'],
    data () {
      return {
        show: false
      }
    },
    methods:{
      close(){
        this.show = false
        this.$emit('destroy')
      }
    },
    mounted () {
      this.show = true
    }
  }
</script>

<style lang=less scoped>
    .CarInfo {
        position: fixed;
        width: 100vw;
        height: 100vh;
        top:0;
        left:0;
        .mask {
            position: absolute;
            z-index: 10;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            background-color: rgba(0, 0, 0, .4);
        }
        .searchToast{
            padding: 10px;
            background-color: #fff;
            line-height: 2;
        }
    }
</style>
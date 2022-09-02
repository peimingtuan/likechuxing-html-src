<template>
    <p v-if="show" class="ios_footer fs12">兑换项和活动皆与设备生产商Apple Inc.无关</p>
</template>

<script>
  import env from '../../../../../other_modules/like-env/'

  export default {
    name: "footer-apple",
    data(){
      return {
        show:env.isIos
      }
    }
  }
</script>

<style lang=less scoped>
    .ios_footer{
        margin-top: -0.56rem;
        margin-bottom: 0.76rem;
        color: #999;
        text-align: center;
        line-height: .2rem;
        -webkit-transform: scale(.9);
        transform: scale(.9);
    }
</style>
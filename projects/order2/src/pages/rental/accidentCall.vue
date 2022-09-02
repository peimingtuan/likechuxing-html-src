<template>
  <div class="AccidentCall">
    <p class="desc">
      1. 请您立即拨打 400-666-2333 客服热线处理事故。
    </p>
    <p class="desc">
      2. 在保障安全的情况下，请不要离开现场，并保持手机畅通，以免此期间造成其他损失，给您带来不便。
    </p>
    <div class="btn_con">
      <button class="btn btn-primary btn-block" @click="toTel">联系客服</button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "accident-call",
    methods:{
      toTel(){
        SDK.makePhoneCall('4006662333')
      }
    }
  }
</script>

<style lang="less" scoped>
  .AccidentCall{
    width: auto !important;
    box-sizing: border-box;
    background-color: #fff;
    line-height:0.2rem;
    padding:0.1rem 0;
    margin:0 0.2rem;
    text-align: left;
    .desc{
      margin:0.1rem 0;
    }
    .btn_con{
      position: absolute;
      width: 100%;
      bottom:0;
      height: 0.4rem;
      padding: 0.1rem 0;
      .btn{
        height: 100%;
        font-size: 0.15rem;
      }
    }
  }
</style>

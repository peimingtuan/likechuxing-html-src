<template>
    <div class="PeccancyTips">
        <div class="tip">如有违章，我们会短信通知您</div>
    </div>
</template>

<script>
  export default {
    name: "PeccancyTips"
  }
</script>

<style lang=less>
.PeccancyTips{
    background-color: #fff;
    margin:0.06rem 0.1rem;
    padding: 0.08rem 0.15rem;
    font-size: 12px;
    color:#111;
    border-radius: 2px;
    .tip{
        line-height: 0.2rem;
        padding-left: .24rem;
        background: url('../images/tip.png') no-repeat left;
        background-size: auto 100%;
    }
}
</style>
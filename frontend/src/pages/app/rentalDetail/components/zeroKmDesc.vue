<template>
    <div class="zeroKmDesc">
        <div class="box">
            <div class="text">{{text}}</div>
        </div>
    </div>
</template>

<script>
  export default {
    name: "zeroKmDesc",
    props:['text']
  }
</script>

<style lang=less>
.zeroKmDesc{
    position: absolute;
    top:0;
    z-index: 3;
    width: 100%;
    .box{
        margin: 0.1rem 0.1rem 0;
        background: #FFFCE0;
        border-radius: 2px;
        font-size: 12px;
        padding: 0.05rem 0.15rem;
        .text{
            line-height: 0.2rem;
            color: #999999;
            padding-left: 0.2rem;
            background: url('../images/zeroKmDesc.png') no-repeat left 0.035rem;
            background-size: auto 0.12rem;
        }
    }
}
</style>
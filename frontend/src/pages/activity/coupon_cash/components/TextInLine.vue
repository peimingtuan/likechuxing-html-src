<template>
    <div class="TextInLine " :class="lineColor?'lineColor':''">
        {{text}}
    </div>
</template>

<script>
  export default {
    name: "TextInLine",
    props:['text','lineColor']
  }
</script>

<style lang=less scoped>
.TextInLine{
    line-height: 1;
    font-size:13px;
    color:#FFFFFF;
    text-align: center;

    &::before,&::after{
        content: '';
        display: inline-block;
        width: 12px;
        height: 1px;
        background-color: #FC7C78;
        vertical-align: top;
        margin: 6px 5px 0;
    }
}
.lineColor{
        &::before,&::after{
        content: '';
        display: inline-block;
        width: 8px;
        height: 1px;
        background-color: #CACACC;
        vertical-align: top;
        margin: 6px 5px 0;
    }
}
</style>
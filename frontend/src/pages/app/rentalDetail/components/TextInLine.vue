<template>
    <div class="TextInLine">
        <div class="line"></div>
        <div class="text-box" v-if="text">
            <span class="text">{{text}}</span>
        </div>
    </div>
</template>

<script>
  export default {
    name: "TextInLine",
    props:['text']
  }
</script>

<style lang=less>
    .TextInLine{
        padding: 0.1rem 0;
        position: relative;
        text-align: center;
        line-height: 0.2rem;
        font-size: 12px;
        .line{
            width: 100%;
            height: 1px;
            background-color: #dfdfdf;
        }
        .text-box{
            position: absolute;
            z-index: 11;
            line-height: 1;
            margin-top: -6px;
            top:50%;
            width: 100%;
            .text{
                display: inline-block;
                padding: 0 0.2rem;
                background-color:#f7f7f7;
                color:#999;
            }
        }

    }
</style>
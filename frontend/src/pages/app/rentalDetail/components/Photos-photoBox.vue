<template>
    <div class="Photos-photoBox" :style="'background-image:url('+data.url+');'">
        <div class="title" v-if="data.name">
            <div class="text">{{data.name}}</div>
        </div>
    </div>
</template>

<script>
  export default {
    name: "Photos-photoBox",
    props:['data'],

  }
</script>

<style lang=less scoped>
.Photos-photoBox{
    width: 100%;
    height: 0;
    padding-bottom: 100%;
    border-radius: 2px;
    overflow: hidden;
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;
    .title{
        position: absolute;
        top:0;
        font-size: 12px;
        padding: 0 0.06rem 0 0.03rem;
        background: url('../images/photo_bar.png') no-repeat right;
        background-size: auto 100%;
        opacity: 0.7;
        color:#fff;
        font-weight: 300;
        .text{
            transform: scale(0.8);
        }
    }
}
</style>
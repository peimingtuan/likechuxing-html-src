<template>
    <div class="RightsBox">
        <div class="name">{{data.name}}</div>
        <div class="item" v-for="item in data.items" :key="item">{{item}}</div>
        <div class="total" @click="handleClick">已有 {{data.total}} ></div>
    </div>
</template>

<script>
  export default {
    name: "RightsBox",
    props:['data'],
    methods:{
      handleClick(){
        this.$emit('totalClick',this.data.name)
      }
    }
  }
</script>

<style lang=less scoped>
.RightsBox{
    border:solid 1px #e5e5e5;
    width: 31%;
    margin:0 0.04rem;
    border-radius: 2px;
    font-size: 13px;
    line-height: 1;
    padding: 0.05rem 0 0.35rem;
    position: relative;
    .name{
        margin: 0.1rem 0;
    }
    .item{
        font-size: 12px;
        margin:0.04rem 0;
        color:#ed3800;
    }
    .total{
        font-size: 12px;
        position: absolute;
        bottom:0.12rem;
        width: 100%;
        color:#999;
    }
}
</style>
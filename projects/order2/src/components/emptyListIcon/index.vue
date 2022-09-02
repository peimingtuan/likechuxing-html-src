<template>
  <div class="emptyListIcon">
    <img v-if="type === 'note'" src="./images/note.png"/>
    <img v-if="type === 'alert'" src="./images/alert.png"/>
    <img v-if="type === 'coupon'" src="./images/coupon.png"/>
    <img v-if="type === 'map'" src="./images/map.png"/>
    <img v-if="type === 'gift'" src="./images/gift.png"/>
    {{text || "暂无纪录"}}
  </div>
</template>

<script>
  export default {
    name: 'emptyList',
    props: [
    	'type',
      'text'
    ],
    computed: {
    },
    methods: {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .emptyListIcon{
    font-size: 0.12rem;
    color:#999;
    img{
      width: 40%;
      margin:0 auto 0.1rem;
      padding-top: 1.2rem;
      display: block;
    }
  }
</style>

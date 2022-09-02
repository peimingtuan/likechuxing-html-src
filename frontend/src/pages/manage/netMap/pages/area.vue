<template>
    <div class="area">
        <AreaBox />

    </div>
</template>

<script>
  import AreaBox from '../components/areaBox'

  export default {
    name: "areaPage",
    components: {
      AreaBox
    }
  }
</script>

<style lang=less scoped>
    .area{
        position: absolute;
        top: 10px;
        right: 10px;
    }
</style>
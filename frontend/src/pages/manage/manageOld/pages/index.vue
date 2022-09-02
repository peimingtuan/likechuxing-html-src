<template>
    <div class="container">
        <router-view></router-view>
    </div>
</template>

<script>
  export default {
    name: "index"
  }
</script>

<style lang=less scoped>
.container{
    min-height: 100vh;
}
</style>
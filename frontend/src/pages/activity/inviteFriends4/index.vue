<template>
    <router-view />
</template>

<script>
  export default {
    name: "indexPage",
    mounted(){
      console.log(window.navigator.userAgent)
    }
  }
</script>

<style lang=less>

</style>
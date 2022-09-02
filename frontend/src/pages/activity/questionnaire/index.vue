<template>
    <div class="view">
        <router-view />
    </div>
</template>

<script>
  import appArguments from '../../../../other_modules/app-arguments'

  export default {
    name: "indexPage",
    created(){

    }
  }
</script>

<style lang=less scoped>
    .view{
        position: relative;
        width: 100%;
        min-height: 100vh;
    }
</style>

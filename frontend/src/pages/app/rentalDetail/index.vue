<template>
    <div class="view">
        <keep-alive>
            <router-view />
        </keep-alive>
    </div>
</template>

<script>
  import appArguments from '../../../../other_modules/app-arguments'

  export default {
    name: "indexPage",
    created(){
      if (appArguments.uuid && appArguments.sign) this.$store.commit('setUuid', appArguments)
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
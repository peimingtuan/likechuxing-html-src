<template>
    <div class="Container">
        <router-view class="base view" name="base"></router-view>
        <router-view class="upper view" name="upper"></router-view>
    </div>
</template>

<script>
  export default {
    name: "index",
    data () {
      return {
      }
    }
  }
</script>

<style lang=less>
    .Container {
        & > .view {
            position: absolute;
            top:0;
            left:0;
            width: 100vw;
            min-height: 100vh;
            &.base{
                z-index: 1;
            }
            &.upper{
                z-index: 10;
            }
        }
    }

</style>
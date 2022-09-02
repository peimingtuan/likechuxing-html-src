<template>
    <div class="Demo">
        <transition
                name="custom-classes-transition"
                enter-active-class="animated fast fadeIn"
                leave-active-class="animated fast fadeOut">
            <router-view class="MainView"/>
        </transition>
    </div>
</template>

<script>
  require('../../../../other_modules/css-animate/animate.less')
  export default {
    name: "index"
  }
</script>

<style lang="less">
    @import '../../../css/reset.css';
    @import '../../../css/common.less';

    .Demo {
        position: relative;
        .MainView {
            padding: 0.2rem;
            position: absolute;
            width: 100%;
            box-sizing: border-box;
            top:0;
        }
    }
</style>
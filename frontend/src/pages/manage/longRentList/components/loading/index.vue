<template>
    <div class="loading-box" id="likeLoading">
        <div class="loading">
            <mt-spinner type="fading-circle" color="#44A8EC" :size="40"></mt-spinner>
        </div>
    </div>
</template>
<script>
import { Spinner } from 'mint-ui';
export default {
    name:'loading'
}
</script>
<style lang="less">
    .loading-box{
        position: absolute;
        left: 0;
        top:0;
        width: 100%;
        height: 100%;
        background: #fff;
        z-index: 1000;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>




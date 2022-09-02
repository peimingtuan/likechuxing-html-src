<template>
    <div>
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
</template>
<script>
export default {
    name:'appRoot',
    created(){
        let mobile = sessionStorage.getItem('mobile')
        this.$store.commit('setMobile',mobile)
    }
}
</script>
<style lang="less">
    
</style>



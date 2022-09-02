<template>
    <div class="mint-cell" @click="tap">
        <div class="mint-cell-wrapper ">
            <div class="mint-cell-title">
                <span class="mint-cell-text">
                    {{label}}
                </span>
            </div>
            <div class="mint-cell-value is-link">
                {{value}}
            </div>
            <i class="mint-cell-allow-right"></i>
        </div>             
    </div>
</template>
<script>
export default {
    name:"Cell",
    props:{
        label:String,
        value:String
    },
    methods:{
        tap(){
            this.$emit('tap')
        }
    }
}
</script>
<style lang="less" >

</style>


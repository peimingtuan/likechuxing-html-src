<template>
    <div class="wrap">
        <div class="required" v-show="required">*</div>
        <div class="label">
            {{label}}：
        </div>
        <div class="val">
            <slot name="inputbox"></slot>
        </div>
    </div>
</template>
<script>
export default {
    name:'formCell',
    props:['label','required']
}
</script>
<style lang="less" scoped>
    .wrap{
        display: flex;
        align-items: center;
        min-height: .53rem;
        padding-left: .1rem;
        background: #fff;
        border-bottom:1px solid #f6f6f6;
        .required{
            color: #FF0000 
        }
        .label{
            font-size: .14rem;
            color: #333;
            min-width: .7rem;
        }
        .val{
            flex:1;
            min-height: .53rem;
            display: flex;
            align-items: center;
        }
    }
</style>



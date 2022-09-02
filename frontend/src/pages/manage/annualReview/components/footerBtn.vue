<template>
    <div class="footer">
        <div class="footer-body" :class="active?'active':''" @click="press">
            <span>{{txt}}</span>
        </div>
    </div>
</template>
<script>
export default {
    props:['txt','active'],
    methods:{
        press(){
            this.$emit('press')
        }
    }
}
</script>
<style lang="less" scoped>
    @import url('../css/common.less');
    .footer{
        background:#fff;
        padding: .08rem .1rem;
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        height: .63rem;
        box-shadow: 0 2px 10px 0 rgba(0,0,0,0.16);
        .fc();
        .footer-body{
            flex:1;
            height: 100%;
            background:  #C8C8C8;
            .fc();
            .fco(.16rem,#fff);
            .br();
            &.active{
                background: #4A4A4A;
            }
        }
    }
</style>



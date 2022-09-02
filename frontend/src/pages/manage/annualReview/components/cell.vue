<template>
    <div class="wrap" @click="press">
        <div class="required" v-show="required">*</div>
        <div class="label" :style="{'color':color}">
            {{label}}
        </div>
        <div class="val">
            <div class="icon"></div>
        </div>
    </div>
</template>
<script>
export default {
    name:'cell',
    props:['label','required','color'],
    methods:{
        press(){
            this.$emit('press')
        }
    }
}
</script>
<style lang="less" scoped>
    .wrap{
        display: flex;
        align-items: center;
        height: .53rem;
        padding:0 .1rem;
        background: #fff;
        position: relative;
        &::before{
            content:'';
            width: 100%;
            height: 1px;
            background: #ddd;
            transform: scaleY(.5);
            position: absolute;
            top: 0;
            left: 0;   
        }
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
            height: .53rem;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            .icon{
                width:.09rem;
                height: .14rem;
                background: url('../images/icon_arrow.png') no-repeat;
                background-size: 100% 100%;
            }
        }
    }
</style>



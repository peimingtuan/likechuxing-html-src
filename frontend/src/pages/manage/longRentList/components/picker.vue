<template>
    <div class="wrap">
        <transition name="fade">
            <div class="mask" v-show="show" @click="hide" @touchmove.prevent></div>
        </transition>
        <transition name="slide-up">
            <div class="box" v-show="show">
                <div class="title">
                    <div class="btn" @click="hide">取消</div>
                    <div class="b-title">{{title}}</div>
                    <div class="btn" @click="comfirm">确定</div>
                </div>
                <div class="picker-body" @touchmove.prevent>
                    <mt-picker :slots="list"  @change="onValuesChange"></mt-picker>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
export default {
    name:'picker',
    props:{
        show:Boolean,
        list:Array,
        title:String,
        defaultIndex:Number
    },
    data(){
        return {
            value:[]
        }
    },
    methods:{
        hide(){
            this.$emit('hidePicker')
        },
        onValuesChange(picker,e){
            this.value = e;
        },
        comfirm(){
            this.$emit('selectValue',this.value)
            this.hide();
        }
    }
}
</script>
<style lang="less" scoped>
    .wrap{
        .mask{
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, .5);
            z-index: 130;
        }
        .box{
            position: fixed;
            left: 0;
            bottom: 0;
            width: 100%;
            background: #fff;
            z-index: 131;
        }
        .title{
            display: flex;
            border-bottom: 1px solid #eaeaea;
            .btn{
                flex: 1;
                height: 40px;
                line-height: 40px;
                text-align: left;
                font-size: .14rem;
                color: #5e5e5e;
                &:first-child{
                    padding-left: .2rem;
                }
                &:last-child{
                    padding-right: .2rem;
                    text-align: right;
                }
            }
            .b-title{
                flex: 1;
                height: 40px;
                font-size: .16rem;
                color: #333;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }
    }
    .fade-enter-active,.fade-leave-active{
        transition: opacity .35s;
    }
    .fade-enter,.fade-leave-to{
        opacity: 0;
    }
    .slide-up-enter-active,.slide-up-leave-active{
        transition: transform .35s;
    }
    .slide-up-enter,.slide-up-leave-to{
        transform: translateY(100%)
    }
</style>



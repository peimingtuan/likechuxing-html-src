<template>
    <div class="picker">
        <transition
            name="custom-classes-transition"
            enter-active-class="animated faster slideInUp"
            leave-active-class="animated faster slideOutDown">
            <div class="d-container shadow" @click="showPicker" v-if="data.branch_start">
                <div v-if="timeDesc==''" class="l-label">请选择用车时间</div>
                <div v-if="timeDesc!==''">
                    <span class="label">用车时间:</span>
                    <span>{{timeDesc}}</span>
                </div>
                <div class="arrow" v-if="timeDesc==''"></div>
            </div>
        </transition>
        <div class="picker-view-wrap" v-if="visible">
            <div class="picker-view-mask" :class="aClass[0]" @click="hidePicker"></div>
            <div class="picker-view" :class="aClass[1]">
                <div class="picker-header" slot="top-content">
                    <div class="p-btn" @click="hidePicker">取消</div>
                    <div class="p-btn" @click="comfirmTap">确定</div>
                </div>
                 <mt-picker  :slots="items" @change="pickerChange" class="picker-view-body"/>
            </div> 
        </div>
    </div>
</template>
<script>
import Utils from '../js/utils'
export default {
    props:['data'],
    data(){
        return{ 
            visible:false,
            items:[],
            timeValue:[],
            selectTime:[],
            timeDesc:'',
            aClass:[]
        }
    },
    created(){
        this.items = Utils.initPickerData()
    },
    methods:{
        pickerChange(val1,val2){
            this.timeValue = arguments[1]
        },
        showPicker(){
            this.aClass = ['fade-in','slide-up']
            this.visible = true;
        },
        hidePicker(){
            this.aClass = ['fade-out','slide-down']
            const _this = this
            setTimeout(() => {
                _this.visible = false;
            }, 300);
            
        },
        comfirmTap(){
            let arr = this.timeValue;
            this.selectTime = arr;
            this.timeDesc = arr[0]+' '+arr[2]+' '+arr[1]
            let timeStamp = Utils.initTimeStamp(arr[1]);
            this.$emit('getTimeStamp',timeStamp)
            this.hidePicker()
        }
    }
}
</script>
<style lang="less" scoped>
    .d-container{
        margin-top: .2rem;
        height: .46rem;
        background: #FFFFFF;
        box-shadow: 0 2px 4px 0 rgba(0,0,0,0.10);
        display: flex;
        justify-content: space-between;
        align-items:center;
        padding: 0 .15rem;
        font-family: PingFangSC-Regular;
        font-size: .14rem;
        color: #111111;
        text-align: center;
        .arrow{
            width: .11rem;
            height:.07rem;
            background: url('../images/arrow.png') no-repeat;
            background-size: 100% 100%;
        }
        .label{
            color: #999;
        }
    }
    .picker-header{
        width: 100%;
        height: .5rem;
        background: #fff;
        padding: 0 .2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        &::after{
            content: '';
            width: 100%;
            height: 1px;
            transform: scaleY(0.5);
            background: #DFDFDF;
            position: absolute;
            left: 0;
            bottom:0;
        }
        .p-btn{
            width: .8rem;
            height: .5rem;
            line-height: .5rem;
            &:first-child{
                font-family: PingFangSC-Regular;
                font-size: .15rem;
                color: #999999;
            }
        }
    }
    .picker{
        overflow: hidden;
        .picker-view-wrap{
            width:100%;
            height: 100%;
            position: fixed;
            bottom:0;
            left:0;
            z-index: 100;
            .picker-view-mask{
                width:100%;
                height: 100%;
                position: absolute;
                left: 0;
                right: 0;
                background: rgba(0,0,0,.5);
            }
            .picker-view{
                position: absolute;
                left: 0;
                bottom:0;
                width: 100%;
                background:#fff;
            }
        }
    }
    .fade-in{
        animation: fadeIn ease .3s forwards;
    }
    .fade-out{
        animation: fadeOut ease .3s forwards;
    }
    .slide-up{
        animation: slideUp ease .3s forwards;
    }
    .slide-down{
        animation: slideDown ease .3s forwards;
    }
    @keyframes fadeIn {
    0% {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
    }
    @keyframes fadeOut {
    0% {
        opacity: 1;
    }
    to {
        opacity: 0;
    }
    }
    @keyframes slideUp{
        from{
            transform: translateY(100%)
        }
        to{
            transform: translateY(0)
        }
    }
    @keyframes slideDown{
        from{
            transform: translateY(0)
        }
        to{
            transform: translateY(100%)
        }
    }

</style>

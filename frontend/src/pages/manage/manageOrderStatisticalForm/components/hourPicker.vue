<template>
    <div class="datepicker-wrap">
        <transition name="fade">
            <div class="mask" v-show="show"></div>
        </transition>
        <transition name="slide-up">
            <div class="box-wrap" v-show="show">
                <div class="btn-group">
                    <div class="btn" @click="cancel">取消</div>
                    <div class="desc">请选择时间点（最多可选四个）</div>
                    <div class="btn" @click="comfirm">确定</div>
                </div>
                <div class="body">
                    <div class="item" v-for="(item,index) in hourData" :key="index" :class="[{'disabled':item.disabled,'on':select.indexOf(item.id)!=-1}]" @click="handleItem(index)">{{item.name}}</div>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
import tools from '../js/tools'
import pickerJs from '../js/picker'
import { Toast } from 'mint-ui'
import { mapState } from 'vuex'
export default {
    name:'datePicker',
    props:{
        show:Boolean
    },
    data(){
        return{
            select:[8]
        }
    },
    computed:{
        ...mapState({
            hourData:'hourData',
            selectArray:'selectHourArray'
        })
    },
    watch:{
        selectArray(v){
            this.select = this.selectArray
        }
    },
    methods:{
        handleItem(index,item){

            let arr = this.select.slice()
            let id = this.hourData[index].id
            if(arr.indexOf(id)==-1){
                if(arr.length>3){
                    return 
                }
                arr.push(id)
            }else{
                if(arr.length<2){
                   return 
                }
                arr.splice(arr.indexOf(id),1)
            }
            this.select = arr
        },
        comfirm(){
            this.$store.commit('setSelectHourArray',this.select)
            this.$emit('getData')
            this.hidePicker()
        },
        hidePicker(){
            this.$emit('hidePicker')  
        },
        cancel(){
            this.hidePicker()
            this.select = this.selectArray
        }
    }
}
</script>
<style lang="less" scoped>
    .datepicker-wrap{
        font-size: .14rem;
        .mask{
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, .8);
            position: fixed;
            left: 0;
            top: 0;
        }
        .box-wrap{
            width: 100%;
            // height: 2.36rem;
            background: #fff;
            position: fixed;
            left: 0;
            bottom: 0;
            .btn-group{
                display: flex;
                align-items: center;
                height: .44rem;
                border-bottom: 1px solid #d5d5d3;
                .btn{
                    width:.8rem;
                    height: .44rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .desc{
                    flex:1;
                    font-size: .12rem;
                    text-align: center;
                    color: #5e5e5e;
                }
            }
            .body{
                display: flex;
                flex-wrap: wrap;
                padding: .2rem .225rem;
                .item{
                    width:.55rem;
                    height: .38rem;
                    font-size: .14rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    &.disabled{
                        color: #ccc;
                    }
                    &.on{
                        border: 1px solid #44a8ec;
                        position: relative;
                        &::after{
                            content:'';
                            position: absolute;
                            right: 0; 
                            bottom:-1px;
                            width:.22rem;
                            height: .19rem; 
                            background: url('../image/selectItem.png') no-repeat;
                            background-size: 100% 100%;
                        }
                    }
                }
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



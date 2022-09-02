<template>
    <div class="wrap" >
        <transition name="fade">
            <div class="mask" v-show="show"></div>
        </transition>
        <transition name="slide-up">
            <div class="box" v-show="show">
                <div class="filter-header">
                    <span>筛选</span>
                    <span class="close-btn" @click="closeBox"></span>
                </div>
                <div class="filter-body">
                    <div class="list">
                        <div class="item" 
                            :class="item.isSelected?'active':''" 
                            v-for="(item,index) in selectList" 
                            :key="item.id"
                            @click="changeValue(index)"
                        >
                            {{item.name}}
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
export default {
    name:'likeRadio',
    props:{
        list:Array,
        show:Boolean,
        title:String
    },
    data(){
        return{
           selectList:[]
        }
    },
    created(){
        this.selectList = this.list
    },
    methods:{
        changeValue(index){
            let arr = this.selectList.slice();
            arr.map(item=>{
                item.isSelected = false
            })
            arr[index].isSelected = true;
            this.selectList = arr
            this.confirm()
        },
        getSelectedItem(){
            let arr = this.selectList.slice();
            let res = []
            arr.map(item=>{
                if(item.isSelected){
                    res.push(item)
                }
            })
            return res
        },
        confirm(){
            let data = this.getSelectedItem()
            this.$emit('onChangeValue',data)
            this.closeBox()
        },
        closeBox(){
            this.$emit('hideFilterBox')
        }
    }
}
</script>
<style lang="less" scoped>
    .wrap{
        .mask{
            position: fixed;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,.3);
            z-index: 2018;
        }
        .box{
            position: fixed;
            left: 0;
            bottom: 0;
            width: 100%;
            background: #fff;
            z-index: 2019;
            .filter-header{
                height: .53rem;
                text-align: center;
                line-height: .53rem;
                position: relative;
                font-size: .16rem;
                color: #333;
                position: relative;
                &::after{
                    content:'';
                    width: 100%;
                    height: 1px;
                    background: #ddd;
                    transform: scaleY(.5);
                    position: absolute;
                    bottom: 0;
                    left: 0;
                }
                
                .close-btn{
                    width: .53rem;
                    height: .53rem;
                    background: url('../images/icon_close.png') no-repeat center center;
                    background-size: .4rem .4rem;
                    position: absolute;
                    left: 0;
                    top:0;
                }
            }
            .filter-body{
                .list{
                    .item{
                        height: .53rem;
                        font-size: .13rem;
                        color: #333;
                        padding-left: .15rem;
                        display: flex;
                        align-items: center;
                        position: relative;
                        &.active{
                            color: #4A90E2;
                            &::before{
                                content:'';
                                width: .2rem;
                                height: .54rem;
                                background: url('../images/checked.png') no-repeat center center;
                                background-size: .2rem .16rem;
                                position: absolute;
                                right:.1rem;
                                bottom: 0;
                            }
                        }
                        &::after{
                            content:'';
                            width: 100%;
                            height: 1px;
                            background: #ddd;
                            transform: scaleY(.5);
                            position: absolute;
                            bottom: 0;
                            left: 0;
                        }
                    }
                }
            }
        }
    }
</style>


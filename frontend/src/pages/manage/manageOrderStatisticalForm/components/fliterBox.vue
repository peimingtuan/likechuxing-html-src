<template>
    <div class="wrap">
        <transition name="fade">
            <div class="mask" v-show="show" @click="hide" @touchmove.prevent></div>
        </transition>
        <transition name="slide-up">
            <div class="box" v-show="show">
                <div class="header">
                    <div>筛选</div>
                    <div class="close-btn" @click="hide"></div>
                </div>
                <div class="title">{{title}}</div>
                <div class="list">
                    <div class="item-box" v-for="(item,index) in list" :key="item.id" @click="select(index)">
                        <div class="item" :class="currentIndex==index?'on':''">{{item.name}}</div>
                    </div>
                </div>
                <div class="title" v-show="isShowType">牌照类型</div>
                <div class="list" v-show="isShowType">
                    <div class="item-box" v-for="(item,index) in typeList" :key="item.id" @click="selectType(index)">
                        <div class="item" :class="typeIndex==index?'on':''">{{item.name}}</div>
                    </div>
                </div>
                <div class="btn" @click="comfirm">确定</div>
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
        defaultValue:String
    },
    data(){
        return{
            currentIndex:'',
            typeIndex:'',
            typeList:[
                {
                    id:1,
                    name:'全部'
                },
                {
                    id:2,
                    name:'非粤A'
                },
                {
                    id:3,
                    name:'粤A'
                }
            ]
        }
    },
    computed:{
        isShowType(){
            let item = this.list[this.currentIndex]
            if(!item){
                return false
            }
            if(item.id==197|item.id==202){
                return true
            }else{
                return false
            }
        }
    },
    created(){
        this.currentIndex = this.defaultValue
    },
    methods:{
        hide(){
            this.$emit('hideFliterBox')
        },
        comfirm(){
            this.$emit('selectValue',this.currentIndex)
            this.hide();
        },
        select(i){
            this.currentIndex = parseInt(i)
        },
        selectType(i){
            this.typeIndex = parseInt(i)
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
        }
        .box{
            position: fixed;
            left: 0;
            bottom: 0;
            width: 100%;
            background: #fff;
            padding: 0 .11rem .11rem;
            .header{
                height: .385rem;
                text-align: center;
                line-height: .385rem;
                position: relative;
                font-size: .15rem;
                color: #5e5e5e;
                margin-bottom: .3rem;
                .close-btn{
                    width:.385rem;
                    height: .385rem;
                    background: url('../image/icon_close.png') no-repeat;
                    background-size: 100% 100%;
                    position: absolute;
                    top:0;
                    right: -.11rem;
                }
            }
            .title{
                font-size: .12rem;
                color: #9e9e9e;
            }
            .list{
                display: flex;
                flex-wrap: wrap;
                -webkit-flex-wrap:wrap;
                -webkit-box-lines:multiple;
                -moz-flex-wrap:wrap;
                -ms-flex-wrap:wrap;
                padding-top: .13rem;
                .item-box{
                    width: 25%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    .item{
                        width:.75rem;
                        height: .26rem;
                        text-align: center;
                        line-height: .26rem;
                        color:#626262;
                        font-size: .14rem;
                        border: 1px solid #cdcdcd;
                        border-radius: 2px;
                        margin-bottom: .2rem;
                        &.on{
                            color: #fff;
                            background: #333;
                            border: 1px solid #333;
                        }
                    }
                }   
            }
            .btn{
                height:.45rem;
                background: #333;
                color: #fff;
                font-size: .16rem;
                text-align: center;
                line-height: .45rem;
                border-radius: 2px;
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



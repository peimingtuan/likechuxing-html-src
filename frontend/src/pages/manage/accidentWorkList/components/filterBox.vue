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
                    <div class="desc">处理进度</div>
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
                <div class="filter-footer">
                    <div class="btn" @click="reset">重置</div>
                    <div class="btn comfirm" @click="confirm">确定</div>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
export default {
    name:'filterBox',
    props:{
        list:Array,
        type:String,
        show:Boolean
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
            if(this.type=='radio'){
                let arr = this.selectList.slice();
                arr.map(item=>{
                    item.isSelected = false
                })
                arr[index].isSelected = true;
                this.selectList = arr
            }else{
                if(index==0){
                    this.reset()
                }else{
                    this.selectList[0].isSelected = false
                    this.selectList[index].isSelected = !this.selectList[index].isSelected
                } 
            }
        },
        reset(){
            let arr = this.selectList.slice();
            arr.map(item=>{
                item.isSelected = false
            })
            this.selectList = arr
            this.selectList[0].isSelected = true
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
            background: rgba(0,0,0,.8);
            z-index: 2018;
        }
        .box{
            position: fixed;
            left: 0;
            bottom: 0;
            width: 100%;
            background: #fff;
            z-index: 2019;
            padding: .1rem;
            .filter-header{
                height: .37rem;
                text-align: center;
                line-height: .37rem;
                position: relative;
                font-size: .16rem;
                color: #333;
                .close-btn{
                    width: .37rem;
                    height: .37rem;
                    background: url('../images/icon_close.png') no-repeat center center;
                    background-size: 100% 100%;
                    position: absolute;
                    left: -.1rem;
                    top:0;
                }
            }
            .filter-body{
                .desc{
                    font-size: .12rem;
                    color: #999;
                    margin-bottom: .13rem;
                }
                .list{
                    display: flex;
                    flex-wrap: wrap;
                    justify-content:space-between;
                    .item{
                        height: .27rem;
                        padding: 0 .12rem;
                        line-height: .27rem;
                        text-align: center;
                        font-size: .12rem;
                        color: #333;
                        border-radius: 2px;
                        border:1px solid #CDCDCD;
                        margin-bottom: .16rem;
                        &.active{
                            color: #fff;
                            background: #333;
                        }
                        &:last-child{
                            margin-left: .1rem;
                        }
                    }
                    &::after{
                        content: '';
                        flex: auto;
                    }
                }
            }
            .filter-footer{
                padding-top: .1rem;
                display: flex;
                justify-content:space-between;
                .btn{
                    width:1.7rem;
                    height: .44rem;
                    text-align: center;
                    line-height: .44rem;
                    background: #D8D8D8;
                    color: #666;
                    font-size: .16rem;
                    border-radius: 2px;
                    &.comfirm{
                        background: #333;
                        color: #fff;
                    }
                }
            }
        }
    }
</style>


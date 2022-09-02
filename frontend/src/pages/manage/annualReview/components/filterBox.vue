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
                    <div class="desc">{{title||'违章情况'}}</div>
                    <div class="list">
                        <div class="item" 
                            :class="item.isSelected?'active':''" 
                            v-for="(item,index) in selectList" 
                            :key="item.id"
                            @click="changeValue(index)"
                        >
                            <div class="icon"></div>
                            <div class="label">{{item.name}}</div>
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
                padding: .16rem;
                .desc{
                    font-size: .12rem;
                    color: #999;
                    margin-bottom: .13rem;
                }
                .list{
                    display: flex;
                    align-items: center;
                    .item{
                        width:1.08rem;
                        height: .3rem;
                        font-size: .13rem;
                        color: #666;
                        margin-right: .1rem;
                        display: flex;
                        align-items: center;
                        justify-content:center;
                        .icon{
                            width: .14rem;
                            height: .14rem;
                            border: 1px solid #d8d8d8;
                            border-radius: 100%;
                            background: #fff;
                            background-size: 100% 100%;
                            margin-right: .06rem;
                        }
                        &.active{
                            .icon{
                                border: none;
                                border-radius: 0;
                                background: url('../images/selected.png') no-repeat;
                                background-size: 100% 100%;
                            }
                            .label{
                                color: #007BFF;
                            }
                        }
                        &:last-child{
                            margin-right: 0;
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
                    flex:1;
                    height: .44rem;
                    text-align: center;
                    line-height: .44rem;
                    color: #007BFF;
                    font-size: .16rem;
                    box-shadow: 0 -1px 3px 0 rgba(0,0,0,0.08);
                    &.comfirm{
                        background: #007BFF;
                        color: #fff;
                    }
                }
            }
        }
    }
</style>


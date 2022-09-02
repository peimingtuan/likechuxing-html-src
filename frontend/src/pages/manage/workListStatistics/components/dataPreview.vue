<template>
    <div class="wrap">
        <div class="list">
            <div class="row">
                <div class="day">
                    <div class="item title"></div>
                    <div class="item" :class="{'on':item===0||item===6}"  v-for="(item,index) in list.day" :key="index">{{item|filterDay}}</div>
                </div>
                <div class="date">
                    <div class="item title">日期</div>
                    <div class="item" v-for="(item,index) in list.date" :key="index" :class="{'border':dayIndex.indexOf(index)!=-1}">{{item}}</div>
                </div>
                <div class="scroll">
                    <div class="scroll-title">
                        <div class="item" v-for="(item,index) in list.labelList" :key="index">{{item}}</div>
                    </div>
                    <div class="data-wrap">
                        <div class="data-item" v-for="(dataItem,index) in list.data" :key="index">
                            <div class="item" v-for="(i,index) in dataItem.value" :key="index" :class="{'border':dayIndex.indexOf(index)!=-1}">
                                {{i}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props:['list'],
    computed:{
        dayIndex(){
            let res = []
            if(!this.list.day){
                return []
            }
            this.list.day.map((item,index)=>{
                if(item==0){
                    res.push(index)
                }
            })
            return res
        }
    },
    filters:{
        filterDay(v){
            if(v==0){
                return '日'
            }else if(v==6){
                return '六'
            }else{
                return ''
            }
        }
    }
}
</script>
 <style lang="less" scoped>
    .wrap{
        padding: .25rem 0;
        .list{
            width:100%;
            background: #fff;
            font-size: 12px;
            .item{
                min-width:.8rem;
                height: .35rem;
                display: flex;
                justify-content: center;
                align-items:center;
                color: #5e5e5e;
            }
            .row{
                display: flex;
                .date{
                    min-width:.6rem;
                    .item{
                        color: #333;
                        min-width:.6rem;
                    }
                    .title{
                        height: .5rem;
                        background: #f4fbff;
                    }
                }
                .day{
                   width:.6rem;
                   min-width: 0;
                    .item{
                        border-left: 1px solid #ECECEC;
                        color: #999;
                        position: relative;
                        min-width: 0;
                        width:.6rem;
                        &.on{
                            border-top:1px solid #fff;
                            &::after{
                                content: '';
                                position: absolute;
                                left: .1rem;
                                top:.15rem;
                                width:.05rem;
                                height: .05rem;
                                background: #D8D8D8;
                                border-radius: 100%;
                            }
                        }
                        &::before{
                            content: '';
                            position: absolute;
                            left: .115rem;
                            top:.15rem;
                            width:1px;
                            height: 100%;
                            background: #ECECEC;
                        }
                        &:last-child{
                        &::before{
                                content: '';
                                position: absolute;
                                left: .115rem;
                                top:0;
                                width:1px;
                                height: 100%;
                                background: #ECECEC;
                            } 
                        }
                    }
                    .title{
                        width:.6rem;
                        height: .5rem;
                        background: #f4fbff;
                        min-width: 0;
                        &::before{
                            width:0;
                        }
                    }
                }
                .scroll{
                    overflow-x: auto;
                    .scroll-title{
                        display: flex;
                        .item{
                            height: .5rem;
                            color: #333;
                            background: #f4fbff;
                        }
                    }
                }
                .data-wrap{
                    display: flex;
                    flex-direction: row; 
                }
            }
            .border{
                border-top: 1px solid #E7E7E7; 
            }
        }
    }
</style>



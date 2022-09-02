<template>
    <div class="data-wrap">
        <div class="day">
            <div class="title">
            </div>
            <div class="col" :class="{'on':item===0||item===6}" v-for="(item,index) in tableData.day" :key="index">{{item|filterDay}}</div>
        </div>
        <div class="date" :class="{'date-type':type!=1}">
            <div class="title">
                <div class="col">{{type==1?'时间点':'日期'}}</div>
            </div>
            <div class="col" v-for="(item,index) in tableData.leftLabel" :key="index" :class="{'border':dayIndex.indexOf(index)!=-1}">{{item}}</div>
        </div>
        <div class="data">
            <div class="num-wrap">
                <div class="title">
                    <div class="label">数量</div>
                    <div class="row" v-show="tableData.titleLabel.length>1">
                        <div class="label-item" v-for="(item,index) in tableData.titleLabel" :key="index">{{item}}{{type==1?'':'点'}}</div>
                    </div>
                </div>
                <div class="num-data">
                    <div class="num1">
                        <div class="col" v-for="(item,index) in tableData.res.count1" :key="index" :class="{'border':dayIndex.indexOf(index)!=-1}" >{{item}}</div>
                    </div>
                    <div class="num2" v-show="tableData.titleLabel.length>1">
                        <div class="col" v-for="(item,index) in tableData.res.count2" :key="index" :class="{'border':dayIndex.indexOf(index)!=-1}">{{item}}</div>
                    </div>
                    <div class="num3"  v-show="tableData.titleLabel.length>2">
                        <div class="col" v-for="(item,index) in tableData.res.count3" :key="index" :class="{'border':dayIndex.indexOf(index)!=-1}">{{item}}</div>
                    </div>
                    <div class="num4"  v-show="tableData.titleLabel.length>3">
                        <div class="col" v-for="(item,index) in tableData.res.count4" :key="index" :class="{'border':dayIndex.indexOf(index)!=-1}">{{item}}</div>
                    </div>
                </div>
            </div>
            <div class="percent-wrap">
                <div class="title">
                    <div class="label">占比</div>
                    <div class="row" v-show="tableData.titleLabel.length>1">
                        <div class="label-item" v-for="(item,index) in tableData.titleLabel" :key="index">{{item}}{{type==1?'':'点'}}</div>
                    </div>
                </div>
                <div class="percent-data">
                    <div class="percent1">
                        <div class="col" v-for="(item,index) in tableData.res.percent1" :key="index" :class="{'border':dayIndex.indexOf(index)!=-1}">{{item}}%</div>
                    </div>
                    <div class="percent2"  v-show="tableData.titleLabel.length>1">
                        <div class="col" v-for="(item,index) in tableData.res.percent2" :key="index" :class="{'border':dayIndex.indexOf(index)!=-1}">{{item}}%</div>
                    </div>
                    <div class="percent3"  v-show="tableData.titleLabel.length>2">
                        <div class="col" v-for="(item,index) in tableData.res.percent3" :key="index" :class="{'border':dayIndex.indexOf(index)!=-1}">{{item}}%</div>
                    </div>
                    <div class="percent4" v-show="tableData.titleLabel.length>3">
                        <div class="col" v-for="(item,index) in tableData.res.percent4" :key="index" :class="{'border':dayIndex.indexOf(index)!=-1}">{{item}}%</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name:'dataPreview',
    props:['tableData','type'],
    computed:{
        dayIndex(){
            let res = []
            if(!this.tableData.day){
                return []
            }
            this.tableData.day.map((item,index)=>{
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
    .data-wrap{
        min-width: 100%;
        display: flex;
        font-size: .12rem;
        .col{
            min-width:.8rem;
            height: .35rem;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .row{
            display: flex;
            height: .35rem;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .date{
            &.date-type{
                .col{
                    width:.6rem;
                    min-width: 0;
                    height: .35rem;
                    display: flex;
                    justify-content:flex-start;
                    align-items: center;
                    padding-left: .1rem;
                }
            }
            .col{
                width:.8rem;
                min-width: 0;
                height: .35rem;
                display: flex;
                justify-content:center;
                align-items: center;
            }
            &.on{
                .col{
                    width:.8rem
                }
            }
        }
        .data{
            flex:1;
            display: flex;
            overflow-x: auto;
            .title{
                .label{
                    flex:1;
                    width:100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .row{
                    width:100%;
                    flex:1;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    .label-item{
                        flex:1;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                }
            }
            .num-wrap{
                flex:1;
                .num-data{
                    display: flex;
                    justify-content: center;
                    &>div{
                        flex:1;
                    }
                }
            }
            .percent-wrap{
                flex:1;
                .percent-data{
                    display: flex;
                    justify-content: center;
                    &>div{
                        flex:1;
                    }
                }
            }
        }
        .title{
            background: #f4fbff;
            height: .5rem;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
        }
        .day{
            .col{
                padding-left: .2rem;
                width:.5rem;
                min-width: 0;
                border-left: 1px solid #ECECEC;
                color: #999;
                position: relative;
                &.on{
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
        }
        .border{
            border-bottom: 1px solid #E7E7E7; 
        }
    }
</style>


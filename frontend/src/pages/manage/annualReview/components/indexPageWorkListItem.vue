<template>
    <div class="wrap" @click="press">
        <div class="row">
            <div class="plate">{{plate_no}}</div>
            <div class="num">({{vin}})</div>
            <div class="status">{{carStatus}}</div>
        </div>
        <div class="row car-info">
            <span>{{model_name}}</span>
            <span class="divider" v-show="!fromType">|</span>
            <span v-show="!fromType">{{color}}</span>
            <span class="divider" v-show="fromType">|</span>
            <span v-show="fromType">{{car_factory_name}}</span>
            <span class="divider" v-show="fromType">|</span>
            <span v-show="fromType">约续航 {{remain_km}} 公里</span>
        </div>
        <div class="row addr">
            <div class="icon"></div>
            <div>{{branch}} {{parking_floor}} 层 {{parking_no}} 车位</div>
        </div>
        <div class="dashed" v-show="type==='indexItem'">
            <div class="status-row">
                <div class="label" :class="progress?'on':''">{{status}}</div>
                <div class="desc">年检{{id}}</div>
            </div>
            <div class="time">工单时长：{{time}}</div>
        </div>
    </div>
</template>
<script>
export default {
    name:'indexPageWorkListItem',
    props:['plate_no','vin','status','model_name','color','branch','time','carStatus','type','id','parking_no','parking_floor','car_factory_name','fromType','remain_km'],
    computed:{
        progress(){
            if(this.status=='已完成'){
                return true
            }else{
                return false
            }
        }
    },
    methods:{
        press(){
            this.$emit('press')
        }
    }
}
</script>
<style lang="less" scoped>
    @import url('../css/common.less');
    .wrap{
        padding: .1rem;
        background: #fff;
        margin-bottom: .1rem;
        .row{
            .fd();
            .plate{
                font-size: .14rem;
                color: #333333;
            }
            .num{
                font-size: .14rem;
                color: #999;
                margin:  0 .1rem;
            }
            .status{
                padding: 0 .02rem;
                border: 1px solid #CDCDCD;
                border-radius: 2px;
                font-size:.11rem;
                color: #5e5e5e;
            }
        }
        .car-info{
            margin:.03rem 0 .1rem;
            font-size: .11rem;
            color: #666;
            .divider{
                margin: 0 .04rem;
            }
        }
        .addr{
            .fco(.12rem,#666);
            margin-top: .1rem;
            margin-bottom: .1rem;
            .icon{
                width:.13rem;
                height: .17rem;
                background: url('../images/map-B.png') no-repeat;
                background-size: 100% 100%;
                margin-right: .1rem;
            }
        }
        .dashed{
            border: 1px dashed #E6E6E6;
            border-radius: 2px;
            .status-row{
                .fb();
                padding-right: .1rem;
                padding-top: .05rem;
                .label{
                    border-left: 3px solid #FFA500;
                    padding-left: .07rem;
                    .fco(.12rem,#FFA500);
                    &.on{
                        border-left: 3px solid #7FD51D;
                        color: #7FD51D 
                    }
                }
                .desc{
                    .fco(.12rem,#666);
                }
            }
            .time{
                margin-top: .05rem;
                .fco(.12rem,#666);
                padding-left: .1rem;
                padding-bottom: .08rem;
            }
        }
    }
</style>



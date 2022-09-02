<template>
    <div class="wrap" @click="press">
        <div class="row">
            <div class="plate">{{plate_no}}</div>
            <div class="num">({{vin}})</div>
            <div class="status">{{status}}</div>
        </div>
        <div class="row car-info">
            <span>{{model_name}}</span>
            <span class="divider">|</span>
            <span>{{color}}</span>
        </div>
        <div class="row addr">
            <div class="icon"></div>
            <div>{{branch}} {{parking_floor}} 层 {{parking_no}} 车位</div>
        </div>
        <div class="row time" :style="{paddingBottom:peccancy_num?0:'.1rem'}">最迟年检日期：{{time}}</div>
        <div class="tip-row" v-show="peccancy_num" @click.stop="goViolationInfo">{{peccancy_num}}条违章未处理</div>
    </div>
</template>
<script>

export default {
    name:'indexPageTipListItem',
    props:['plate_no','vin','status','model_name','color','branch','time','peccancy_num','id','parking_no','parking_floor','car_id'],
    methods:{
        goViolationInfo(){
            let { id, plate_no, vin, status, model_name, branch, time, car_id } = this
            this.$router.push({path:'violationInfo',query:{id,car_id,time}})
        },
        press(){
            this.$emit('press')
        }
    }
}
</script>
<style lang="less" scoped>
    @import url('../css/common.less');
    .wrap{
        padding: .1rem .1rem 0;
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
            .icon{
                width:.13rem;
                height: .17rem;
                background: url('../images/map-B.png') no-repeat;
                background-size: 100% 100%;
                margin-right: .1rem;
            }
        }
        .time{
            .fco(.12rem,rgb(92, 90, 90));
            margin: .11rem 0 .09rem;
        }
        .tip-row{
            height: .36rem;
            position: relative;
            .fb();
            .fco(.12rem,#FD5264);
            &::after{
                content:'';
                width: 100%;
                height: 1px;
                background: #ddd;
                transform: scaleY(.5);
                position: absolute;
                top: 0;
                left: 0;
            }
        }
    }
</style>



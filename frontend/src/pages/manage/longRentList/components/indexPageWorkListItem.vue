<template>
    <div class="wrap" @click="goCarDetail">
        <div class="row">
            <div class="plate">{{plate_no}}</div>
            <div class="num">({{vin}})</div>
            <div class="status">{{carStatus}}</div>
        </div>
        <div class="row car-info">
            <span>{{model_name}}</span>
            <span class="divider">|</span>
            <span >{{color}}</span>
            <span class="divider" >|</span>
            <span >约续航 {{remain_km}} 公里</span>
        </div>
        <div class="limit" v-if="car_limit.length">
            <div class="link" :class="car_limit[0].limit?'rb':'gb'">
                <div class="col1">今</div>
                <div class="col2" :class="car_limit[0].limit?'red':'green'">{{car_limit[0].limit | filterLimit}}</div>
            </div>
            <div class="link" :class="car_limit[1].limit?'rb':'gb'">
                <div class="col1">明</div>
                <div class="col2" :class="car_limit[1].limit?'red':'green'">{{car_limit[1].limit | filterLimit}}</div>
            </div>
            <div class="limit-item" :class="car_limit[2].limit?'red':'green'">{{car_limit[2].limit | filterLimit}}</div>
            <div class="limit-item" :class="car_limit[3].limit?'red':'green'">{{car_limit[3].limit | filterLimit}}</div>
            <div class="limit-item" :class="car_limit[4].limit?'red':'green'">{{car_limit[4].limit | filterLimit}}</div>
        </div>
        <div class="row addr">
            <div class="icon"></div>
            <div>{{branch}}</div>
        </div>
        <div class="dashed">
            <div class="time">
                <span class="label">整备时长：</span>
                <span>{{time}}</span>
            </div>
            <div class="delete-btn" @click.stop="press"></div>
        </div>
        <div class="remark">
            <span class="label">备注</span>
            <span>{{remark}}</span>
        </div>
    </div>
</template>
<script>
export default {
    name:'indexPageWorkListItem',
    props:['plate_no','vin','carStatus','model_name','color','branch','time','remain_km','remark','car_limit'],
    methods:{
        press(){
            this.$emit('press')
        },
        goCarDetail(){
            window.location.href = './../manageOrderCardetail/index.html?plate_no='+this.plate_no
        }
    },
    filters:{
        filterLimit(v){
            if(v==0){
                return '开'
            }else if(v==1){
                return '停'
            }else{
                return '待'
            }
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
        .limit{
            margin-bottom: .1rem;
            .fd();
            .limit-item{
                width: .16rem;
                height: .16rem;
                color:#fff;
                font-size: .11rem;
                border-radius: 2px;
                margin-right: .05rem;
                .fc();
            }
            .green{
                background:#77D777;
            }
            .red{
                background: #FF858C
            }
            .link{
                width: .32rem;
                height: .16rem;
                border-radius: 2px;
                margin-right: .05rem;
                font-size: .11rem;
                overflow: hidden;
                .fd();
                color: #fff;
                .col1{
                    color: #666;
                    flex: 1;
                    .fc();
                }
                .col2{
                    flex: 1;
                    .fc();
                }
                
            }
            .gb{
                border: 1px solid #77D777
            }
            .rb{
                border: 1px solid #FF858C
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
        .dashed{
            border-bottom: 1px dashed #E6E6E6;
            height:.37rem;
            margin-bottom: .09rem;
            .fb();
            .time{
                .fco(.12rem,#151515);
                .label{
                    color: #666;
                }
            }
            .delete-btn{
                width:.2rem;
                height: .197rem;
                background: url('../images/delete-btn.png') no-repeat;
                background-size: 100% 100%;
            }
        }
        .remark{
            .fco(.12rem,#151515);
            .label{
                color: #666;
            }
        }
    }
</style>



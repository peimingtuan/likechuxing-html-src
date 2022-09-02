<template>
    <div class="container">
        <div class="info-wrap">
            <div class="title">用户赔付信息详情</div>
            <div class="cell">
                <div class="label">垫付费用（元）：</div>
                <div class="val">{{info.user_money}}</div>
            </div>
            <div class="cell">
                <div class="label">不计免赔抵扣金额（元）：</div>
                <div class="val">{{info.deduction_money}}</div>
            </div>
            <div class="cell">
                <div class="label">立刻维修费（元）：</div>
                <div class="val">{{info.repair_fee}}</div>
            </div>
            <div class="cell">
                <div class="label">车辆折旧费（元）：</div>
                <div class="val">{{info.old_money}}</div>
            </div>
            <div class="cell">
                <div class="label">保险上浮费（元）：</div>
                <div class="val">{{info.insurance_up_money}}</div>
            </div>
            <div class="cell">
                <div class="label">停运费（元）：</div>
                <div class="val">{{info.off_money}}</div>
            </div>
            <div class="cell">
                <div class="label">拖车费（元）：</div>
                <div class="val">{{info.car_money}}</div>
            </div>
            <div class="cell">
                <div class="label">需退款（元）：</div>
                <div class="val">{{info.back_money}}</div>
            </div>
            <div class="cell">
                <div class="label">需补缴（元）：</div>
                <div class="val">{{info.supply_money}}</div>
            </div>
        </div>
        <div class="remark-wrap">
            <div class="title">备注：</div>
            <div class="desc">{{info.remark}}</div>
        </div>
    </div>
</template>
<script>
import Cell from '../components/cell'
import { Toast } from 'mint-ui';
import tool from '../js/tools'
import http from '../js/http'
import api from '../js/api'
import { DDBase } from '../../../../../other_modules/like-manageOrder/ddSDK'

export default {
    components:{
        Cell
    },
    data(){
        return {
            info:{}
        }
    },
    created(){
        DDBase.setWebTitle('用户赔付信息详情')
        this.getInfo()
    },
    methods:{
        getInfo(){
            let { mobile } = this.$store.state
            let { order_id } = this.$store.state.workDetail
            const _this = this;
            http.post(api('/vehicle-accident/item-result'),{
                mobile,
                order_id,
                item_id:14
            }).then(res=>{
                if(res.status===0){
                    _this.info = res.data
                }else{
                    Toast(res.msg)
                }
            }).catch(err=>{
                console.log(err)
            })
        }
    },
    filters:{
        filterTime(str){
            return tool.timestampToDate(str)   
        }
    }
}
</script>
<style lang="less" scoped>
    .container{
        min-height: 100vh;
        background: #f6f6f6;
        .info-wrap{
            padding: .12rem;
            background: #fff;
            .title{
                font-family: PingFangSC-Regular;
                font-size: .14rem;
                color: #656565;
            }
            .cell{
                padding-left: .2rem;
                height: .22rem;
                display: flex;
                align-items: center;
                font-size: .12rem;
                .label{
                    width: 1.5rem;
                    color: #999;
                }
                .val{
                    color: #000;
                }
            }
        }
        .row{
            background: #fff;
            margin: .1rem auto;
        }
        .history{
            padding: .1rem;
            background: #fff;
            .title{
                font-family: PingFangSC-Light;
                font-size: .14rem;
                color: #333;
                height: .3rem;
                line-height: .3rem;
            }
            .item{
                display: flex;
                align-items: center;
                height: .22rem;
                div{
                    margin-right: .2rem;
                    color: #666
                }
            }
        }
        .remark-wrap{
            margin-top: .15rem;
            background: #fff;
            padding: .15rem;
            font-size: .13rem;
            color: #5e5e5e;
            .title{
                height: .26rem;
            }
            .desc{
                line-height: .22rem;
            }
        }
    }
</style>



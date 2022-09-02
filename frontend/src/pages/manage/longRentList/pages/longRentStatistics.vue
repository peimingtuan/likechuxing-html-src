<template>
    <div class="container">
        <div class="header">
            <div class="item" @click="showPicker(1)">
                <span class="text">{{startDate}}</span>
                <span class="icon"></span>
            </div>
            <div class="divier">至</div>
            <div class="item" @click="showPicker(2)">
                <span class="text">{{endDate}}</span>
                <span class="icon"></span>
            </div>
            <div class="des" @click="openDesc()"></div>
        </div>
        <div class="list">
            <div class="item" v-for="(item,index) in list" :key="index">
                <div class="city-stat">
                    <div class="city">{{item.city_name}}</div>
                    <div class="row row1">
                        <div class="col">
                            <span>网点数：</span>
                            <span>{{item.branch_num}}</span>
                        </div>
                        <div class="col">
                            <span>预约数：</span>
                            <span>{{item.order_num}}</span>
                        </div>
                        <div class="col">
                            <span>认证数：</span>
                            <span>{{item.auth_num}}</span>
                        </div>
                        
                    </div>
                    <div class="row">
                        <div class="col">
                            <span>整备数：</span>
                            <span>{{item.prepare_num}}</span>
                        </div>
                        <div class="col">
                            <span>完成数：</span>
                            <span>{{item.finish_num}}</span>
                        </div>
                    </div>
                </div>
                <div class="car-list">
                    <div class="car-list-item" v-for="(carItem,index) in item.stat" :key="index">
                        <div class="model">
                            <span>{{carItem.car_model}}：</span>
                            <span class="num">{{carItem.qty}}</span>
                        </div>
                        <div class="status">
                            <span>已完成：</span>
                            <span class="num">{{carItem.car_qty}}</span>
                        </div class="status">
                        <div>
                            <span>整备中：</span>
                            <span class="num">{{carItem.prepare_qty}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <mt-datetime-picker
            ref="startDatePicker"
            type="date"
            :startDate="new Date('2019-01-25')"
            :endDate="new Date('2019-02-01')"
            @confirm="getStartDate"
        >
        </mt-datetime-picker>
        <mt-datetime-picker
            ref="endDatePicker"
            type="date"
            :startDate="new Date('2019-01-25')"
            :endDate="new Date('2019-02-01')"
            @confirm="getEndDate"
        >
        </mt-datetime-picker>
        <LongRentStatDesc :show="showDesc" @closeDesc="closeDesc"/>
    </div>
</template>
<script>
import http from '../js/http'
import api from '../js/api'
import tools from '../js/tools'
import { Toast, DatetimePicker } from 'mint-ui'
import LongRentStatDesc from '../components/longRentStatDesc.vue'

export default {
    name:'longRentStat',
    components:{
        LongRentStatDesc
    },
    data(){
        return  {
            startDate:'',
            endDate:'',
            list:[],
            showDesc:false,
        }
    },
    created(){
        this.$showLoading('longRentStat')
        //设置默认时间
        this.startDate = tools.initDate(new Date('2019-01-25'))
        this.endDate = tools.initDate(new Date('2019-02-01'))
        this.postRequest()
    },
    methods:{
        postRequest(){

            let mobile = sessionStorage.getItem('mobile')
            let { startDate, endDate } = this;
            let data = {
                mobile,
                start_date:startDate,
                end_date:endDate
            }
            const _this = this;
            http.post(api('/long-rental/stat'),data).then(res=>{
                if(res.status===0){
                    _this.list = res.data
                    this.$hideLoading('longRentStat')
                }else{
                    Toast(res.msg)
                }
            }).catch(err=>{
                console.log(err)
            })
        },
        getStartDate(v){
            this.startDate = tools.timestampToDate(v)
            this.postRequest()
        },
        getEndDate(v){
            this.endDate = tools.timestampToDate(v)
            this.postRequest()
        },
        showPicker(index){
            if(index===1){
                this.$refs.startDatePicker.open();
            }else{
                this.$refs.endDatePicker.open();
            }
           
        },
        openDesc(){
            this.showDesc = true
        },
        closeDesc(){
            this.showDesc = false
        }
    }
}
</script>
<style lang="less" scoped>
    @import url('../css/common.less');
    .container{
        background: #F6F6F6;
        min-height: 100vh;
        font-size: .12rem;
        .header{
            height: .44rem;
            background: #fff;
            padding: .1rem 0;
            position: relative;
            .fc();
            .item{
                width: 1.08rem;
                height: .24rem;
                .fc();
                .fco(.14rem,#333);
                background: #FFFFFF;
                border: 1px solid #999999;
                .icon{
                    width:.09rem;
                    height: .04rem;
                    margin-left: .075rem;
                    background: url('../images/icon_drop.png') no-repeat;
                    background-size: 100% 100%;
                }
            }
            .divier{
               .fco(.14rem,#666); 
               margin: 0 .11rem;
            }
            .des{
                width:.3rem;
                height: .3rem;
                position: absolute;
                right: .16rem;
                top: 50%;
                margin-top: -.15rem;
                background: url('../images/icon_desc.png') no-repeat center center;
                background-size: 50% 50%;
            }
        }
        .list{
            padding: .15rem;
            .item{
                padding: .16rem .1rem;
                background: #fff;
                margin-bottom: .1rem;
                .city-stat{
                    padding: 0 .06rem;
                    border-bottom: 1px dashed #E9E9E9;
                    .city{
                        .fco(.14rem,#333);
                    }
                    .row{
                        .fd();
                        .col{
                            width:33.33333%;
                            .fco(.12rem,#666)
                        }
                    }
                    .row{
                        margin: .07rem 0;
                    }
                }
                .car-list{
                    margin-top: .09rem;
                    .car-list-item{
                        position: relative;
                        padding-left: 11px;
                        margin-bottom: .05rem;
                        &::before{
                            content: '';
                            position: absolute;
                            top:50%;
                            left: 0;
                            width: 6px;
                            height: 6px;
                            background: #108EE9;
                            margin-top: -3px;
                            border-radius: 50%;
                        }
                        .fc();
                        .fco(.14rem,#333);
                        .model{
                            flex:1;
                        }
                        .status{
                            width:1rem;
                        }
                        .num{
                            color: #ED3800;
                        }
                    }
                }
            }
        }
    }
</style>



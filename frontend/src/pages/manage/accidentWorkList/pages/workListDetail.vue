<template>
    <div class="container">
        <div class="header">
            <div class="row1">
                <span>{{info.plate_no}}(</span>
                <span class="desc">{{info.vin}}</span>
                <span>)</span>
            </div>
            <div class="row2">
                <div class="label">{{info.brand_name}}{{info.model_name}}</div>
            </div>
            <div class="row3">
                <div class="desc">
                    <span class="d-label">立刻案件号</span>
                    <span>{{info.lk_no}}</span>
                </div>
                <div @click="goHistoryPage">操作历史></div>
            </div>
        </div>
        <div class="main">
            <div class="row1">
                <span>工单流程:</span>
                <span>{{info.deal_mode|filterDeal_mode}}</span>
            </div>
            <div class="step-box">
                <StepBar :list="stepData" :status="info.status" :isUpdate="isUpdate"/>
            </div>
        </div>
        <div class="detail">
            <div class="title">
                <div class="label-wrap">
                    <div>事故保险工单详情</div>
                    <div v-show="info.car_insurance!=0" class="label">不计免赔</div>
                </div>
                <!-- <span class="update" @click="goUpdatePage">修改</span> -->
            </div>
            <div class="item">
                <div class="label">立刻账户：</div>
                <div class="val">{{info.like_user}}</div>
            </div>
            <div class="item">
                <div class="label">车辆状态：</div>
                <div class="val">{{info.car_status_name}}</div>
            </div>
            <div class="item" v-show="info.like_user_mobile">
                <div class="label">联系方式：</div>
                <div class="val">{{info.like_user_mobile}}</div>
            </div>
            <div class="item">
                <div class="label">事故类型：</div>
                <div class="val">{{info.type|filterType}}</div>
            </div>
            <div class="item">
                <div class="label">是否为员工出险：</div>
                <div class="val">{{info.is_like_staff|filterStaff}}</div>
            </div>
            <div class="item" v-show="isUpdate">
                <div class="label">是否有人受伤：</div>
                <div class="val">{{info.is_person_injured|filterPersonInjured}}</div>
            </div>
            <div class="item" v-show="info.third_mobile">
                <div class="label">三者联系方式：</div>
                <div class="val">{{info.third_mobile}}</div>
            </div>
            <div class="item" v-show="info.third_plate_no">
                <div class="label" >三者车牌：</div>
                <div class="val">{{info.third_plate_no}}</div>
            </div>
            <div class="item" v-show="info.car_injured_part">
                <div class="label">受损部位：</div>
                <div class="val">{{info.car_injured_part}}</div>
            </div>
            <div class="item" v-show="info.remark">
                <div class="label">备注：</div>
                <div class="val">{{info.remark}}</div>
            </div>
        </div>
        <Cell v-show="info.photo" label="查看事故照片" @press="goAccidentage"/>
        <Cell v-show="!this.isUpdate && info.status==1" label="更新事故工单" color="#4A90E2"  @press="goUpdatePage"/>
        <Cell v-show="this.isUpdate" :label="info.status<2?'定责信息登记':'查看定责信息'" :color="info.status<2?'#4A90E2':'#333'" @press="goAccountabilityPage"/>
        <Cell v-show="(opStyle==1||opStyle==2) && (info.status>2||info.status==2)" :label="info.status<3?'定损信息登记':'查看定损信息'" :color="info.status<3?'#4A90E2':'#333'"  @press="goLossPage"/>
        <Cell v-show="repairIsShow" :label="info.work_order_id!=0?'查看维修信息':'维修信息登记'" :color="info.status<4?'#4A90E2':'#333'"  @press="goRepairage"/>
        <Cell v-show="info.status>2 || info.status==2" label="查看用户赔付信息"  @press="goIndemnityInfoPage"/>
        <Cell v-show="info.status>2 || info.status==2" label="查看财务结算信息"  @press="goSettlementPage"/>
        <Cell v-show="finishIsShow" label="结案"  @press="finish"/>
        <div class="btn-group" >
            <div class="btn" @click="openDoor">开门</div>
            <div class="btn" @click="closeDoor">锁门</div>
        </div>
    </div>
</template>
<script>
import StepBar from '../components/stepBar'
import Cell from '../components/cell'
import { MessageBox } from 'mint-ui';
import { mapState,mapActions } from 'vuex'
import { DDBase,DD as dd } from '../../../../../other_modules/like-manageOrder/ddSDK'
export default {
    name:'workListDetail',
    components:{
        StepBar,
        Cell
    },           
    data(){
        return{
            stepList:[
                {
                    num:1,
                    des:'创建成功',
                },
                {
                    num:2,
                    des:'已定责',
                },
                {
                    num:3,
                    des:'已定损',
                },
                {
                    num:4,
                    des:'已维修',
                },
                {
                    num:5,
                    des:'已结算',
                },
                {
                    num:6,
                    des:'结案',
                }
            ]
        }
    },
    computed:{
        ...mapState('workDetail',[
            'info'
        ]),
        opStyle(){
            return this.info.deal_mode
        },
        isUpdate(){
            if(this.info.is_person_injured==-1){
                return false
            }else{
                return true
            }
        },
        repairIsShow(){
            let num = parseInt(this.opStyle)
            switch(num){
                case 1:
                if(this.info.status>2){
                    return true
                }else{
                    return false
                }
                break;
                case 2:
                if(this.info.status>2){
                    return true
                }else{
                    return false
                }
                break;
                case 3:
                if(this.info.status>1){
                    return true
                }else{
                    return false
                }
                break;    
            }
        },
        stepData(){
            let v = this.opStyle
            let arr = this.stepList.slice()
            if(v==3){
                this.deleteArrayItemVal(arr,3)
            }else if(v==4){
                this.deleteArrayItemVal(arr,3)
                this.deleteArrayItemVal(arr,4)
                this.deleteArrayItemVal(arr,5)
            }
            return arr  
        },
        finishIsShow(){
            let num = this.stepData[this.stepData.length-2].num
            if(this.info.status==num){
                return true
            }else{
                return false;
            }
        }
    },
    created(){
        DDBase.setWebTitle('事故保险详情')
        this.$showLoading('workDetail')
        let order_id = this.$route.query.order_id
        this.$store.commit('workDetail/setOrderId',order_id)
        this.getDetail(this) 
    },
    methods:{
        ...mapActions('workDetail',[
            'getDetail',
            'finishOrder',
            'openDoor',
            'closeDoor'
        ]),
        goAccidentage(){
            this.$router.push('imagePreview')    
        },
        goAccountabilityPage(){
            if(this.info.status<2){
                this.$router.push('createAccountability')  
            }else{
                this.$router.push('accountabilityDetail')  
            }
            
        },
        goLossPage(){
            if(this.info.status<3){
                this.$router.push('loss')  
            }else{
                this.$router.push('lossDetail')  
            }
        },
        goRepairage(){
            if(this.info.status<4){
                if(this.info.work_order_id!=0){
                    window.location.href = './../manageOrderService/index.html#/orderDetail?order_id='+this.info.work_order_id
                }else{
                    this.$router.push('createRepair')
                }
                 
            }else{
                window.location.href = './../manageOrderService/index.html#/finishedOrder?order_id='+this.info.work_order_id
            }
        },
        goUpdatePage(){
            this.$router.push('updateWork') 
        },
        goHistoryPage(){
            this.$router.push('updateHistory') 
        },
        goSettlementPage(){
            this.$router.push('settlementInfo') 
        },
        goIndemnityInfoPage(){
            this.$router.push('indemnityInfo') 
        },
        finish(){
            MessageBox.confirm('请确认要将本案件结案，结案后不可更改。').then(res=> {
                this.finishOrder()
            }).catch(cancel=>{
                console.log(cancel)
            })
        },
        deleteArrayItemVal(arr,v){
            arr.map((item,index)=>{
                if(item.num===v){
                    arr.splice(index,1)
                }
            })
        }
    },
    destroyed(){
        this.$hideLoading('workDetail')
    },
    beforeRouteLeave(to,from,next){
        if(to.path==='/'){
            this.$store.commit('workDetail/emptyData')
        }
        next()
    },
    filters:{
        filterType(type){
            let i = parseInt(type)
            if(i===1){
                return '单方事故'
            }else if(i===2){
                return '多方事故'
            }
        },
        filterStaff(staff){
            let i = parseInt(staff)
            if(i===1){
                return '是'
            }else if(i===0){
                return '否'
            }
        },
        filterPersonInjured(val){
            let i = parseInt(val)
            if(i===1){
                return '是'
            }else if(i===0){
                return '否'
            }
        },
        filterDeal_mode(type){
            let i = parseInt(type)
            if(i===1){
                return '保险'
            }else if(i===2){
                return '分时保险'
            }else if(i==3){
                return '自费维修'
            }else if(i==4){
                return '自费暂不维修'
            }else{
                return ''
            }
        }
    }
}
</script>
<style lang="less" scoped>
    @import url('../css/common.less');
    .container{
        min-height: 100vh;
        background: #f6f6f6;
        padding-bottom: .8rem;
        .header{
            background: #fff;
            padding: .15rem .1rem;
            .row1{
                .fd();
                .f14();
                .c3();
                .desc{
                    .c9();
                    padding: 0 .02rem;
                }
                margin-bottom: .07rem;
            }
            .row2{
                .fb();
                .label{
                    .b();
                    .br();
                    height: .28rem;
                    line-height: .28rem;
                    text-align: center;
                    padding: 0 .07rem;
                    .f12();
                    .c3();
                } 
            }
            .row3{
                .fb();
                .c9();
                margin-top: .07rem;
                .desc{
                    .f12();
                    .c3();
                    .d-label{
                        .c9()
                    }
                }
            }
        }
        .main{
            padding: .15rem .1rem;
            background: #fff;
            margin-top: .1rem;
            .row1{
                .f14();
                .c3();
                margin-bottom: .25rem;
            }
        }
        .detail{
            background: #fff;
            margin-top: .02rem;
            padding: .15rem .1rem;
            margin-bottom: .1rem;
            .title{
                .fco(.14rem,#333);
                .fb();
                .label-wrap{
                    .fc();
                    .label{
                        margin-left: .15rem;
                        border: 1px solid rgb(228, 64, 43);
                        height: .18rem;
                        border-radius: 2px;
                        font-size: .12rem;
                        color: rgb(228, 64, 43);
                        padding: 0 .04rem;
                    }
                }
                .update{
                    font-family: PingFangSC-Regular;
                    font-size: .12rem;
                    color: #44A8EC;
                    padding-right: .1rem;
                }
            }
            .item{
                margin-top: .06rem;
                .fd();
                .label{
                    .fco(.12rem,#999)
                }
                .val{
                    .c3();
                }
            }
        }
        .btn-group{
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            height: .64rem;
            background: #fff;
            box-shadow: 0 2px 10px 0 rgba(0,0,0,0.16);
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 .1rem;
            font-size: .16rem;
            .btn{
                width:1.7rem;
                height: .44rem;
                border-radius: 2px;
                display: flex;
                justify-content: center;
                align-items: center;
                border: 1px solid #c7bcbc;
                font-size: .16rem;
                color: #666;
            }
        }
    }
</style>



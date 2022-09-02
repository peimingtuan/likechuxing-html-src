<template>
    <div class="container">
        <WorkListItem
            :id="info.id"
            :plate_no="info.plate_no" 
            :vin="info.vin" 
            :carStatus="info.car_status_name"
            :model_name="info.model_name" 
            :color="info.car_color"
            :branch="info.branch.name"
            :parking_no="info.branch.parking_no" 
            :parking_floor="info.branch.parking_floor"
        />
        <div class="main">
            <div class="row1 title">
                <span>工单流程</span>
                <div class="more" @click="showSelectBox">更多</div>
            </div>
            <div class="step-box">
                <StepBar :list="stepList" :status="info.status" :current_status="info.current_status"/>
            </div>
        </div>
        <Cell :label="info.status==1 && info.current_status>0?'1.查看年检标志照片':'1.粘贴年检标志'" :color="info.status==1 && info.current_status==0?'#4A90E2':'#333'" @press="goUpdateImgPage"/>
        <Cell label="2.输入车位结束工单" :color="info.status==1 && info.current_status>0?'#4A90E2':'#333'" @press="goFinishOrderPage"/>
        <div class="op-history">
            <div class="title">操作历史：</div>
            <div class="h-list">
                <div class="item" v-for="(item,index) in historyDetail" :key="index">
                    <div class="op">
                        <span>{{item.update_time}}</span>
                        <span>{{item.status_name}}</span>
                    </div>
                    <div class="op-author">
                        <span>{{item.user_name}}</span>
                        <span>{{item.phone}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="btn-group" >
            <div class="btn" @click="openDoor">开门</div>
            <div class="btn" @click="closeDoor">锁门</div>
        </div>
        <SelectBox :list="selectList" :show="isShowSelectBox" @onChangeValue="selectValue" @hideFilterBox="hideSelectBox"/>
    </div>
</template>
<script>
import StepBar from '../components/stepBar'
import WorkListItem from '../components/indexPageWorkListItem.vue'
import Cell from '../components/cell'
import SelectBox from '../components/selectBox.vue'
import { MessageBox } from 'mint-ui';
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
    name:'workDetail',
    components:{
        StepBar,
        Cell,
        WorkListItem,
        SelectBox,
    },           
    data(){
        return{
            stepList:[
                {
                    num:1,
                    des:'粘贴年检标志',
                },
                {
                    num:2,
                    des:'结束工单',
                }
            ],
            selectList:[
                {
                    id:1,
                    name:'录入费用信息',
                    isSelected:false
                },
                {
                    id:2,
                    name:'更改车辆状态',
                    isSelected:false
                }
            ],
            isShowSelectBox:false
        }
    },
    computed:{
        ...mapState('workDetail',[
            'info',
            'historyDetail',
            'order_id'
        ]),
    },
    watch:{
        info(v){
            let car_status =v.car_status
            let arr = this.selectList.slice()
            if(car_status==35){
                arr.splice(1,1)
            }
            this.selectList = arr
        }
    },
    created(){
        this.$showLoading('workDetail')
        let order_id = this.$route.query.order_id
        let car_id = this.$route.query.car_id
        this.setOrderId(order_id)
        this.setCarId(car_id)

        this.getInfo()
    },
    methods:{
        ...mapActions('workDetail',[
            'getDetail',
            'getHistory',
            'openDoor',
            'closeDoor'
        ]),
        ...mapMutations('workDetail',[
            'setOrderId',
            'setCarId'
        ]),
        ...mapMutations('finish',[
            'setBranchId',
            'setBranchName',
            'setBranchFloor',
            'setBranchNum',
            'setCarStatus'
        ]),
        async getInfo(){
            await this.getDetail(this)
            let { id, name, parking_floor, parking_no } = this.info.branch
            this.setBranchId(id)
            this.setBranchName(name)
            this.setBranchFloor(parking_floor)
            this.setBranchNum(parking_no)
            this.setCarStatus(this.info.car_status)
            this.getHistory()
        },
        showSelectBox(){
            this.isShowSelectBox = true
        },
        hideSelectBox(){
            this.isShowSelectBox = false
        },
        selectValue(v){
            let id = v[0].id
            let order_id = this.order_id
            if(id==1){
                this.$router.push({path:'feeInfo',query:{order_id}})
            }else{
                this.$router.push({path:'updateStatus',query:{order_id}})
            }
        },
        goUpdateImgPage(){
            let { info } = this
            if(info.status==1 && info.current_status>0){
                this.$router.push('imagePreview')
            }else{
                this.$router.push('updateImage')
            }
            
        },
        goFinishOrderPage(){
            let { info } = this
            if(info.status==1 && info.current_status>0){
                this.$router.push({path:'finishWork',query:{order_id:this.order_id}})
            }
        },
    },
    destroyed(){
        this.$hideLoading('workDetail')
    },
    beforeRouteLeave(to,from,next){
        if(to.path==='/'){
            this.$store.commit('workDetail/emptyData')
        }
        next()
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
            .title{
                .fb();
                .more{
                    .fco(.12rem,#666);
                }
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
        .op-history{
            padding: .15rem;
            background:#fff;
            margin-top:.1rem;
            .title{
                .fco(.14rem,#333);
                margin-bottom:.1rem;
            }
            .h-list{
                .item{
                    padding-bottom: .1rem;
                    padding-left: .18rem;
                    position: relative;
                    &::before{
                        content:'';
                        width: 1px;
                        height: 100%;
                        border-radius: 100%;
                        background:  #C9C9C9;
                        position: absolute;
                        left: .03rem;
                        top: 20%;
                    }
                    &:last-child{
                       &::before{
                            display: none;
                        } 
                    }
                }

                .fco(.12rem,#666);
                .op{
                    span{
                        margin-right: .2rem;
                    }
                    margin-bottom: .06rem;
                    position: relative;
                    &::before{
                        content:'';
                        width: .08rem;
                        height: .08rem;
                        border-radius: 100%;
                        background:  #C9C9C9;
                        position: absolute;
                        left: -.18rem;
                        top: 50%;
                        margin-top: -.04rem;
                    }
                }
                .op-author{
                    span{
                        margin-right: .1rem;
                    }
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



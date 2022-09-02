<template>
    <div class="container">
        <div class="info-wrap">
            <div class="title">定责信息详情</div>
            <div class="cell">
                <div class="label">定责方式：</div>
                <div class="val">{{info.response_mode|filterResponse}}</div>
            </div>
            <div class="cell">
                <div class="label">责任归属：</div>
                <div class="val">{{info.response_belonging|filterResponse_belonging}}</div>
            </div>
            <div class="cell">
                <div class="label">处理方式：</div>
                <div class="val">{{info.deal_mode|filterDeal_mode}}</div>
            </div>
            <div class="cell">
                <div class="label">车辆是否被扣</div>
                <div class="val">{{info.detain|filterDetain}}</div>
            </div>
            <div class="cell">
                <div class="label">车辆归属公司：</div>
                <div class="val">{{info.car_belonging}}</div>
            </div>
            <div class="cell" v-show="info.remark">
                <div class="label">备注：</div>
                <div class="val">{{info.remark}}</div>
            </div>
        </div>
        <div class="row">
            <Cell label="查看定责照片"  @press="goPage"/>
        </div>
        <div v-show="detailInfo.status!=6">
            <FooterBtn txt="修改" :active="true" @press="update"/>
        </div>
    </div>
</template>
<script>
import Cell from '../components/cell'
import { mapState,mapActions } from 'vuex'
import { DDBase } from '../../../../../other_modules/like-manageOrder/ddSDK'
import FooterBtn from '../components/footerBtn'
export default {
    components:{
        Cell,
        FooterBtn
    },
    computed:{
        ...mapState('accountability',[
            'info'
        ]),
        ...mapState('workDetail',{
            detailInfo:'info'
        }),
    },
    created(){
        DDBase.setWebTitle('定责信息详情')
        this.$showLoading('accountability')
        this.$store.commit('accountability/setOrderId',this.$store.state.workDetail.order_id)
        this.getInfo(this)
    },
    methods:{
        ...mapActions('accountability',[
            'getInfo'
        ]),
        goPage(){
            this.$router.push('seeAccountability')
        },
        update(){
            this.$router.push('updateAccountability')
        }
    },
    destroyed(){
        this.$hideLoading('accountability')
    },
    filters:{
        filterResponse(type){
            let i = parseInt(type)
            if(i===1){
                return '报警'
            }else if(i===2){
                return '私了'
            }
        },
        filterResponse_belonging(type){
            let i = parseInt(type)
            if(i===1){
                return '全责'
            }else if(i===2){
                return '主要责任'
            }else if(i==3){
                return '同等责任'
            }else if(i===4){
                return '次要责任'
            }else{
                return '无责'
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
            }else{
                return '自费暂不维修'
            }
        },
        filterDetain(type){
            let i = parseInt(type)
            if(i===1){
                return '是'
            }else if(i===0){
                return '否'
            }
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
                    width: 1.14rem;
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
    }
</style>



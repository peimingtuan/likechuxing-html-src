<template>
    <div class="container">
        <div class="info-wrap">
            <div class="title">定损信息详情</div>
            <div class="cell">
                <div class="label">出险人：</div>
                <div class="val">{{info.loss_person}}</div>
            </div>
            <div class="cell">
                <div class="label">保险公司：</div>
                <div class="val">{{info.company}}</div>
            </div>
            <div class="cell">
                <div class="label">定损地点：</div>
                <div class="val">{{info.loss_location}}</div>
            </div>
            <div class="cell">
                <div class="label">定损金额：</div>
                <div class="val">{{info.loss_money}}</div>
            </div>
            <div class="cell">
                <div class="label">出险时间：</div>
                <div class="val">{{info.loss_time}}</div>
            </div>
            <div class="cell">
                <div class="label">报案号：</div>
                <div class="val">{{info.loss_no}}</div>
            </div>
            <div class="cell">
                <div class="label">保险被保人：</div>
                <div class="val">{{info.insured_person}}</div>
            </div>
            <div class="cell">
                <div class="label">三方定损金额(元)：</div>
                <div class="val">{{info.third_money}}</div>
            </div>
            <div class="cell" v-show="info.remark">
                <div class="label">备注：</div>
                <div class="val">{{info.remark}}</div>
            </div>
        </div>
        <div class="row">
            <Cell label="查看定损照片"  @press="goPage"/>
        </div>
        <div v-show="detailInfo.status!=6">
            <FooterBtn txt="修改" :active="true" @press="update"/>
        </div> 
    </div>
</template>
<script>
import Cell from '../components/cell'
import { mapState,mapActions } from 'vuex'
import FooterBtn from '../components/footerBtn'
import tool from '../js/tools'
import { DDBase } from '../../../../../other_modules/like-manageOrder/ddSDK'
export default {
    components:{
        Cell,
        FooterBtn
    },
    computed:{
        ...mapState('loss',[
            'info'
        ]),
        ...mapState('workDetail',{
            detailInfo:'info'
        }),
    },
    created(){
        DDBase.setWebTitle('定损信息详情')
        this.$showLoading('loss')
        this.$store.commit('loss/setOrderId',this.$store.state.workDetail.order_id)
        this.getInfo(this)
    },
    methods:{
        ...mapActions('loss',[
            'getInfo'
        ]),
        goPage(){
            this.$router.push('seeLoss')
        },
        update(){
            this.$router.push('updateLoss')
        }
    },
    destroyed(){
        this.$hideLoading('loss')
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



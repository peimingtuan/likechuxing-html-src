<template>
    <div class="container">
        <div class="info">
            <div>
                <span>{{info.plate_no}}（</span>
                <span>{{info.vin}}</span>
                <span>）</span>
            </div>
            <div class="row">
                <div class="label">保险</div>
                <div class="label">续航约 {{info.remain_km}} 公里</div>
                <div class="label">{{info.brand_name}}{{info.model_name}}</div>
                <div class="label">{{info.car_factory}}</div>
            </div>
            <div>
                处理方式：{{info.deal_mode|filterDeal_mode}}
            </div>
        </div>
        <div class="textArea">
            <div class="title"><span style="color:red;">*</span>备注：</div>
            <textarea name="" id="" cols="30" rows="10" v-model="remark" ></textarea>
            <div class="count">{{counntRemarks}}/150</div>
        </div>
        <footerBtn txt="提交" :active="counntRemarks" @press="checkRepair"/>
    </div>
</template>
<script>
import footerBtn from '../components/footerBtn.vue'
import Cell from '../components/cell'
import { DDBase } from '../../../../../other_modules/like-manageOrder/ddSDK'
import { mapState, mapActions }  from 'vuex'
import { Toast } from 'mint-ui'
export default {
    components:{
        footerBtn,
        Cell
    },
    computed:{
        ...mapState('repair',[
            'info'
        ]),
        remark:{
            get(){
                return this.$store.state.repair.remark
            },
            set(val){
                this.$store.commit('repair/setRemark', val)
            }
        },
        counntRemarks(){
            return this.remark.length
        }
    },
    watch:{
        remark(v){
            if(v.length>150){
                this.$store.commit('repair/setRemark',v.substr(0,150))
            }
        }
    },
    created(){
        DDBase.setWebTitle('创建维修工单')
        this.$showLoading()
        this.$store.commit('repair/setOrderId',this.$store.state.workDetail.order_id)
        this.getInfo(this)
    },
    methods:{
        ...mapActions('repair',[
            'createRepair',
            'getInfo'
        ]),
        checkRepair(){
            if(this.remark===''){
                Toast('请输入备注信息')
                return
            }
            this.createRepair(this)
        }
    },
    filters:{
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
    .container{
        min-height:100vh;
        background: #f6f6f6;
        .info{
            padding: .15rem .12rem 0;
            background: #fff;
            .row{
                display: flex;
                align-items: center;
                font-size: .12rem;
                color: #333;
                margin: .1rem 0 ;
                .label{
                    margin-right: .1rem;
                    padding: 0 .08rem;
                    border-radius: 1px;
                    border: 1px solid #d0cdcd;
                }
            }
        }
        .textArea{
            padding: .18rem .12rem;
            background: #fff;
            position: relative;
            .title{
                font-size: .12rem;
                color: #333;
                margin-bottom: .06rem;
            }
            textarea{
                display: block;
                width: 100%;
                height: .84rem;
                background: #F7F7F7;
                border: 1px solid #C1C1C1;
                padding: .1rem;
            }
            .count{
                position: absolute;
                right: .25rem;
                bottom: .27rem;
                font-size: .12rem;
                color: #333;
            }
        }
    }
</style>




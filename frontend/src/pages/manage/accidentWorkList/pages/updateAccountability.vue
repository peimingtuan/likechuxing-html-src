<template>
    <div class="container">
        <formCell label="定责方式" required="true">
            <div class="checkbox" slot="inputbox">
                <div class="item" :class="response_mode==item.id?'on':''" v-for="(item,index) in typeList1" :key="index" @click="selectType(item.id,'response_mode')">{{item.name}}</div>
            </div>
        </formCell>
        <div class="row">
            <formCell label="责任归属" required="true">
                <div class="checkbox" slot="inputbox">
                    <div class="item" :class="response_belonging==item.id?'on':''" v-for="(item,index) in typeList2" :key="index" @click="selectType(item.id,'response_belonging')">{{item.name}}</div>
                </div>
            </formCell>
        </div>
        <div class="row">
            <formCell label="处理方式">
                <div slot="inputbox" class="cell-item" >
                        {{info.deal_mode|filterDeal_mode}}
                </div>
            </formCell>
        </div>
        <div class="row">
            <formCell label="车辆是否被扣" required="true">
                <div class="checkbox" slot="inputbox">
                    <div class="item" :class="detain==item.id?'on':''"  v-for="(item,index) in typeList4" :key="index" @click="selectType(item.id,'detain')">{{item.name}}</div>
                </div>
            </formCell>
        </div>
        <div class="row">
            <formCell label="车辆归属">
                <div slot="inputbox" class="cell-item" >
                        {{car_belonging}}
                </div>
            </formCell>
        </div>
        <div class="row">
            <Cell label="上传定责照片"  @press="goPage"/>
        </div>
        <div class="textArea">
            <div class="title">备注：</div>
            <textarea name="" id="" cols="30" rows="10" v-model="remark" ></textarea>
            <div class="count">{{counntRemarks}}/150</div>
        </div>
        <div class="footer">
            <div class="cancel-btn" @click="goback">取消</div>
            <div class="comfirm-btn" @click="checkAccountability">确定</div>
        </div>
    </div>
</template>
<script>
import formCell from '../components/formCell.vue'
import Cell from '../components/cell'
import { mapState, mapActions }  from 'vuex'
import { DDBase,DD as dd } from '../../../../../other_modules/like-manageOrder/ddSDK'
import { Toast } from 'mint-ui'
export default {
    components:{
        formCell,
        Cell
    },
    data(){
        return{
            typeList1:[{id:1,name:'报警'},{id:2,name:'私了'}],
            typeList2:[{id:1,name:'全责'},{id:2,name:'主要责任'},{id:3,name:'同等责任'},{id:4,name:'次要责任'},{id:5,name:'无责'}],
            typeList4:[{id:1,name:'是'},{id:0,name:'否'}],
        }
    },
    computed:{
        ...mapState('accountability',[
            'response_mode',
            'response_belonging',
            'info',
            'detain',
            'car_belonging'
        ]),
        remark:{
            get(){
                return this.$store.state.accountability.remark
            },
            set(val){
                this.$store.commit('accountability/setRemark', val)
            }
        },
        counntRemarks(){
            return this.remark.length
        }
    },
    watch:{
        remark(v){
            if(v.length>150){
                this.$store.commit('accountability/setRemark',v.substr(0,150))
            }
        }
    },
    created(){
        DDBase.setWebTitle('定责信息登记')
        this.$store.commit('accountability/setOrderId',this.$store.state.workDetail.order_id)
    },
    methods:{
        ...mapActions('accountability',[
            'updateAccident'
        ]),
        goback(){
            this.$router.go(-1)
        },
        selectType(id,type){
            switch(type){
                case 'response_mode':
                    this.$store.commit('accountability/setEsponse_mode',id)
                    break;
                case 'response_belonging':
                    this.$store.commit('accountability/setResponse_belonging',id)
                    break;
                case 'detain':
                    this.$store.commit('accountability/setDetain',id)
                    break;
                case 'detain':
            }
            
        },
        checkAccountability(){

            if(this.response_mode===''){
                Toast('请选择定责方式')
                return
            }
            if(this.response_belonging===''){
                Toast('请选择责任归属')
                return
            }
            if(this.detain===''){
                Toast('请选择车辆是否被扣')
                return
            }
            this.updateAccident(this.$router)
        },
        goPage(){
            this.$router.push('/updateResponsibilityImages')
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
            }else{
                return '自费暂不维修'
            }
        }
    }
}
</script>
<style lang="less" scoped>
    .container{
        min-height:100vh;
        background: #f6f6f6;
        .input-box{
            width: 100%;
            height: .4rem;
            display: block;
            font-size: .14rem;
            color: #999999;
        }
        .cell-item{
            width:100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: .14rem;
            .item-input-box{
                flex:1;
                height: .4rem;
                line-height: .4rem;
                display: block;
                font-size: .14rem;
                color: #999999;
            }
            .btn{
                width: 1.18rem;
                height: .38rem;
                line-height: .38rem;
                border-left: 1px solid #f6f6f6;
                font-size: 14px;
                color: #9B9B9B;
                padding-left: .1rem;
                &.blue{
                    color: #44A8EC;
                }
            }
        }
        .checkbox{
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            .item{
                min-width: .73rem;
                height: .27rem;
                border: 1px solid #CDCDCD;
                border-radius: 2px;
                font-size: .14rem;
                color: #999999;
                text-align: center;
                line-height: .27rem;
                margin-right: .2rem;
                margin-bottom: .075rem;
                margin-top: .075rem;
                &.on{
                    background: #4A4A4A;
                    color: #fff;
                    border: 1px solid #4A4A4A;
                }
                &.big{
                    padding: 0 .08rem;
                }
            }
        }
        .desc{
            width: 100%;
            height: 100%;
            line-height: .53rem;
            font-size: .14rem;
            color: #999999;
        }
        .row{
            position: relative;
            &::after{
                content:'';
                position: absolute;
                bottom:0;
                left: 0;
                width:100%;
                height: 1px;
                background: #f2f2f2;
                transform: scaleY(.5);
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
        .footer{
            position: fixed;
            bottom:0;
            left: 0;
            background: #fff;
            width: 100%;
            height: .63rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 .1rem;
            .cancel-btn{
                width: 1.7rem;
                height: .44rem;
                text-align:center;
                line-height: .44rem;
                background: #D8D8D8;
                border-radius: 2px;
                font-size: .16rem;
                color: #666666;
            }
            .comfirm-btn{
                width: 1.7rem;
                height: .44rem;
                text-align:center;
                line-height: .44rem;
                background:  #4A4A4A;
                border-radius: 2px;
                font-size: .16rem;
                color: #fff;
            }
        }
    }
</style>



<template>
    <div class="container">
        <formCell label="出险人" required="true">
            <div slot="inputbox" class="cell-item" >
                <input type="text" v-model="loss_person"  placeholder="请输入出险人" class="item-input-box">
            </div>
        </formCell>
        <formCell label="保险公司" required="true">
            <div slot="inputbox" class="cell-item" >
                <input type="text" v-model="company"  placeholder="请输入保险公司" class="item-input-box">
            </div>
        </formCell>
        <formCell label="定损地点" required="true">
            <div slot="inputbox" class="cell-item" >
                <input type="text" v-model="loss_location"  placeholder="请输入定损地点" class="item-input-box">
            </div>
        </formCell>
        <formCell label="定损金额" >
            <div slot="inputbox" class="cell-item" >
               {{loss_money}}
            </div>
        </formCell>
        <formCell label="出险时间" required="true">
            <div class="desc" slot="inputbox" @click="openPicker" v-show="loss_time===''">请选择出险时间</div>
            <div class="desc" style="color:#333" slot="inputbox" @click="openPicker" v-show="loss_time!==''">{{loss_time|formatDate}}</div>
        </formCell>
        <formCell label="报案号" required="true">
            <div slot="inputbox" class="cell-item" >
                <input type="text" v-model="loss_no"  placeholder="请输入报案号" class="item-input-box">
            </div>
        </formCell>
        <formCell label="保险被保人" required="true">
            <div slot="inputbox" class="cell-item" >
                <input type="text" v-model="insured_person"  placeholder="请输入保险被保人" class="item-input-box">
            </div>
        </formCell>
        <formCell label="三者定损金额(元)" >
            <div slot="inputbox" class="cell-item" >
                <input type="text" v-model="third_money"  placeholder="请输入第三者定损金额（如有）" class="item-input-box">
            </div>
        </formCell>
        <Cell label="上传定损照片" required="true" @press="goImgPage"/>
        <div class="textArea">
            <div class="title">备注：</div>
            <textarea name="" id="" cols="30" rows="10" v-model="remark" ></textarea>
            <div class="count">{{counntRemarks}}/150</div>
        </div>
        <div class="footer">
            <div class="cancel-btn" @click="goback">取消</div>
            <div class="comfirm-btn" @click="createLoss">确定</div>
        </div>
        <mt-datetime-picker
            ref="datePicker"
            type="date"
            @confirm="comfirmPicker"
            v-model="pickerValue">
        </mt-datetime-picker>
    </div>
</template>
<script>
import formCell from '../components/formCell.vue'
import { mapState, mapActions }  from 'vuex'
import Cell from '../components/cell'
import tool from '../js/tools'
import { Toast } from 'mint-ui'
import { DDBase } from '../../../../../other_modules/like-manageOrder/ddSDK'
export default {
    name:'loss',
    components:{
        formCell,
        Cell
    },
    data(){
        return{
            pickerValue:new Date()
        }
    },
    created(){
        DDBase.setWebTitle('修改定损信息')
        this.$store.commit('loss/setOrderId',this.$store.state.workDetail.order_id)
    },
    computed:{
        ...mapState('loss',[
            'loss_time',
            'accidentImgUrl',
            'loss_money'
        ]),
        loss_person:{
            get(){
                return this.$store.state.loss.loss_person
            },
            set(val){
                this.$store.commit('loss/setLossPerson', val)
            }
        },
        company:{
            get(){
                return this.$store.state.loss.company
            },
            set(val){
                this.$store.commit('loss/setCompany', val)
            }
        },
        loss_location:{
            get(){
                return this.$store.state.loss.loss_location
            },
            set(val){
                this.$store.commit('loss/setLossLocation', val)
            }
        },
        loss_no:{
            get(){
                return this.$store.state.loss.loss_no
            },
            set(val){
                this.$store.commit('loss/setLossNo', val)
            }
        },
        insured_person:{
            get(){
                return this.$store.state.loss.insured_person
            },
            set(val){
                this.$store.commit('loss/setInsuredPerson', val)
            }
        },
        third_money:{
            get(){
                return this.$store.state.loss.third_money
            },
            set(val){
                this.$store.commit('loss/setThird_money', val)
            }
        },
        remark:{
            get(){
                return this.$store.state.loss.remark
            },
            set(val){
                this.$store.commit('loss/setRemark', val)
            }
        },
        counntRemarks(){
            return this.remark.length
        }
    },
    watch:{
        remarks(v){
            if(v.length>150){
                let str = this.remarks.substr(0,150)
                this.$store.commit('loss/setRemark',str)
            }
            
        }
    },
    methods:{
        ...mapActions('loss',[
            'updateAccident'
        ]),
        openPicker(){
            this.$refs.datePicker.open();
        },
        comfirmPicker(){

            this.$store.commit('loss/setLossTime',tool.timestampToDate(this.pickerValue))
        },
        goback(){
            this.$router.go(-1)
        },
        createLoss(){
            if(this.loss_person===''){
                Toast('请输入出险人')
                return 
            }
            if(this.company===''){
                Toast('请输入保险公司')
                return 
            }
            if(this.loss_location===''){
                Toast('请输入定损地点')
                return 
            }
            if(this.loss_time===''){
                Toast('请选择出险时间')
                return 
            }
            if(this.loss_no===''){
                Toast('请输入报案号')
                return 
            }
            if(this.insured_person===''){
                Toast('请输入保险被保人')
                return 
            }
            if(this.third_money!==''){
                let num = parseFloat(this.third_money)
                if(isNaN(num)){
                    Toast('定损金额格式不正确')
                    return 
                }
            }
            if(this.accidentImgUrl.length==0){
                Toast('请上传定损照片')
                return
            }
            this.updateAccident(this.$router)
        },
        goImgPage(){
            this.$router.push('updateLossImages')
        }
    },
    filters:{
        formatDate(timestamp){
            return tool.timestampToDate(timestamp)
        }
    }
}
</script>
<style lang="less" scoped>
    .container{
        min-height:100vh;
        padding-bottom: .7rem;
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
            .item-input-box{
                flex:1;
                height: .4rem;
                line-height: .4rem;
                display: block;
                font-size: .14rem;
                color: #333;
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
            height: 100%;
            display: flex;
            align-items: center;
            .item{
                width: .73rem;
                height: .27rem;
                border: 1px solid #CDCDCD;
                border-radius: 2px;
                font-size: .14rem;
                color: #999999;
                text-align: center;
                line-height: .27rem;
                margin-right: .2rem;
                &.on{
                    background: #4A4A4A;
                    color: #fff;
                    border: 1px solid #4A4A4A;
                }
            }
        }
        .desc{
            width: 100%;
            min-height: .53rem;
            font-size: .14rem;
            color: #999999;
            display: flex;
            align-items: center;
        }
        .row{
            margin-top: .1rem;
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



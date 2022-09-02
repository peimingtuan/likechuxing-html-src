<template>
    <div class="container">
        <div class="info-wrap">
            <div class="title">财务结算详情</div>
            <div class="cell">
                <div class="label">是否有备用金垫付：</div>
                <div class="val">{{info.is_petty_cash|filterCash}}</div>
            </div>
            <div class="cell">
                <div class="label">备用金借款金额(元)：</div>
                <div class="val">{{info.petty_cash}}</div>
            </div>
            <div class="cell" v-show="isShowInfo">
                <div class="label">保险赔付方式：</div>
                <div class="val">{{info.insurer_pay_type|filterType}}</div>
            </div>
            <div class="cell" v-show="isShowInfo">
                <div class="label">保险赔付情况：</div>
                <div class="val">{{info.deal_type|filterdeal_type}}</div>
            </div>
            <div class="cell" v-show="info.remark">
                <div class="label">备注：</div>
                <div class="val">{{info.remark}}</div>
            </div>
        </div>
        <div class="info-wrap" v-show="isShowInfo">
            <div class="cell">
                <div class="label">交案状态：</div>
                <div class="val">{{info.case_status|filterStatus}}</div>
            </div>
            <div class="cell">
                <div class="label">交案时间：</div>
                <div class="val">{{info.update_time}}</div>
            </div>
        </div>
        <div class="tip" v-show="isShowBtn">
            <span class="txt">交案提示</span>
            <span class="icon" @click="tip"></span>
        </div>
        <div class="btn-group" v-show="isShowBtn">
            <div class="btn cancel" @click="goback">取消</div>
            <div class="btn comfirm" @click="finish">交案</div>
        </div>
    </div>
</template>
<script>
import Cell from '../components/cell'
import tool from '../js/tools'
import http from '../js/http'
import api from '../js/api'
import { MessageBox, Toast } from 'mint-ui';
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
    computed:{
        isShowBtn(){
            if(this.$store.state.workDetail.info.deal_mode==3||this.$store.state.workDetail.info.deal_mode==4){
                return false
            }else{
                if(this.info.case_status){
                    return false
                }else{
                    return true
                }
            }
            
        },
        isShowInfo(){
            if(this.$store.state.workDetail.info.deal_mode==3||this.$store.state.workDetail.info.deal_mode==4){
                return false
            }else{
                return true
            }
        }
    },
    created(){
        DDBase.setWebTitle('财务结算详情')
        this.$showLoading()
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
                item_id:11
            }).then(res=>{
                if(res.status===0){
                    _this.info = res.data
                    _this.$hideLoading()
                }else{
                    Toast(res.msg)
                }
            }).catch(err=>{
                console.log(err)
            })
        },
        tip(){
            MessageBox({
                message:'当确认案件材料齐全并已向保险公司交案后，可点击交案。',
                confirmButtonText:'确认'
            })
        },
        goback(){
            this.$router.go(-1)
        },
        finish(){
            MessageBox.confirm('是否确认交案？').then(res=> {
                this.postData()
            }).catch(cancel=>{
                console.log(cancel)
            })
        },
        postData(){
            let { mobile } = this.$store.state
            let { order_id } = this.$store.state.workDetail
            const _this = this;
            http.post(api('/vehicle-accident/operate'),{
                mobile,
                order_id,
                item_id:10
            }).then(res=>{
                if(res.status===0){
                   _this.getInfo()
                }else{
                    Toast(res.msg)
                }
            }).catch(err=>{
                console.log(err)
            })
        }
    },
    filters:{
        filterCash(v){
            if(v===undefined){
                return ''
            }
            if(v==0){
                return '否'
            }else{
                return '是'
            }
        },
        filterType(v){
            let num = parseInt(v)
            switch(num){
                case -1:
                    return '未确定'
                case 0:
                    return '保险直赔'
                case 1:
                    return '租赁公司转账'
                case 2:
                    return '保险拒赔'
            }
        },
        filterStatus(v){
            switch(v){
                case 0:
                    return '未交案'
                case 1:
                    return '已交案'
            }
        },
        filterdeal_type(v){
            if(v===undefined){
                return ''
            }
            if(v==0){
                return '未赔付'
            }else{
                return '已赔付'
            }
        }
    }
}
</script>
<style lang="less" scoped>
    .container{
        min-height: 100vh;
        background: #f6f6f6;
        padding-bottom: .9rem;
        .info-wrap{
            padding: .12rem;
            background: #fff;
            margin-bottom: .15rem;
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
                    width: 1.2rem;
                    color: #999;
                }
                .val{
                    color: #000;
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
                &.cancel{
                    background:  #D8D8D8;
                    color: #666;
                }
                &.comfirm{
                    background: #4A4A4A;
                    color: #fff;
                }
            }
        }
        .tip{
            position: fixed;
            bottom: .74rem;
            left: 0;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            .txt{
                margin-right: .09rem;
                font-size: 12px;
                color: #666666;
            }
            .icon{
                width: .14rem;
                height: .14rem;
                background: url('../images/icon_desc.png') no-repeat;
                background-size:100% 100%;
            }
        }

    }
</style>



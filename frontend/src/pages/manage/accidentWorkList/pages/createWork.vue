<template>
    <div class="container">
        <div class="cell">
            <formCell label="车牌号">
                <div slot="inputbox" class="cell-item" >
                    <div class="item-input-box">{{plate_no}}</div>
                </div>
            </formCell>
        </div>
        <formCell label="是否为员工出险" required="true">
            <div class="checkbox" slot="inputbox">
                <div class="item" :class="is_like_staff===item.id?'on':''" v-for="(item,index) in radioList" :key="index" @click="selectInsurance(item.id)">{{item.name}}</div>
            </div>
        </formCell>
        <formCell label="立刻账号" >
            <div slot="inputbox" class="cell-item" >
                <input type="text" v-model="like_user"  :placeholder="is_like_staff==0?'请输入立刻账户(必要)':'请输入立刻账户(可选)'" class="item-input-box">
                <div class="btn" :class="{'blue':like_user.length!=''}" @click="goConnectRentalPage" >{{selectIndex===''?'关联订单信息':'修改订单信息'}}</div>
            </div>
        </formCell>
        <formCell label="联系方式">
            <input type="text" v-model="like_user_mobile" slot="inputbox" placeholder="请输入电话号码(可选)" class="input-box">
        </formCell>
        
        <div class="row">
            <formCell label="事故类型" required="true">
                <div class="checkbox" slot="inputbox">
                    <div class="item" :class="type==item.id?'on':''" v-for="(item,index) in typeList" :key="index" @click="selectType(item.id)">{{item.name}}</div>
                </div>
            </formCell>
        </div>
        <div class="textArea">
            <div class="title">备注：</div>
            <textarea name="" id="" cols="30" rows="10" v-model="remarks" ></textarea>
            <div class="count">{{counntRemarks}}/150</div>
        </div>
        <div class="footer">
            <div class="cancel-btn" @click="goWorkListPage">取消</div>
            <div class="comfirm-btn" @click="createOrder">确定</div>
        </div>
    </div>
</template>
<script>
import formCell from '../components/formCell.vue'
import { DDBase } from '../../../../../other_modules/like-manageOrder/ddSDK'
import { mapState }  from 'vuex'
import { Toast } from 'mint-ui';
export default {
    components:{
        formCell
    },
    data(){
        return{
            remarks:'',
            radioList:[{id:1,name:'是'},{id:0,name:'否'}],
            typeList:[{id:1,name:'单方事故'},{id:2,name:'多方事故'}],
            plate_no:''
        }
    },
    computed:{
        ...mapState('createWork',[
            'is_like_staff',
            'type',
            'selectIndex',
            'rentalList'
        ]),
        like_user:{
            get(){
                return this.$store.state.createWork.like_user
            },
            set(val){
                this.$store.commit('createWork/setLike_user', val)
            }
        },
        like_user_mobile:{
            get(){
                return this.$store.state.createWork.like_user_mobile
            },
            set(val){
                this.$store.commit('createWork/setLike_user_mobile', val)
            }
        },
        counntRemarks(){
            return this.remarks.length
        }
    },
    watch:{
        remarks(v){
            if(v.length>150){
                this.remarks = this.remarks.substr(0,150)
            }
            this.$store.commit('createWork/setRemark',this.remarks)
        }
    },
    created(){
        DDBase.setWebTitle('创建事故保险工单')
        this.$store.commit('createWork/setCarId',this.$route.query.car_id)
        this.plate_no = this.$route.query.plate_no
    },
    methods:{
        async createOrder(){
            this.$store.dispatch('createWork/createOrder',this.$router)
        },
        selectInsurance(index){
            this.$store.commit('createWork/setIs_like_staff',index)
        },
        selectType(id){
            this.$store.commit('createWork/setType',id)
        },
        goConnectRentalPage(){
            if(this.is_like_staff===''){
                Toast('请选择是否为员工出险')
                return 
            }
            if(this.is_like_staff==0 && this.like_user===''){
                Toast('请先输入立刻账号')
                return
            }
            this.$router.push('connectRental')
        },
        goWorkListPage(){
            this.$router.replace('/')
        }
    }
}
</script>
<style lang="less" scoped>
    .container{
        min-height:100vh;
        background: #f6f6f6;
        .cell{
            margin-bottom: .1rem;
        }
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
            height: 100%;
            line-height: .53rem;
            font-size: .14rem;
            color: #999999;
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



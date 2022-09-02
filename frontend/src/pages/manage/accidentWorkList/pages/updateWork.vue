<template>
    <div class="container">
        <formCell label="立刻账户">
            <div slot="inputbox" class="desc">{{info.like_user}}</div>
        </formCell>
        <formCell label="是否为员工出险">
            <div slot="inputbox" class="desc">{{info.is_like_staff|filterStaff}}</div>
        </formCell>
        <div class="hr"></div>
        <formCell label="联系方式">
            <input type="text" v-model="like_user_mobile" slot="inputbox" placeholder="请输入电话号码(可选)" class="input-box">
        </formCell>
        <formCell label="是否有人受伤" required="true">
            <div class="checkbox" slot="inputbox">
                <div class="item" :class="isAnyoneInjured===item.id?'on':''" v-for="(item,index) in radioList" :key="index" @click="selectInsurance(item.id)">{{item.name}}</div>
            </div>
        </formCell>
        <formCell label="事故类型" required="true">
            <div class="checkbox" slot="inputbox">
                <div class="item" :class="type==item.id?'on':''" v-for="(item,index) in typeList" :key="index" @click="selectType(item.id)">{{item.name}}</div>
            </div>
        </formCell>
        <formCell label="三者车牌" v-show="type==2">
            <input type="text" v-model="plate_no" slot="inputbox" placeholder="多个请用'、'隔开" class="input-box">
        </formCell>
        <formCell label="三者联系方式" v-show="type==2">
            <input type="text" v-model="otherMobile" slot="inputbox" placeholder="多个请用'、'隔开" class="input-box">
        </formCell>
        <div class="textArea">
            <div class="title">
                <span style="color:red">*</span>
                <span>受损部位：</span>
            </div>
            <textarea name="" id="" cols="30" rows="10" v-model="injuredDesc" ></textarea>
            <div class="count">{{counntInjuredDesc}}/150</div>
        </div>
        <div class="textArea">
            <div class="title">备注：</div>
            <textarea name="" id="" cols="30" rows="10" v-model="remark" ></textarea>
            <div class="count">{{counntRemarks}}/150</div>
        </div>
        <div class="row">
            <Cell label="上传事故照片" required="true" @press="goUpdateImgPage"/>
        </div> 
        <div class="footer">
            <div class="cancel-btn" @click="handleCancel">取消</div>
            <div class="comfirm-btn" @click="update">确定</div>
        </div>
    </div>
</template>
<script>
import formCell from '../components/formCell.vue'
import Cell from '../components/cell'
import tool from '../js/tools'
import { Toast } from 'mint-ui'
import { mapState, mapActions } from 'vuex'
import { DDBase } from '../../../../../other_modules/like-manageOrder/ddSDK'
export default {
    components:{
        formCell,
        Cell
    },
    data(){
        return{
            radioList:[{id:1,name:'是'},{id:0,name:'否'}],
            typeList:[{id:1,name:'单方事故'},{id:2,name:'多方事故'}]
        }
    },
    computed:{
        ...mapState('workDetail',[
            'isAnyoneInjured',
            'type',
            'info',
            'accidentImgUrl',
        ]),
        like_user_mobile:{
            get(){
                return this.$store.state.workDetail.like_user_mobile
            },
            set(val){
                this.$store.commit('workDetail/setLike_user_mobile', val)
            }
        },
        plate_no:{
            get(){
                return this.$store.state.workDetail.plate_no
            },
            set(val){
                this.$store.commit('workDetail/setPlate_no', val)
            }
        },
        otherMobile:{
            get(){
                return this.$store.state.workDetail.otherMobile
            },
            set(val){
                this.$store.commit('workDetail/setOtherMobile', val)
            }
        },
        remark:{
            get(){
                return this.$store.state.workDetail.remark
            },
            set(val){
                this.$store.commit('workDetail/setRemark', val)
            }
        },
        injuredDesc:{
            get(){
                return this.$store.state.workDetail.injuredDesc
            },
            set(val){
                this.$store.commit('workDetail/setInjuredDesc', val)
            }
        },
        counntRemarks(){
            return this.remark.length
        },
        counntInjuredDesc(){
            return this.injuredDesc.length
        }
    },
    watch:{
        remark(v){
            if(v.length>150){
                this.$store.commit('workDetail/setRemark',v.substr(0,150))
            }  
        },
        injuredDesc(v){
            if(v.length>150){
                this.$store.commit('workDetail/setInjuredDesc',v.substr(0,150))
            }

        },   
    },
    created(){
        DDBase.setWebTitle('更新事故工单')
    },
    methods:{
        ...mapActions('workDetail',[
            'updateAccident'
        ]),
        goWorkListPage(){
            this.$router.replace('/')
        },
        handleCancel(){
            this.$router.go(-1)
        },
        update(){
            if(this.like_user_mobile!=''){
                if(!tool.checkPhone(this.like_user_mobile)){
                    Toast('请输入正确的联系方式')
                    return
                }
            }
            if(this.type==2 && this.otherMobile!=''){
                if(!tool.checkPhones(this.otherMobile)){
                    Toast('三者联系方式格式有误')
                    return
                }
            }
            if(this.type==2 && this.plate_no!=''){
                
                if(!tool.checkCarNums(this.plate_no)){
                    Toast('三者车牌格式有误')
                    return
                }
            }
            if(this.isAnyoneInjured===''){
                Toast('请选择是否有人受伤')
                return
            }
            if(this.type===''){
                Toast('请选择事故类型')
                return
            }
            if(this.injuredDesc===''){
                Toast('请输入受伤部位')
                return
            }
            if(this.accidentImgUrl.length===0){
                Toast('请上传事故照片')
                return
            }
            this.updateAccident(this.$router)
        },
        selectInsurance(index){
            this.$store.commit('workDetail/setIsAnyoneInjured',index)
        },
        selectType(id){
            this.$store.commit('workDetail/setType',id)
        },
        goUpdateImgPage(){
            this.$router.push('updateAccidentImages')
        }
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
        }
    }
}
</script>
<style lang="less" scoped>
    .container{
        min-height:100vh;
        background: #f6f6f6;
        padding-bottom: .8rem;
        .hr{
            height: .1rem;
        }
        .input-box{
            width: 100%;
            height: .4rem;
            display: block;
            font-size: .14rem;
            color: #333;
        }
        .cell-item{
            width:100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .item-input-box{
                flex:1;
                height: .4rem;
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
            color: #333;
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



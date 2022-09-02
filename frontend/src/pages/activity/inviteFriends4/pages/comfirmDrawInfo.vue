<template>
    <div>
        <draw-header :title="title"/>
        <div class="wrap">
            <p>本次提现金额</p>
            <div class="price">¥<span>{{uMoney}}</span></div>
            <div class="userInfo">提现支付宝账号：<span>{{uPhone}}</span></div>
            <div class="userInfo">姓名：<span>{{uName}}</span></div>
            <div class="edit" @click="handleClickEdit()"><span>编辑</span></div>
            <button @click="handleClickDraw()">确认提现</button>
        </div>
    </div>
</template>

<script>
    import DrawHeader from "../components/drawHeader"
    import myAjax from "../../../../../other_modules/like-request/withAxiosV2";
    import {getApiUrl} from "../js/getApiUrl";
    import {mapGetters} from 'vuex'
    import format from "../../../../../other_modules/like-function/format";
    import { maskMobile,maskEmail,maskChineseName } from "../../../../../other_modules/like-function/desensitized";
    export default {
        name:"comfirmDrawInfo", // 提现人信息确认
        data(){
            return {
                title:"确认提现信息",
                uMoney:"0.00",
                uPhone:"",
                uName:"",
                hiddPhone:""
            }
        },
        components:{
            DrawHeader
        },
        computed:{
            ...mapGetters(['publicArguments'])
        },
        methods:{
            // 点击编辑用户信息，跳转到输入页面;
            handleClickEdit(){
                this.$router.replace({
                    path:"drawInfo",
                    query:{
                        uPhone:this.uPhone,
                        uName:this.uName,
                    }
                })
            },
            // 点击确定，提现，并提交用户信息
            handleClickDraw(){                
                let data ={
                    transfer_type: 1 ,
                    activity_id: 1050,
                    realname: this.$route.query.uName,
                    account: this.$route.query.uPhone
                }
                myAjax.post(getApiUrl('/cash/transfer'),{...data,...this.publicArguments}).then(res=>{   
                    if(res.status === 0){     
                        this.$router.replace({
                            path:"/successDraw",
                            query:{
                                uMoney:this.uMoney,
                                uPhone:this.hiddPhone
                            }
                        })
                    }else{
                        this.$_LIKE_toast(res.msg)
                    }
                }).catch(err=>{
                    console.log(err);
                })
            }

        },
        computed:{
            ...mapGetters(['publicArguments'])
        },
        created() {
            this.uPhone = this.$route.query.uPhone;          
            if(/^1[3456789]\d{9}$/.test(this.uPhone)){
                this.hiddPhone = maskMobile(this.uPhone)
            }else{                
                this.hiddPhone = maskEmail(this.uPhone)
            }     
            
            this.uName = this.$route.query.uName

            myAjax.post(getApiUrl('/activity-invite-cash/invite-detail'),this.publicArguments)
            .then(res=>{
                if(res.status === 0){          
                    this.uMoney = format.money(res.data.cash);
                }else{
                    throw res
                }
            })            
        },
        beforeRouteLeave (to, from, next) {
            next();  
            if(to.path === "/main"){
                this.$router.push("/drawInfo")
            }       
        }
    }
</script>

<style scoped lang="less">
    .wrap{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        padding: .34rem .35rem;
        p{
            font-size: 21px;
            color: #4A4A54;
            padding-bottom: .2rem;
        }
        .price{
            color: #FE1A15;
            font-size: 15px;
            padding-bottom: .26rem;
            span{
                font-size: 30px;
                line-height: .3rem;
                display: inline-block;
                padding-left: .1rem;
            }
        }
        .userInfo{
            width: 100%;
            font-size: 16px;
            color: #A0A0A0;
            padding-bottom: .12rem;
            span{
                padding-top: .01rem;
                color: #000;
                float: right;
                width: 1.69rem;
                text-align: right;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
        .edit{
            width: 100%;
            text-align: right;
            margin-top: .18rem;
            span{
                padding-left:.2rem;
                color: #A0A0A0;
                font-size: 16px;
                background: url("../images/edit.png") no-repeat;
                background-size: 15px 14px;
                background-position: left center;
            }
        }
        button{
            outline: none;
            width: 100%;
            height: .45rem;
            border-radius: .02rem;
            letter-spacing: .02rem;
            background: #FC241C;
            font-size: 18px;
            color: #FFF;
            border: none;
            margin-top: .29rem
        }
    }
</style>
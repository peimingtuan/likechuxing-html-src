<template>
    <div class="container">
        <draw-header :title="title" />
        <div class="userInfo">
            <input type="text" placeholder="请输入支付宝账号" v-model="uPhone" />
            <input type="text" placeholder="请输入真实姓名" v-model="uName" />
            <button @click="handClickNext()">下一步</button> 
            <p v-show="isShowRule">请勿将本页以任何形式分享给他人，由此造成的损失将由您个人承担。</p>
        </div>
    </div>
</template>

<script>
    import DrawHeader from "../components/drawHeader"
    import myAjax from "../../../../../other_modules/like-request/withAxiosV2";
    import {getApiUrl} from "../js/getApiUrl";
    import {mapGetters} from 'vuex'
    import env from '../../../../../other_modules/like-env'
    export default {
        name:"drawInfo", // 输入提现人信息
        data(){
            return {
                title:"输入提现信息",
                uPhone:"",
                uName:"",
                isLogin:"",
                isShowRule:true
            }
        },
        components:{
            DrawHeader
        },
        
        computed:{
            ...mapGetters(['publicArguments'])
        },
        methods:{
            // 点击下一步
            handClickNext(){    
                if(this.infoVerify()){
                    this.$router.replace({
                        path:"/comfirmDrawInfo",
                        query:{
                            uPhone:this.uPhone.replace(/(^\s*)|(\s*$)/g,""),
                            uName:this.uName.replace(/(^\s*)|(\s*$)/g,"")
                        }
                    })
                }
            },
            // 信息验证
            infoVerify(){
                // 是否为邮箱或者手机号
                let emailReg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9]{2,6}$/
                let phoneReg = /^1[3456789]\d{9}$/
                // 2-8位汉子
                let nameReg = /^[\u4E00-\u9FA5]{2,8}$/;                
                if(this.isLogin === 6001){
                    this.$_LIKE_toast("请在设置中退出,重新登录!")
                    return
                } 
                if(this.uPhone == ""){                    
                    this.$_LIKE_toast('请输入账号');
                    return;  
                }
                if(!emailReg.test(this.uPhone) && !phoneReg.test(this.uPhone.replace(/(^\s*)|(\s*$)/g,""))){
                    this.$_LIKE_toast('请检查账号是否输入正确');
                    return;
                }
                if(this.uName == ""){
                    this.$_LIKE_toast('请输入姓名');
                    return;  
                }
                if(!nameReg.test(this.uName.replace(/(^\s*)|(\s*$)/g,""))){
                    this.$_LIKE_toast('请检查姓名是否输入正确');
                    return;  
                }
                return 1;
            },
            handleErr(err){
                console.log(err)
                if(err && err.msg){
                    this.$_LIKE_toast(err.msg)
                }
            },
        },
        created() {            
            myAjax.post(getApiUrl('/activity-invite-cash/invite-detail'),this.publicArguments).then(res=>{                    
                if(res.status === 0){   
                    if(Number(res.data.history_money)){
                        this.uPhone = res.data.account;
                        this.uName = res.data.realname;                                               
                    }                                        
                    if(this.$route.query.uPhone){                
                        this.uPhone = this.$route.query.uPhone;
                        this.uName = this.$route.query.uName;                                              
                    }
                }else{
                    this.isLogin = res.status;
                    this.$_LIKE_toast(res.msg);
                }
            }).catch(this.handleErr)       
            
            if(env.IsInLike){
                this.isShowRule == true
            }
        },
    }
</script>

<style scoped lang="less">
    .container{
        .userInfo{
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            padding: .34rem .38rem;
            input,button{
                box-sizing: border-box;
                outline: none;
                width: 100%;
                height: .45rem;
                border: .01rem solid #C0C1C2;
                margin-bottom: .15rem;
                border-radius: .02rem;
                padding-left: .15rem;
                background: #FCFDFE;
                letter-spacing: .02rem;
                
            }
            input{
                font-size: 16px;
                &::-webkit-input-placeholder{
                    color: #A4A5A7;
                    font-size: 16px;

                }
            }
            button{
                padding: none;
                background: #FC241C;
                border: none;
                color: #FFF;
                font-size: 18px;
            }
            p{
                font-size: 13px;
                color: #908F8F;
                text-align: center;
            }  
        }
    }
</style>
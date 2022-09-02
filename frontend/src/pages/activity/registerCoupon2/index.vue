<template>
    <div class="container">
        <div class="indexpage" v-show="show">
            <div class="header"></div>
            <div class="phone-wrap">
                <input type="number" maxlength="11" v-model="phone" class="phone" placeholder="请输入手机号">
            </div>
            <div class="send-btn" @click="getCode">点击体验免费出行</div>
            <CodeDialog :show="codeShow" :showCount="showCount" :count="s" @sendCode="getCoupon" :tip="tip" @hodeCodeBox="hodeCodeBox" @reSend="reSend" @clearTip="clearTip" />
            <div class="coop">
                <div class="logo"></div>
                <div class="text">蚂蚁金服战略投资企业</div>
            </div>
        </div>
        <OldUser :downloadUrl="url" :show="showOld"/>
        <NewUser :downloadUrl="url" :show="showNew"/>
    </div>
</template>
<script>
import http from '../../../../other_modules/like-request/withAxiosV2'
import { getActivityApiUrl as api } from '../../../../other_modules/url-constructor'
import { Toast } from '../../../../other_modules/vue-plugins/like-base'
import wxShare from './js/wxShare'
import like from './js/like'
import CodeDialog from './components/codeDialog.vue'
import OldUser from './components/oldUser.vue'
import NewUser from './components/newUser.vue'
wxShare()
export default {
    name:'index',
    components:{
        CodeDialog,
        OldUser,
        NewUser
    },
    data(){
        return {
            show:true,
            showOld:false,
            showNew:false,
            query:{},
            phone:'',
            codeShow:false,
            showCount:false,
            s:60,
            tip:'',
            url:''
        }
    },
    created(){
        this.url = like.getDownLoadUrl()
        this.query = this.getQuery(window.location.href).query
        let flag = localStorage.getItem('ruser');
        if(flag==0){
            this.showNew = false;
            this.showOld = true
            this.show = false;
            this.codeShow = false
        }
    },
    methods:{
        clearTip(){
            this.tip = ''
        },
        hodeCodeBox(){
            this.tip = ''
            this.codeShow = false
        },
        reSend(){
            this.tip = ''
            this.getCode();
        },
        getCode(){   
            let { phone, showCount } = this;
            let phoneReg = /^1[3456789]\d{9}$/
            if(phone==''){
                Toast('手机号不能为空')
                return
            }
            if(!phoneReg.test(phone)){
                Toast('请输入正确的手机号')
                return
            } 
            if(this.s<60&&localStorage.getItem('rphone')==phone){
                 this.codeShow = true 
                 return
            }else{
                this.countDown()
            }
            const _this = this;
            http.post(api('/login/get-code'),{phone}).then(res=>{
                if(res.status==0){
                    localStorage.setItem('rphone',phone)
                    _this.codeShow = true
                }else if(res.status==3016){
                    Toast({
                        msg:res.msg,
                        duration:1000,
                        toastCallback:()=>{
                           _this.codeShow = true 
                        }
                    })
                }else{
                    Toast(res.msg)
                }
            })
            
        },
        countDown(){
            this.showCount = true
            let s = 60
            const _this = this;
            this.timer&&clearInterval(this.timer)
            this.timer = setInterval(()=>{
                s--;
                if(s==0){
                    clearInterval(this.timer)
                    _this.showCount = false;
                    s = 60;
                }
                _this.s = s
            },1000)
        },
        getCoupon(v){
            let { phone, query } = this;
            let code = v.substr(0,4)
            let phoneReg = /^1[3456789]\d{9}$/
            if(phone==''){
                Toast('手机号不能为空')
                return
            }
            if(!phoneReg.test(phone)){
                Toast('请输入正确的手机号')
                return
            }
            if(code==''){
                Toast('验证码不能为空')
                return
            }
            if(!/\d{4}/.test(phone)){
                Toast('请输入正确的验证码')
                return
            }
            if(query.channel==''||!query.channel){
                return
            }
            let data = {
                phone,
                code,
                channel:query.channel
            }
            let _this = this;
            http.post(api('/web/verify-code'),data).then(res=>{
                if(res.status==0){
                    localStorage.setItem('ruser',0)
                    if(res.data.new_user==1){
                        _this.showNew = true;
                        _this.showOld = false
                        _this.show = false;
                        _this.codeShow = false
                    }else{
                        _this.showNew = false;
                        _this.showOld = true
                        _this.show = false;
                        _this.codeShow = false
                    }
                }else{
                    // _this.tip = ''
                    // setTimeout(()=>{
                    //     _this.tip = res.msg
                    // },1000)
                    _this.tip = res.msg
                }
            }).catch(err=>{
                console.log(err)
            })
        },
        getQuery(url){
            let
            res = {
                query: {}
            },
            reg = /([^?=&]+)=([^?=&]+)/g;

            url.split('#')[0].replace(reg, function () {
                res.query[arguments[1]] = arguments[2];
            })
            let index = url.indexOf('?');
            res.origin = index === -1 ? url : url.substr(0, index);
            return res;
        },
        beforeDestory(){
            this.timer&&clearInterval(this.timer)
        }
    }
}
</script>


<style lang="less">
    body{
        background: #fff;
    }
    * {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
    }
    .container{
        .header{
            width: 100%;
            height: 3.92rem;
            background:url('./images/header_bg.png') no-repeat top center;
            background-size:100% 100%;
        }
        .phone-wrap{
            display: flex;
            justify-content: center;
            align-items: center;
            .phone{
                display: block;
                width:2.75rem;
                height: 0.46rem;
                border: 1px solid #d34548;
                border-radius: .22rem;
                text-align: center;
                color:#211815;
                font-size: .15rem;
                text-indent: 0;
                background: transparent;
                resize:none; 
                outline:none; 
                -webkit-appearance:none;  
                line-height: normal;
            }
        }
        .send-btn{
            width:2.75rem;
            height: 0.46rem;
            border-radius: .22rem;
            text-align: center;
            color:#fff;
            font-size: .15rem;
            text-indent: 0;
            background: #d34548;
            line-height: .46rem;
            margin: .21rem auto 0
        }
        .coop{
            padding: 0.3rem 0;
            font-size: 13px;
            text-align: center;
            color:#909090;
            .logo{
                margin:0.06rem auto;
                width: 62px;
                height: 30px;
                background: url('./images/mayi.png') no-repeat center;
                background-size: 100% auto;
            }
        }
    }
</style>


<template>
    <div class="container">
        <div class="header"></div>
        <div v-show="!show">
            <div class="form-group">
                <input class="phone-input" max="11" v-model="phone" type="number"  placeholder="请输入手机号">
                <div class="code-wrap">
                    <div class="input-wrap">
                        <input max="4" type="number" v-model="code" placeholder="验证码">
                    </div>  
                    <div class="get-code-btn" :class="showCount?'on':''">
                        <div class="des" @click="getCode">获取验证码</div>
                        <div v-show="showCount"> ({{s}}s)</div>
                    </div>
                </div>
                <div class="btn" @click="getCoupon">点击提交</div>
            </div>
            <div class="tip">此活动仅限立刻出行新用户参与</div>
            <div class="list"></div>
            <div class="desc">
                <span class="h">
                    【立刻出行】
                </span>
                是一款新一代的共享用车平台，用车全程app操作，即取即还。您可以在广州，成都，武汉，南京，长沙，佛山6个城市的数千个网点发现我们，万台车辆随时待命。
            </div>
            <div class="footer"></div>
        </div>
        <Dialog :show="show" :downloadUrl="url"/>
        <OldDialog :show="showErr" :downloadUrl="url"/>
    </div>
</template>
<script>
import Dialog from './components/dialog'
import OldDialog from './components/oldDialog'
import http from '../../../../other_modules/like-request/withAxiosV2'
import { getActivityApiUrl as api } from '../../../../other_modules/url-constructor'
import { Toast } from '../../../../other_modules/vue-plugins/like-base'
import like from './js/like'
import wxShare from './js/wxShare'
wxShare()
export default {
    components:{
        Dialog,
        OldDialog
    },
    data(){
        return {
            show:false,
            query:{},
            phone:'',
            code:'',
            showCount:false,
            s:60,
            url:'',
            showErr:false
        }
    },
    created(){
        this.url = like.getDownLoadUrl()
        this.query = this.getQuery(window.location.href).query
        let flag = localStorage.getItem('bekky_new_user')
        if(flag==0){
            this.showErr = true
            this.show = true
        }else if(flag==1){
            this.showErr = false
            this.show = true
        }
    },
    methods:{
        getCode(){
            
            let { phone, showCount } = this;
            let phoneReg = /^1[3456789]\d{9}$/
            if(showCount){
                return
            }
            if(phone==''){
                Toast('手机号不能为空')
                return
            }
            if(!phoneReg.test(phone)){
                Toast('请输入正确的手机号')
                return
            } 
            this.countDown()
            let data = {
                phone,
                activity_id:1039
            }
            http.post(api('activity/common-get-code'),data).then(res=>{
                if(res.status==0){
                    Toast('发送成功')
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
        getCoupon(){
            let { phone, query, code } = this;
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
                activity_id:1039,
                channel:query.channel
            }
            let _this = this;
            http.post(api('activity/common-verify-code'),data).then(res=>{
                if(res.status==0){
                    localStorage.setItem('bekky_new_user',res.data.new_user)
                    if(res.data.new_user==0){
                        _this.showErr = true
                        _this.show = true
                    }else{
                         _this.showErr = false
                        _this.show = true
                    }   
                }else{
                    if(res.data.hasOwnProperty('new_user')){
                        _this.showErr = true
                        _this.show = true
                        localStorage.setItem('bekky_new_user',0)
                    }else{
                        Toast(res.msg)
                    }         
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
         height: 4.005rem;
         background:url('./images/header.png') no-repeat;
         background-size:100% 100%;
     }
     .list{
         width: 100%;
         height: 3.66rem;
         background:url('./images/list.png') no-repeat;
         background-size:100% 100%;
         margin-bottom: 0.2rem;
     }
     .desc{
        .span{
            font-size: .13rem;
            color: #535353;
            font-weight: 700;
        }
        font-size: .14rem;
        color: #535353;
        line-height: .24rem;
        padding: 0 .6rem;
     }
     .footer{
         margin: .37rem auto .34rem;
         width: .22rem;
         height: .06rem;
         background: #0086ff;
     }
     .form-group{
         padding: .25rem .38rem .23rem;
         .phone-input{
            width: 100%;
            height: .45rem;
            font-size: .18rem;
            border-radius: .22rem;
            padding:0 .23rem;
            border: 1px solid #0086ff;
            margin-bottom: .21rem;
            background: transparent;
            resize:none; 
            outline:none; 
            -webkit-appearance:none;  
            display: block; 
            color:#636363;
            line-height:normal;
            &::-webkit-input-placeholder{
                font-size: .16rem;
                line-height: .22rem;
            }
        }
        .btn{
             height: .45rem;
             font-size: .20rem;
             background: #0086ff;
             border-radius: .22rem;
             text-align: center;
             line-height: .45rem;
             color: #fff;
        }
        .code-wrap{
            width: 100%;
            height: .45rem;
            padding-left: .23rem;
            border-radius: .22rem;
            border: 1px solid #0086ff;
            margin-bottom: .21rem;
            text-indent: 0;
            background: transparent;
            display: flex;
            align-items: center;
            .input-wrap{
                flex:1; 
            }
            input{
                height: .45rem;
                font-size: .18rem;
                border: none;
                background: transparent;
                resize:none; 
                outline:none; 
                -webkit-appearance:none;  
                display:block;   
                color:#636363;
                width:100%; 
                &::-webkit-input-placeholder{
                    font-size: .16rem;
                    line-height: .22rem;
                }
            }
            .get-code-btn{
                font-size: .14rem;
                width: 1.5rem;
                height: 0.25rem;
                border-left: 0.02rem solid #0086ff;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 0.17rem;
                color: #0086ff;
                &.on{
                    color:#ccc;
                }
            }
        }
     }
     .tip{
        color: #1B2A31;
        font-size: .12rem;
        text-align: center;
        font-weight: 700;
    }
 }
</style>


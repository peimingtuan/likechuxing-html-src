<template>
    <div class="container">
        <div class="header">
            <div class="user-info">
                <span>亲爱的</span>
                <span class="username">{{phone}}</span>
            </div>
            <div class="desc" v-if="new_user">欢迎加入立刻出行</div>
            <div class="desc" v-else>您是立刻出行老司机</div>
            <div class="icon"></div>
        </div>
        <div class="body">
            <!-- <div class="desc">点击下方图片参加活动，赶快去分钱吧！</div> -->
            <div class="icon"></div>
        </div>
        <div class="coupon" v-show="new_user">
            <div class="title">恭喜您获得一张优惠券</div>
            <div class="icon"></div>
        </div>
        <div class="btn" @click="goDownLoad" :style="IphoneXStyle">打开立刻出行</div>
    </div>
</template>

<script>
    import env from '../../../../../other_modules/like-env'
    import userData from '../js/UserData'
    import { IsIos } from "../../../../js/UserAgent.js";
  
    export default {
        name: "registerFinish",
        data(){
            return{
                phone:'',
                new_user:'',
                downLoadUrl:'',
                IphoneXStyle:""
            }
        },
        created(){
            this.phone = this.$store.state.phone;
            this.new_user = this.$store.state.new_user;
            this.downLoadUrl = this.getDownLoadUrl()

            if(userData.state.hasOwnProperty('new_user'))this.new_user = userData.state.new_user
            if(userData.state.phone)this.phone = userData.state.phone
            if(userData.state.uuid)this.$store.commit('setUuid', userData.state)
            if((window.screen.width/window.screen.height)<0.5 && IsIos()){
                this.IphoneXStyle="paddingBottom:.15rem;"
            }
            
        },
        methods:{
            goDownLoad(){
                location.href = this.downLoadUrl
            },
            goIndex(){
                // 只有在微信才能分享
                
                if(env.isWeiXin){ 
                    this.$router.replace({
                        path:'main',
                    })   
                }else{
                    location.href = this.downLoadUrl
                }
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
            getPlatform(){
                var platform = navigator.userAgent;
                if(/android/i.test(platform)){
                    return 'android'
                }else if(/(iPhone|iPad|iPod|iOS)/i.test(platform)){
                    return 'ios'
                }else{
                    return 'web'
                }
            },
            getDownLoadUrl(){
                if(this.getPlatform()=='ios'){
                    return 'https://itunes.apple.com/cn/app/id1245529926?mt=8'
                }else{
                    return 'http://a.app.qq.com/o/simple.jsp?pkgname=com.like.car'
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .container{
        padding: .44rem .3rem;
        min-height: 100vh;
        box-sizing: border-box;
        position: relative;
        .header{
            .user-info{
                text-align: center;
                font-size: 16px;
                color: #1B1B21;
                margin-bottom: .07rem;
                .username{
                    color:#fe1a15;
                }
            }
            .desc{
                font-size: 20px;
                color: #1B1B21;
                text-align: center;
            }
            .icon{
                width: .2rem;
                height: .04rem;
                background:rgba(254,26,21,1);
                opacity:0.35;
                margin:.28rem auto .25rem;
            }
        }
        .body{
            .desc{
                font-size: 16px;
                color: #848484;
                margin-bottom: .1rem;
            }
            .icon{
                height: 1.18rem;
                background: url('../images/invite_btn3.png') no-repeat;
                background-size: 100% 100%;
                margin-bottom: .36rem;
            }
        }
        .coupon{
            .title{
                font-size: 16px;
                color: #1B1B21;
            }
            .icon{
                height: 1.05rem;
                background: url('../images/coupon.jpg') no-repeat;
                background-size: 100% 100%;
                margin: .1rem auto .41rem;
            }
        }
        .btn{
            position: absolute;
            bottom:0;
            left:0;
            width: 100%;
            height: .45rem;
            color: #fff;
            background: #FC241C;
            font-size: .17rem;
            line-height: .45rem;
            text-align: center;
            border-radius: 2px;
        }
    }
</style>

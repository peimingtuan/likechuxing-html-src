<template>
    <div id="enterhome">
        <div class="login">
            <div>
                <img v-if="img1" class="img1" src="../images/phone.png">
                <img v-else="img1" class="img1" src="../images/phone2.png">

                <div class="div1" :class="img1?'':'bordercolor'">
                    <input class="phone" type="number" oninput="if(value.length>11)value=value.slice(0,11)" maxlength="11" placeholder="手机号" @input.trim="keyupall($event)">
                    <img class="input_clearn" @mousedown="clearInput($event)" v-show="!img1"
                         src="../images/close.png"/>
                </div>
            </div>
            <div class="last">
                <img v-if="img2" class="img2 img1" src="../images/code.png">
                <img v-else="img2" class="img2 img1" src="../images/code2.png">

                <div class="div2" :class="img2?'':'bordercolor'">
                    <input class="vcode" type="number" oninput="if(value.length>6)value=value.slice(0,6)" maxlength="6" placeholder="验证码" @input.trim="keyupall2($event)">
                    <img class="input_clearn2" @mousedown="clearInput2($event)" v-show="!img2"
                         src="../images/close.png"/>
                    <button class="get-code" :class="img1?'':'codecolor'">获取验证码</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    require("../css/enterhome.css")
    import $ from 'jquery'
    import getApiUrl from '../js/getApiUrl'
    import FoundationTools from '../js/functionAjax'
    import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
    import {Indicator} from 'mint-ui'
    export default{
        data ()
    {
        return {
            //验证输入框
            img1: true,
            img2: true,
            isnone: false,//是否可以自动登录
            timer:''//定时器
        }
    }
    ,
    created()
    {
        $("body").css("background", "#fff");
    }
    ,
    mounted()
    {
        //手机号验证
        var tel = /^1[3456789]\d{9}$/,
                vCodeFlag = true,
                vCodeTimer = 60;
        var _this = this;
        //获取验证码
        function codeTimer() {
            if (vCodeTimer < 0) {
                $(".get-code").text("获取验证码");
                vCodeFlag = true;
                vCodeTimer = 60;
            } else {
                $(".get-code").text(vCodeTimer + 's');
                vCodeTimer = vCodeTimer - 1;
                _this.timer=setTimeout(function () {
                    codeTimer();
                }, 1000)
            }
        }

        //获取验证码
        $(".get-code").on("click", function () {
            if (vCodeFlag) {
                if (!tel.test($(".phone").val())) {
                    if ($(".phone").val() == '') {
                        _this.$_LIKE_toast("请输入手机号")
                    } else {
                        _this.$_LIKE_toast("请输入正确的手机号")
                        $(".phone").val('');
                    }
                    _this.img1 = true;
                    return false;
                }
                myAjax.post(getApiUrl('/wash/user/send-code'), {//发送验证码
                    phone: $(".phone").val()
                }).then(res =>{
                    if (res.status === 0){
                    _this.$_LIKE_toast("发送成功");
                    _this.isnone = true;
                }else
                {
                    _this.$_LIKE_toast(res.msg)
                }
            }
            ).catch(err =>{
                console.log(err)
        })
        vCodeFlag = false;
        codeTimer();
    }
    })
    ;
    }
    ,
    methods: {
        //输入手机号
        keyupall(e)
        {
            if ($(".phone").val().replace(/(^\s*)|(\s*$)/g, '') != '') {//去除空格
                if ($(".phone").val().length > 0) {
                    this.img1 = false;
                } else {
                    this.img1 = true;
                }
            } else {
                this.img1 = true;
            }
        }
    ,
        //输入验证码
        keyupall2(e)
        {
            if ($(".vcode").val().replace(/(^\s*)|(\s*$)/g, '') != '') {//去除空格
                if (!this.isnone) {
                    this.$_LIKE_toast("请先获取验证码");
                    $(".vcode").val('');
                    return false;
                }
                if ($(".vcode").val().length > 0) {
                    this.img2 = false;
                    if ($(".vcode").val().length === 6) {
                        this.goenter($(".vcode").val());
                    }
                } else {
                    this.img2 = true;
                }
            } else {
                this.img2 = true;
            }
        }
    ,
        //清除手机号
        clearInput()
        {
            $(".phone").val('');
            this.img1 = true;
        }
    ,
        //清除验证码
        clearInput2()
        {
            $(".vcode").val('');
            this.img2 = true;
        }
    ,
        //自动登录
        goenter(code)
        {
            Indicator.open({
                text: '登录中...',
                spinnerType: 'fading-circle'
            });
            myAjax.post(getApiUrl('/wash/user/login'), {//登录
                phone: $(".phone").val(),
                code: code
            }).then(res => {
                Indicator.close();
                window.clearTimeout(this.timer);//清除定时器
                $(".get-code").text("获取验证码");
                if (res.status === 0)
            {
                FoundationTools.setCookie("access_token", res.data.access_token,9);//cookie存储
                sessionStorage.setItem("access_token", res.data.access_token);//存储access_token
                sessionStorage.setItem("mobile", res.data.phone);//存储mobile
                sessionStorage.setItem("name", res.data.name);//存储name
                window.location.href = "./index.html#/carwashlist2";
            }
            else
            {
                this.$_LIKE_toast(res.msg)
            }
        }
    ).catch(err => {
            console.log(err)
    }
    )
    }

    }
    }
</script>
<template>
    <div id="logon">
        <div class="spinner">
            <div class="spinner-container container1">
                <div class="circle1"></div>
                <div class="circle2"></div>
                <div class="circle3"></div>
                <div class="circle4"></div>
            </div>
            <div class="spinner-container container2">
                <div class="circle1"></div>
                <div class="circle2"></div>
                <div class="circle3"></div>
                <div class="circle4"></div>
            </div>
            <div class="spinner-container container3">
                <div class="circle1"></div>
                <div class="circle2"></div>
                <div class="circle3"></div>
                <div class="circle4"></div>
            </div>
        </div>
    </div>
</template>
<script>
    import $ from 'jquery'
    import FoundationTools from '../js/functionAjax'
    export default{
        data ()
    {
        return {}
    }
    ,
    destroyed()
    {
        $("body").css("background","#fff");
    }
    ,
    created()
    {

    }
    ,
    mounted()
    {
        if(FoundationTools.getCookie("access_token")){
            sessionStorage.setItem("access_token", FoundationTools.getCookie("access_token"));//存储access_token
            setTimeout(function(){
                window.location.href ="./index.html#/carwashlist2"
            },1000)
        }else{
            setTimeout(function(){
                window.location.href ="./index.html#/enterhome"
            },1000)
        }
    }
    ,
    methods: {
    }
    }
</script>
<style>
    body {
        background: rgba(0, 0, 0, 0.5);
    }

    #logon .spinner {
        width: 60px;
        height: 60px;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -30px;
        margin-left: -30px;
    }

    #logon .container1 > div,#logon .container2 > div,#logon .container3 > div {
        width: 10px;
        height: 10px;
        background-color: #333;
        border-radius: 100%;
        position: absolute;
        -webkit-animation: bouncedelay 1.2s infinite ease-in-out;
        animation: bouncedelay 1.2s infinite ease-in-out;
        -webkit-animation-fill-mode: both;
        animation-fill-mode: both;
    }

    #logon .spinner .spinner-container {
        position: absolute;
        width: 100%;
        height: 100%;
    }

    #logon .container2 {
        -webkit-transform: rotateZ(45deg);
        transform: rotateZ(45deg);
    }

    #logon .container3 {
        -webkit-transform: rotateZ(90deg);
        transform: rotateZ(90deg);
    }

    #logon .circle1 {
        top: 0;
        left: 0;
    }

    #logon .circle2 {
        top: 0;
        right: 0;
    }

    #logon .circle3 {
        right: 0;
        bottom: 0;
    }

    #logon .circle4 {
        left: 0;
        bottom: 0;
    }

    #logon .container2 .circle1 {
        -webkit-animation-delay: -1.1s;
        animation-delay: -1.1s;
    }

    #logon .container3 .circle1 {
        -webkit-animation-delay: -1.0s;
        animation-delay: -1.0s;
    }

    #logon .container1 .circle2 {
        -webkit-animation-delay: -0.9s;
        animation-delay: -0.9s;
    }

    #logon .container2 .circle2 {
        -webkit-animation-delay: -0.8s;
        animation-delay: -0.8s;
    }

    #logon .container3 .circle2 {
        -webkit-animation-delay: -0.7s;
        animation-delay: -0.7s;
    }

    #logon .container1 .circle3 {
        -webkit-animation-delay: -0.6s;
        animation-delay: -0.6s;
    }

    #logon .container2 .circle3 {
        -webkit-animation-delay: -0.5s;
        animation-delay: -0.5s;
    }

    #logon .container3 .circle3 {
        -webkit-animation-delay: -0.4s;
        animation-delay: -0.4s;
    }

    #logon .container1 .circle4 {
        -webkit-animation-delay: -0.3s;
        animation-delay: -0.3s;
    }

    #logon .container2 .circle4 {
        -webkit-animation-delay: -0.2s;
        animation-delay: -0.2s;
    }

    #logon .container3 .circle4 {
        -webkit-animation-delay: -0.1s;
        animation-delay: -0.1s;
    }

    @-webkit-keyframes bouncedelay {
        0%, 80%, 100% {
            -webkit-transform: scale(0.0)
        }
        40% {
            -webkit-transform: scale(1.0)
        }
    }

    @keyframes bouncedelay {
        0%, 80%, 100% {
            transform: scale(0.0);
            -webkit-transform: scale(0.0);
        }
        40% {
            transform: scale(1.0);
            -webkit-transform: scale(1.0);
        }
    }
</style>
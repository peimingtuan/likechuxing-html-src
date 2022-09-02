<template>
    <div class="wrap" v-show="show">
        <div class="mask"></div>
        <div class="box">
            <div class="title">请输入验证码</div>
            <div class="v-code">
                <input
                    ref="vcode"
                    id="vcode"
                    type="tel"
                    @input="getVal"
                    maxlength="6"
                    v-model="code"
                    @focus="focused = true"
                    @blur="focused = false"
                    :disabled="telDisabled"/>
                <label
                    for="vcode"
                    class="line"
                    v-for="(item,index) in codeLength"
                    :class="{'animated': focused && cursorIndex === index}"
                    v-text="codeArr[index]"
                    :key="index"
                >
                </label>
            </div>
            <div class="desc" v-show="showCount">
                <div class="count-wrap"><span class="s">{{count}}s</span>后重新获取</div>
                <div class="tip">{{tip}}</div>
            </div>
            <div class="desc" v-show="!showCount" @click="getCode">
                <div class="count-wrap on">重新获取</div>
            </div>
            <div class="btn" @click="btnClick">确认</div>
            <div class="close-btn" @click="hodeCodeBox"></div>
        </div>
    </div>
</template>
<script>
export default {
    props:{
        show:Boolean,
        count:Number,
        tip:String,
        showCount:Boolean
    },
    data(){
        return{
            code: '',
            codeLength: 4,
            telDisabled: false,
            focused: false,
        }
    },
    computed: {
      codeArr() {
        return this.code.split('')
      },
      cursorIndex() {
        return this.code.length
      }
    },
    watch: {
      code(newVal) {
        this.code = newVal.replace(/[^\d]/g,'')
        // if (newVal.length > 4) {
        //   this.telDisabled = true
        // //   this.$refs.vcode.blur()
        // }
      },
      tip(v1,v2){
          if(v1!=v2){
              this.code = ''
          }
      }
    },
    methods:{
        getVal(){
            this.$emit('clearTip')
            this.code = this.code.substr(0,4)
        },
        btnClick(){
            this.$emit('sendCode',this.code)
        },
        hodeCodeBox(){
            this.code = ''
            this.$emit('hodeCodeBox')
        },
        getCode(){
            this.$emit('reSend')
        }
    }
}
</script>
<style lang="less" scoped>
    .wrap{
        .mask{
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, .8);
            position: fixed;
            left: 0;
            top: 0;
        }
        .box{
            width:2.74rem;
            height: 3.02rem;
            background: #fff;
            position: fixed;
            left: 50%;
            top:1.09rem;
            margin-left: -1.37rem;
            border-radius: .04rem;
            .close-btn{
                position: absolute;
                top:.1rem;
                right:.1rem;
                background:url('../images/close2.png') no-repeat;
                background-size: 100% 100%;
                width:.15rem;
                height: .15rem;
            }
            .title{
                margin: .5rem auto .2rem;
                text-align: center;
                height: .2rem;
                line-height: .2rem;
                font-size: .15rem;
                color: #211815;
            }
            .desc{
                width:2.07rem;
                margin: 0.18rem auto .37rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .count-wrap{
                    font-size: .12rem;
                    color: #333;
                    font-weight: 700;
                    .s{
                       color: #5e5e5e; 
                    }
                    &.on{
                        color: #47aaff;
                    }
                }
                .tip{
                    font-size: .12rem;
                    color: #d34548;
                }
            }
            .btn{
                width:2.07rem;
                height: 0.35rem;
                border-radius: .18rem;
                text-align: center;
                color:#fff;
                font-size: .13rem;
                text-indent: 0;
                background: #d34548;
                line-height: .35rem;
                margin: .21rem auto 0
            }
        }
    }
    .v-code {
        width:2.07rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0 auto;
        position: relative;
        input{
            position: absolute;
            top: -100%;
            left: -666666px;
            opacity: 0;
        }
        .line{
            position: relative;
            width:.425rem;
            height: .41rem;
            display: block;
            border: 1px solid #211815;
            border-radius: .04rem;
            text-align: center;
            color:#211815;
            font-size: .15rem;
            line-height: .41rem;
            &::after{
                display: block;
                position: absolute;
                content: '';
                left: 0;
                width: 100%;
                bottom: 0;
                height: 1px;
                background-color: #aaaaaa;
                transform: scaleY(.5);
                transform-origin: 0 100%;
            }
        }
    }
  .v-code .line.animated::before {
    display: block;
    position: absolute;
    left: 50%;
    top: 20%;
    width: 1px;
    height: 60%;
    content: '';
    background-color: #333333;
    animation-name: coruscate;
    animation-duration: 1s;
    animation-iteration-count: infinite;
    animation-fill-mode: both;
  }
  @keyframes coruscate {
    0% {
      opacity: 0
    }
    25% {
      opacity: 0
    }
    50% {
      opacity: 1
    }
    75% {
      opacity: 1
    }
    to {
      opacity: 0
    }
  }
</style>



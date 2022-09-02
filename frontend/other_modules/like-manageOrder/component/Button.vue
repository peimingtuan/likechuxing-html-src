<template>
    <button class="LikeButton" :class="className" @click="handleClick">{{text}}</button>
</template>

<script>
  export default {
    name: "Button",
    props:{
      text:{
        default:'按钮',
        type:String,
        required:true
      },
      type:{
        default:'default'
      },
      disabled:{
        default:false
      },
      disabled_msg:{
        default:''
      }
    },
    computed:{
      className(){
        let className = [this.type]
        if(this.disabled)className.push('disabled')
        return className.join(' ')
      }
    },
    methods:{
      handleClick(){
        if(!this.disabled){
          this.$emit('click')
        }else{
          if(this.disabled_msg)this.$_LIKE_toast(this.disabled_msg)
        }
      }
    }
  }
</script>

<style lang=less scoped>
.LikeButton{
    margin:0 0 10px 0;
    padding: 0 20px;
    outline: none;
    border:none;
    font-size: 15px;
    height: 40px;
    border-radius: 3px;
    position: relative;
    overflow: hidden;
    box-sizing: border-box;

    // 覆盖一层遮罩，平时隐藏
    &::after{
        content: " ";
        opacity: 0;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        position: absolute;
        transition: opacity 100ms;
    }
    // 激活时显示黑色
    &:not(.disabled):active::after{
        background-color: #555;
        opacity: 0.1;
    }
    // disabled时显示白色
    &.disabled::after{
        background-color: #fff;
        opacity: 0.6;
    }

    // 默认
    &.default{
        color:#333;
        background-color: #fff;
        box-shadow: 0 0 0 1px #dfdfdf;
    }
    &.default2{
        color:#42a6ea;
        background-color: #fff;
    }

    &.gray{
        color:#333;
        background-color: #d8d8d8;
    }

    &.primary,&.primary2,&.danger{
        color:#fff;
    }

    &.primary2{

        background-color:#42a6ea ;
        // 主按钮激活时显示白的
        &:not(.disabled):active::after{
            background-color: #fff;
        }
    }
    // 主按钮
    &.primary{
        background-color: #222;

        // 主按钮激活时显示白的
        &:not(.disabled):active::after{
            background-color: #fff;
        }
    }
    // 危险警告按钮
    &.danger{
        background-color: #ed3800;
    }



}
</style>
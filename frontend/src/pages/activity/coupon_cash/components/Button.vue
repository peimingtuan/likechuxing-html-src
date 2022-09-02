<template>
    <button class="LikeButton" :class="className" :disabled="disabled" @click="handleClick">{{text}}</button>
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
        }
      }
    }
  }
</script>

<style lang=less scoped>
    .LikeButton{
        margin:0 0 10px 0;
        padding: 0 25px;
        outline: none;
        border:none;
        font-size: 15px;
        height: 40px;
        border-radius: 2px;
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
            background-color: #000;
            opacity: 0.4;
        }
        // disabled时显示白色
        &.disabled::after{
            background-color: #fff;
            opacity: 0.4;
        }

        // 默认
        &.default{
            color:#333;
            background-color: #fff;
            box-shadow: 0 0 0 1px #dfdfdf;
        }

        &.gray{
            color:#333;
            background-color: #d8d8d8;
        }

        &.primary,&.danger{
            color:#fff;
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
            &.disabled{
                background:rgba(204,204,204,1);
            }
            &.disabled::after{
                opacity: 0;
            }
        }
        // 红包主题黄色按钮
        &.couponBtn{
            background-color: #FDDF4C;
            &.disabled{
                background:rgba(204,204,204,1);
            }
            &.disabled::after{
                opacity: 0;
            }
        }



    }
</style>
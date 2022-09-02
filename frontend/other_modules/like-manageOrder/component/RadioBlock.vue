<template>
    <div class="RadioBlock">
        <div class="radio-item" @click="toggleRadio">
            <span class="name">{{name}}</span>
            <span class="float-right radio-icon" :class="{active:value}"></span>
        </div>
    </div>
</template>

<script>
  export default {
    name: "RadioBlock",
    props:{
      name:{
        defualt:'选项名'
      },
      value:{
        default:false
      }
    },
    methods:{
      toggleRadio(){
        this.$emit('input',!this.value)
      }
    }

  }
</script>

<style lang=less scoped>
.RadioBlock{
    .radio-item{
        line-height: 0.2rem;
    }
    .radio-icon{
        display: block;
        width: 0.2rem;
        height: 0.2rem;
        background: url('../images/RadioBlock/radio_false.png') no-repeat center;
        background-size: 80% auto;
        &.active{
            background-image: url('../images/RadioBlock/radio_true.png');
        }
    }
}
</style>
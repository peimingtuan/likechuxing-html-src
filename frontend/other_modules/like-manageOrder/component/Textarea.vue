<template>
    <div class="Textarea">
        <textarea class="text" v-model="desc" :rows="row" :placeholder="placeholder_show" maxlength="200" @input="onInput"></textarea>
        <span class="limit">{{desc.length}}/{{maxlength}}</span>
    </div>
</template>

<script>
  export default {
    name: "Textarea",
    props:{
      placeholder:{
        default:''
      },
      maxlength:{
        default:200
      },
      row:{
        default:5
      },
      value:{
        default:''
      }
    },
    computed:{
      placeholder_show(){
        if(this.placeholder){
          return this.placeholder
        }else{
          return '请输入备注，'+this.maxlength+'字以内'
        }
      }
    },
    data(){
      return {
        desc:''
      }
    },
    methods:{
        onInput(){
          this.$emit('input', this.desc);
        }
    },
    created(){
      this.desc = this.value
    }
  }
</script>

<style lang=less scoped>
.Textarea{
    position: relative;
    .text{
        display: block;
        resize:none;
        width: 100%;
        padding: 0.1rem 0.1rem 0.2rem;
        color:#777;
        font-size: 13px;
        border-radius: 2px;
        box-sizing: border-box;
        border:solid 1px #c1c1c1;
        background-color: transparent;
        outline: none;
    }
    .limit{
        font-size: 12px;
        position: absolute;
        bottom:0.1rem;
        right:0.1rem;
        color:#999;
    }
}
</style>
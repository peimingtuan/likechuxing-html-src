<template>
    <div class="Textarea2 question-item">

        <div class="title">
            <span class="index">{{index+1}}、</span>
            {{data.name}}
            <span class="require" v-if="data.require">*</span>
        </div>

        <div class="area-con">
            <textarea class="area" rows="2" :maxlength="maxlength" v-model="desc" @input="onInput"></textarea>
            <div class="count">{{desc.length}}/{{maxlength}}</div>
        </div>

    </div>
</template>

<script>
  export default {
    name: "textarea2",
    props:['data','index','value','maxlength'],
    data(){
      return {
        desc:this.data.desc
      }
    },

    methods:{
      onInput(){
        this.$emit('inputDesc',this.desc)
      }
    }
  }
</script>

<style lang=less scoped>
    @import '../css/question';
.Textarea2{

    .area-con{
        margin: 0.15rem 0 0.15rem -0.24rem;
        border: 1px solid #92B3CE;
        border-radius: 2px;
        position: relative;
        padding: 0.12rem 0 0.24rem;
        .area{
            display: block;
            font-size: 14px;
            color:#555;
            padding: 0 0.12rem;
            width: 100%;
            box-sizing: border-box;
            resize:none;
            border:none;
            outline: none;
        }
        .count{
            color: #96B5CF;
            font-size: 13px;
            position: absolute;
            right:0.08rem;
            bottom:0.06rem;
        }
    }

}
</style>

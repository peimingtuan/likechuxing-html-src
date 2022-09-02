<template>
    <div class="FilterBox">
        <p class="filter-title" v-if="title">{{title}}</p>
        <div class="filter-list">
            <span class="filter-item"
                  v-for="item in options"
                  :key="item.id"
                  :class="{active:chosen===item.id}"
                  @click="handleClick(item.id)">{{item.name}}</span>
        </div>
    </div>
</template>

<script>
  export default {
    name: "FilterSingle",
    props: {
      title:{
        default:'请选择'
      },
      options:{
        required:true,
        type:Array
      },
      preselect:{
        type:Number
      },
      required:{
        default:true
      }
    },
    data () {
      return {
        chosen: this.options[0].id
      }
    },
    methods: {
      // 给父级组件调用的方法，返回结果用
      getResult(){
        return this.chosen
      },

      // 重置
      reset () {
        if(this.required){
          this.chosen = this.options[0].id
        }else{
          this.chosen = null
        }
      },

      // 单击
      handleClick (id) {
        if(this.chosen === id){
          if(!this.required){
            this.chosen = null
          }
        }else{
          this.chosen = id
        }
      },
    },
    created(){
      if(this.preselect && typeof this.preselect === 'number'){
        this.chosen = this.preselect
      }else{
        this.reset()
      }
    }
  }
</script>

<style lang=less scoped>
    @import "../css/FilterBox";
</style>
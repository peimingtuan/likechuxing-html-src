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
        chosen: this.preselect
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
      if(typeof this.preselect === 'number'){
        this.chosen = this.preselect
      }else{
        this.reset()
      }
    }
  }
</script>

<style lang=less scoped>
    .FilterBox {
  margin: 0.1rem 0;
  .filter-title {
    color: #999;
  }
  .filter-list {
    margin: 0 -0.05rem;
    .filter-item {
      display: inline-block;
      box-sizing: border-box;
      padding: 0.05rem 0.1rem;
      border: 1px solid #cdcdcd;
      border-radius: 3px;
      margin: 0.05rem;
      transition-property: background-color,color,border-color;
      transition-duration: 300ms ;
      &.active {
        border-color:#333;
        background-color: #333333;
        color: #FFFFFF;
      }
    }
  }
}
</style>
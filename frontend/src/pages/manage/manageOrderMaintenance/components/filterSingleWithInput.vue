<template>
    <div class="FilterSingleV2">
        <div class="filter-item"
             v-for="item in options"
             :key="item.text"
             :class="{active:!use_input && item.id===selected}"
             @click="handleClick(item)"
        >{{item.text}}</div>
        <div class="filter-item" :class="{active:use_input}" @click="useInput">
            <input class="input" v-model="input_value" placeholder="自定义输入" @change="onChange"/>
        </div>
    </div>
</template>

<script>
  export default {
    name: "FilterSingleV2",
    props: ['options', 'selected'],
    data(){
      return {
        use_input:false,
        input_value:''
      }
    },
    methods:{
      useInput(){
        this.use_input=true
      },

      handleClick(item){
        this.reset()
        if(item.id !== this.selected)this.$emit('change',item.id)
      },

      onChange(value){
        this.$emit('change',this.input_value)
      },

      reset(){
        this.use_input = false
        this.input_value=''
      }
    },
    created(){
      if(!this.options.map(item=>item.id).includes(this.selected)){
        this.use_input = true
      }
    }
  }
</script>

<style lang=less scoped>
    @import '../css/color';

    .FilterSingleV2 {
        margin: 0.1rem 0;
        display: flex;
        flex-wrap: wrap;

        .filter-item {
            font-size: 13px;
            color:#333;
            border: solid 1px #dbdbdb;
            width: 32%;
            text-align: center;
            line-height: 0.3rem;
            border-radius: 2px;
            margin:0.03rem 0 0.03rem 2%;
            box-sizing: border-box;
            &:nth-of-type(3n+1) {
                margin-left: 0;
            }

            &.active{
                color:@major;
                background-color: @majorOpac;
                border-color:@major
            }

            .input{
                font-size: 13px;
                width: 100%;
                box-sizing: border-box;
                background-color: transparent;
                margin:0;
                padding: 0 1em;
                border: none;
            }
        }
    }
</style>
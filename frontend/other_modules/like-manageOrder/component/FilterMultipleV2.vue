<template>
    <div class="FilterBox">
        <div class="filter-list">
            <span class="filter-item" v-if="needAll" :class="{active:chooseAll}" @click="handleClickAll">全部</span>
            <span class="filter-item"
                  v-for="item in options"
                  :key="item.id"
                  :data-id="item.id"
                  :class="{active:chosen.includes(item.id)}"
                  @click="handleClick(item.id)">{{item.name}}</span>
        </div>
    </div>
</template>

<script>
  export default {
    name: "FilterMultiple",
    props: {
      needAll:{// 是否显示全部
        default: true
      },
      options:{
        required:true,
        type:Array
      },
      preselect:{// 预制选项
        default:[],
        type:Array
      },
      min:{// 可选最小个数
        default:0
      },
      max:{// 可选最大值，在created里设置默认是options的长度
        default:0
      }
    },
    data () {
      return {
        _min:0,
        _max:0,
        chosen: [],
        chooseAll: false
      }
    },
    methods: {
      // 给父级组件调用的方法，返回结果用
      getResult(){
        return this.chooseAll ? this.options.map(item=>item.id) : this.chosen
      },

      // 重置
      reset () {
        // 如果有全选，重置时默认全选，否则默认全不选
        if (this.needAll) this.chooseAll = true

        this.chosen = []
      },

      // 单击
      handleClick (id) {

        if(this.chooseAll)this.chooseAll = false

        let index = this.chosen.indexOf(id)
        if(index>-1){
          if(this.chosen.length > this._min){
            this.chosen.splice(index, 1)
          }else{
            console.log('多选框已达到最小，当前：'+this.chosen.length+'，设定的最小值：'+this._min)
          }
        }else{
          if(this.chosen.length < this._max){
            this.chosen.push(id)
          }else{
            console.log('多选框已达到最大'+this.chosen.length+'/'+this._max)
          }
        }
      },
      handleClickAll(){
        this.chosen = []
        this.chooseAll = true
      }
    },
    created(){
      this._min = this.min
      this._max = this.max > 0 ? this.max : this.options.length

      if(this.preselect && this.preselect.length > 0){
        if(this.preselect.length === this.options.length){
          this.chooseAll = true
        }else{
          // concat深拷贝
          this.chosen = this.preselect.concat()
        }
      }else{
        this.reset()
      }
    }
  }
</script>

<style lang=less scoped>
    @import '../css/color';

    .FilterBox {
        margin: 0.1rem 0;

        .filter-title {
            color: #999;
        }
        .filter-list {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            .filter-item {
                display: block;
                font-size: 13px;
                color:#333;
                border: solid 1px #dbdbdb;
                width: 32%;
                text-align: center;
                line-height: 0.16rem;
                padding: 0.07rem 0.05rem;
                border-radius: 2px;
                margin:0.03rem 0 0.03rem 2%;
                box-sizing: border-box;

                &:nth-of-type(3n+1){
                    margin-left: 0;
                }

                &.active {
                    color:@major;
                    background-color: @majorOpac;
                    border-color:@major
                }
            }
        }
    }
</style>
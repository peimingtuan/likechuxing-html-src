<template>
    <div class="Grade question-item">

        <div class="title">
            <span class="index">{{index+1}}、</span>
            {{data.name}}
            <span class="require" v-if="data.require">*</span>
        </div>

        <div class="grade-box">
            <div class="score-box"
                 v-for="item in range"
                 :key="item.value"
                 :class="{active:item.value<=value_h}"
                 :style="{backgroundColor: '#'+item.color}"
                 @click="takeScore(item)"
            >{{item.value}}</div>
        </div>

    </div>
</template>

<script>
  import getItemsColor from '../js/getItemsColor'

  const score = [0,1,2,3,4,5,6,7,8,9,10]
  const colors = getItemsColor(score.length,'FFEBA1','FF8945')

  export default {
    name: "grade",
    props:['data','index','value'],
    data(){
      return {
        range:score.map((item,index)=>{
          return {
            value:item,
            color:colors[index]
          }
        })
      }
    },
    computed:{
      value_h(){
        return this.value===''?-1:Number(this.value)
      }
    },
    methods:{
      takeScore(item){
        this.$emit('input',item.value)
      }
    }
  }
</script>

<style lang=less scoped>
    @import '../css/question';
    .Grade{

        .grade-box{
            margin: 0.15rem 0 0.15rem -0.24rem;
            display: flex;
            .score-box{
                flex:1;
                text-align: center;
                color:#333;
                font-size: 14px;
                margin-left: 0.01rem;
                background-color: #0a8cff;
                line-height: 0.28rem;
                opacity: 0.3;
                &.active{
                    opacity: 1;
                }
            }
        }
    }
</style>

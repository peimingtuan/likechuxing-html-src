<template>
    <div class="OperatingSteps">
        <div class="step" v-for="item in data" :key="item.id" @click="onClick(item)" :class="status_class[item.status]">{{item.id}}、{{item.name}}</div>
    </div>
</template>

<script>
  export default {
    name: "operatingSteps",
    props:['data'],
    data(){
      return {
        status_class:[
          '',
          'current',
          'finish'
        ]
      }
    },
    methods:{
      onClick(item){
        this.$emit('itemClick',item)
      }
    }
  }
</script>

<style lang=less scoped>
    @import '../css/color';
.OperatingSteps{
    background-color: #fff;
    .step{
        color:#999;
        padding:0.18rem 0.1rem;
        border-top:solid 1px #f6f6f6;
        &::after{
            content:'';
            float:right;
            display: block;
            width: 0.4rem;
            height: 0.2rem;
            background:url('../images/icon_right66.png') no-repeat center;
            background-size: auto 80%;
        }
        &.current{
            color:@major;
        }
        &.finish{
            color:#666;
        }
    }
}
</style>
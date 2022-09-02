<template>
  <div class="MoreFunction">
    <ul class="menu">
      <li class="box" v-if="rental && rental.car_overall_view" @click="toCarOverAll">操作指南</li>
      <li class="box" @click="toAccidentCall">事故上报</li>
    </ul>
  </div>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    name: "more-function",
    computed:{
      ...mapState('rental',[
        'rental'
      ])
    },
    methods:{
      toCarOverAll(){
        SDK.openWindow(this.rental.car_overall_view)
      },
      toAccidentCall(){
        this.$router.push({
          path: '/rental/accidentCall'
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .MoreFunction{
    background-color: #f7f7f7;
    .menu{
      background-color: #fff;
      .box{
        text-align: left;
        line-height: 0.44rem;
        margin-left:0.2rem;
        border-bottom:solid 1px #f2f2f2;
        &:nth-last-of-type(1){
          border-bottom: none;
        }
        &::after{
          content: '';
          float:right;
          background: url('../../assets/images/右copy3@3x.png') no-repeat right;
          margin-right: 0.15rem;
          width: 0.2rem;
          height: 0.44rem;
          background-size: 50%;
        }
      }
    }
  }
</style>

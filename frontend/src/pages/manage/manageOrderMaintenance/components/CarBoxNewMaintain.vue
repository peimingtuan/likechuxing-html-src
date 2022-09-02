<template>
    <CarBox  :data="data.car">
        <div class="maintain-box">
            <div class="item">
                <span class="label">保养次数：</span>{{data.maintain_number}}次
                <span class="float-right label" @click="toRemind">保养历史></span>
            </div>
            <div class="item"><span class="label">当前已行驶总公里（车机）：</span>{{data.total_km}}公里</div>
            <div class="item"><span class="label">保养时已行驶总公里（里程表）：</span>{{data.custom_km}}公里</div>
            <div class="item"><span class="label">上次保养时间：</span>{{data.maintain_time}}</div>
        </div>
    </CarBox>
</template>

<script>
  import CarBox from '../../../../../other_modules/like-manageOrder/component/carBox'
  import format from '../../../../../other_modules/like-function/format'

  export default {
    name: "CarBoxMaintain",
    props: ['data'],
    components: {
      CarBox
    },
    methods:{
      toRemind(){
        this.$router.push('/carRemind?id='+this.data.id)
      }
    }
  }
</script>

<style lang=less scoped>
    .maintain-box{
        border:dashed 1px #e6e6e6;
        border-radius: 2px;
        padding: 0.1rem;
        font-size: 12px;
        color:#151515;
        line-height: 0.2rem;
        .label{
            color:#666;
        }

    }
</style>
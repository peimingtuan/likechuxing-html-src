<template>
    <CarBox :data="data.car">
        <div class="remind-box">
            <div class="item"><span class="label">已完成保养次数：</span>{{data.history_times}}</div>

            <div class="item" v-if="is_km_over"><span class="label" >已超里程：</span>{{data.over_km || '-'}}公里</div>
            <div class="item" v-else><span class="label" >剩余里程：</span>{{-data.over_km || '-'}}公里</div>

            <div class="item" v-if="is_time_over"><span class="label">已超时间：</span>{{data.over_time || '-'}}天</div>
            <div class="item" v-else><span class="label">剩余时间：</span>{{-data.over_time || '-'}}天</div>

            <div class="item"><span class="label">建议保养类型：</span>{{data.sugges_type}}</div>
            <div class="item"><span class="label">建议保养地点：</span>{{sugges_branch}}</div>
        </div>
    </CarBox>
</template>

<script>
  import CarBox from '../../../../../other_modules/like-manageOrder/component/carBox'

  export default {
    name: "CarBoxRemind",
    props: ['data'],
    components: {
      CarBox
    },
    computed:{
      sugges_branch(){
        if(this.data.sugges_branches.length>0){
          return this.data.sugges_branches[0].place_name
        }else{
          return ''
        }
      },
      is_km_over(){
        return Number(this.data.over_km)>=0
      },
      is_time_over(){
        return Number(this.data.over_time)>=0
      }
    }
  }
</script>

<style lang=less scoped>
    .remind-box {
        border: dashed 1px #e6e6e6;
        border-radius: 2px;
        padding: 0.1rem;
        font-size: 12px;
        color: #151515;
        line-height: 0.2rem;

        .label {
            color: #666;
        }
    }
</style>
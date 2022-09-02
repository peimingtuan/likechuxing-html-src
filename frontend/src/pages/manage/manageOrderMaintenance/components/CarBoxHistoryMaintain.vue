<template>
    <CarBox  :data="data.car">
        <div class="maintain-box">
            <div class="item">
                <span class="status-name" :class="status_color">{{data.maintain_status_name}}</span>
                <span class="float-right label">保养 {{data.id}}</span>
            </div>
            <div class="item"><span class="label">保养次数：</span>{{data.maintain_number || 0}}</div>
            <div class="item"><span class="label">当前已行驶总公里（车机）：</span>{{data.end_km || '-'}} 公里</div>
            <div class="item"><span class="label">保养时已行驶总公里（里程表）：</span>{{data.custom_km || '-'}} 公里</div>
            <div class="item"><span class="label">保养时间：</span>{{data.maintain_time || '-'}}</div>
            <div class="item"><span class="label">保养类型：</span>{{data.maintain_type || '-'}}</div>
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
    computed:{
      status_color(){
        switch(this.data.maintain_status){
          case 1:
            return 'red'
          case 2:
            return 'yellow'
          case 3:
            return 'green'
        }
      },
      time(){
        return format.time(this.data.maintain_time)
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
        .item{
            .status-name{
                margin-left:-0.1rem;
                padding-left: 0.07rem;
                border-left:solid 0.03rem green
            }
            .red{color:#FD5264;border-color:#FD5264}
            .yellow{color:#FFA500;border-color:#FFA500}
            .green{color:#7FD51D;border-color:#7FD51D}
        }
        .label{
            color:#666;
        }

    }
</style>
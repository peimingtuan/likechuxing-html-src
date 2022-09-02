<template>
    <div class="DetailHeader">
        <div class="total">实付<span class="money">{{money_h}}</span>元</div>
        <div class="time">{{time_h}}</div>
    </div>
</template>

<script>
  import format from '../../../../../other_modules/like-function/format'

  export default {
    name: "DetailHeader",
    props: ['data'],
    computed: {
      money_h () {
        //return format.money(this.data.actual_fee)
        return format.money(this.data.invoice_fee)
      },
      time_h () {
        let time = 0

        if(this.data.end_time>0){
          time = this.data.end_time
        }else if(this.data.begin_time>0){
          time = this.data.begin_time
        }else{
          time = this.data.book_time
        }

        return format.time(time, 0)
      }
    }
  }
</script>

<style lang=less>
.DetailHeader{
    padding: 0.2rem 0;
    background-color: #fff;
    text-align: center;
    font-size: 12px;
    .total{
        color:#111;
        .money{
            margin:0 5px;
            font-size: 28px;
            color:#ed3800
        }
    }
    .time{
        margin-top:0.05rem;
        line-height: 1;
        color: #9B9B9B;
    }
}
</style>
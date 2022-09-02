<template>
    <div class="CarBoxHistory" @click="handleClick">
        <div class="item">
            <span class="name">{{data.car.plate_no}}</span>
            <span class="vin">({{data.car.vin_h}})</span>

            <span class="float-right" :class="status_class">{{data.status_name}}</span>
        </div>
        <div class="desc">
            {{data.car.model_name}}
            |
            {{data.car.color}}
        </div>
    </div>
</template>

<script>
  export default {
    name: "CarBoxHistory",
    props:['data'],
    computed:{
      status_class(){
        switch(Number(this.data.status)){
          case 1:
            return 'red'
          case 2:
            return 'yellow'
          case 3:
            return 'green'
        }
      }
    },
    methods:{
      handleClick(){
        if(Number(this.data.status)===3){
          // 已完成
          this.$router.push({
            path:'/finishOrder',
            query:{
              order_id:this.data.id
            }
          })
        }else{
          this.$router.push({
            path:'/edit',
            query:{
              order_id:this.data.id
            }
          })
        }
      }
    }
  }
</script>

<style lang=less scoped>
.CarBoxHistory{
    background-color: #fff;
    padding: 0.1rem;
    border-bottom: solid 1px #f6f6f6;
    .item{
        font-size: 14px;
        line-height: 0.2rem;
        .name{
            color:#333;
        }
        .vin{
            color:#666;
        }

        .red{color:#FD5264;border-color:#FD5264}
        .yellow{color:#FFA500;border-color:#FFA500}
        .green{color:#7FD51D;border-color:#7FD51D}
    }
    .desc{
        line-height: 1.4;
        font-size: 12px;
        color:#666;
    }
}
</style>
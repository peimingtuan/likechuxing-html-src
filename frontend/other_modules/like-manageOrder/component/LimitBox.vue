/*************************************************
* Description:限行展示
*************************************************/

<template>
    <div class="limitBox">
        <span class="limit-icon" v-for="(item,index) in limit" :key="index" :class="'type'+item.limit">
            <span class="day" v-if="index===0">开</span>
            <span class="day" v-if="index===1">明</span>
            <span class="limit">{{item.desc}}</span>
        </span>
    </div>
</template>

<script>

  // 待：待确认
  const limit_desc = ['开','停','待']

  export default {
    name: "limitBox",
    props:['data'],
    computed:{
      limit(){
        return this.data.map(item=>{
          item.desc = limit_desc[item.limit]
          return item
        })
      }
    }
  }
</script>

<style lang=less scoped>
    .limitBox{
        display: inline-block;
        line-height: 14px;
        font-size: 12px;
        padding: 1px 0;
        vertical-align: top;

        .limit-icon{
            margin-left: 4px;
            padding: 1px 2px;
            text-align: center;
            display: inline-block;
            border-radius: 3px;
            &.type0{
                background-color: #6cdb63;
            }
            &.type1{
                background-color: #ff6868;
            }
            &.type2{
                background-color: #ccc;
            }

            .limit,.day{
                display: inline-block;
                padding: 1px;
            }
            .day{
                color:#111;
                padding: 0 1px;
                background-color: #fff;
                border-radius: 2px;
            }

            .limit{
                color:#fff;
            }
        }
    }
</style>
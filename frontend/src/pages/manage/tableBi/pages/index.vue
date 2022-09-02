<template>
    <div>
        BI列表
        <div>
            <button @click="toDemo">查看demo</button>
            <button @click="toUserStats">城市用户</button>
            <button @click="toTradeStats">城市营收</button>
            <button @click="toUserWeekly">用户周报表</button>
        </div>
    </div>
</template>

<script>
  export default {
    name: "index",
    methods:{
      toDemo(){
        this.$router.push('/demo')
      },
      toUserStats(){
        this.$router.push('/user-stats')
      },
      toUserWeekly(){
        this.$router.push('/user-weekly')
      },
      toTradeStats(){
        this.$router.push('/trade-stats')
      }
    }
  }
</script>

<style lang=less scoped>

</style>
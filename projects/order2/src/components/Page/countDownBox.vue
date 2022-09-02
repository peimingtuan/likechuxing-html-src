<template>
  <div class="CountDownBox">{{left_time_text}} 后开始计费</div>
</template>

<script>
  import {mapState} from 'vuex'
  export default {
    name: "count-down-box",
    data(){
      return {
        left_time:300,
        time_flag: null
      }
    },
    computed:{
      ...mapState('rental',[
        'step',
        'rental'
      ]),
      left_time_text(){
        let min = Math.floor(this.left_time/60)
        if(min<0)min = 0
        let sec = this.left_time%60
        if(sec<0)sec = 0
        if(sec<10)sec='0'+sec
        return min+':'+sec
      }
    },
    methods:{
      countDown(){
        if(this.left_time<1){
          this.$store.dispatch('rental/getCurrentInfo')
        }else{
          this.time_flag=setTimeout(function(){
            this.left_time--;
            this.countDown()
          }.bind(this),1000)
        }
      }
    },
    mounted(){
      this.left_time = this.rental.left_free_time
      this.countDown()
    },
    beforeDestroy(){
      clearTimeout(this.time_flag)
    }
  }
</script>

<style>

</style>

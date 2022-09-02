<template>
    <div class="RankRange clearfix">
        <div>排名区间：{{start}} 到 {{end}}</div>
        <div class="float-left range" ref="range"></div>
    </div>
</template>

<script>
  import $ from '../../../../../other_modules/jquery&ui/jquery&ui'

  export default {
    name: "rank-range",
    data(){
      return{
        start:1,
        end:20
      }
    },
    mounted(){
      $(this.$refs.range).slider({
        range: true,
        min: 1,
        max: 100,
        values: [ 1, 20 ],
        slide: function( event, ui ) {
          this.start = ui.values[ 0 ]
          this.end = ui.values[ 1 ]
        }.bind(this),
        stop:function(){
          this.$emit("setRange",{
            start:this.start,
            end:this.end
          })
        }.bind(this)
      })
    }
  }
</script>

<style lang=less scoped>
.RankRange{
    padding: 0 10px;
    .range{
        width: 200px;
        margin:5px 0;
    }
}
</style>
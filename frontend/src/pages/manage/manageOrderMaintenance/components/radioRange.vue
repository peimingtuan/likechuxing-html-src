<template>
    <div class="radioRange">
        <div class="radio" :class="{selected:is_range === 0}" @click="selectAll">全部</div>
        <div class="radio" :class="{selected:is_range === 1}" @click="selectRange">
            <span >区间</span>
            <input class="input" ref="min" v-model="range_min" :disabled="value==='all'" placeholder="最小值"/>
            <div>-</div>
            <input class="input" v-model="range_max" :disabled="value==='all'" placeholder="最大值"/>
        </div>

    </div>
</template>

<script>
  export default {
    name: "radioRange",
    props:['value'],
    data(){
      return {
        is_range:0,
        range_min:'',
        range_max:''
      }
    },
    methods:{
      selectAll(){
        this.range_min = ''
        this.range_max = ''
        this.is_range = 0
      },
      selectRange(){
        this.is_range = 1
      },

      getValue(){
        if(this.is_range === 0){
          return ''
        }else{
          return this.range_min+'_'+this.range_max
        }
      },

      clear(){
        this.selectAll()
      }
    },

    created(){
      if(this.value === ''){
        this.selectAll()
      }else{
        let values = this.value.split('_')
        this.is_range = 1
        this.range_min = values[0]
        this.range_max = values[1]
      }
    }
  }
</script>

<style lang=less scoped>
    @import '../css/color.less';

.radioRange{
    margin:0.15rem 0;
    display: flex;
    align-items: center;
    justify-content: center;
    .radio{
        vertical-align: top;
        font-size: 13px;
        margin-left:  0.1rem;
        padding-left: 0.18rem;
        background:url('../images/radio_false.png') no-repeat left;
        background-size: auto 70%;
        display: flex;
        align-items: center;
        &.selected{
            color:@major;
            background-image: url('../images/radio_true.png');

            .input{
                border-color: @major;
                color:@major;
                background-color: @majorOpac;
            }

            ::-webkit-input-placeholder{
                color: @major;
            }
        }

        .input{
            margin:0 0.08rem;
            font-size: 12px;
            width: 0.6rem;
            border:solid 1px #dfdfdf;
            height: 0.2rem;
            box-sizing: border-box;
            border-radius: 0.1rem;
            padding: 0 0.1rem;
        }
    }

}
</style>
<template>
    <div class="Radio">
        <div class="radio-item" :class="{'radio-inline':display==='inline'}" v-for="item in options" :key="item.id" @click="onClick(item.id)">
            <span class="radio-icon" :class="{active:item.id===value}"></span>
            {{item.label}}
        </div>
    </div>
</template>

<script>
  export default {
    name: "Radio",
    props:{
      options:{
        required:true
      },
      value:{
        required:true
      },
      display:{
        // inline、block
        default:'block'
      }
    },
    methods:{
      onClick(id){
        if(id!==this.value)this.$emit('input',id)
      }
    }
  }
</script>

<style lang=less scoped>
.Radio{
    .radio-item{
        font-size: 14px;
        line-height: 0.2rem;
        margin-right: 0.15rem;
        &.radio-inline{
            display: inline;
        }

        .radio-icon{
            display: inline-block;
            margin:0.03rem;
            width: 0.14rem;
            height: 0.14rem;
            background-color: #ebebeb;
            border-radius: 50%;
            vertical-align: top;
            &::after{
                content:'';
                display: block;
                border-radius: 50%;
                background-color:#666;
                width: 0.08rem;
                height: 0.08rem;
                margin:0.03rem;
                transform: scale(0);
                transition-property: transform;
                transition-duration: 100ms;
            }
            &.active::after{
                transform: scale(1);
            }
        }
    }
}
</style>
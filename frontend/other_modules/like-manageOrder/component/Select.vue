<template>
    <SlideUpBox
            class="LikeSelect"
            ref="slideUpBox"
            @close="close"
            :needMaskClose="true"
    >
        <div class="select-box">
            <div class="header">
                <div class="select-btn" @click="beginClose">取消</div>
                <div>{{title}}</div>
                <div class="select-btn" @click="confirm">确定</div>
            </div>
            <div class="fun-item">
                <mt-picker :slots="slots" value-key="text" @change="onValuesChange"></mt-picker>
            </div>
        </div>
    </SlideUpBox>
</template>

<script>
  import SlideUpBox from './SlideUpBoxV2'
  import { Picker } from 'mint-ui';

  export default {
    name: "LikeSelect",
    components:{
      SlideUpBox,
      [Picker.name]:Picker
    },
    props:{
      title:{default:'请选择'},
      options:{default:[]},
      defaultOptionIndex:{default:0}
    },
    data(){
      return {
        currentOption:null,
        slots: [
          {
            flex:1,
            values: this.options,
            defaultIndex:this.defaultOptionIndex,
            className: '',
            textAlign: 'center'
          }
        ]
      }
    },

    methods:{
      onValuesChange(picker,option){
        this.currentOption = option[0]
      },
      beginClose(){
        this.$refs.slideUpBox.close()
      },
      close(){
        this.$emit('close')
      },
      confirm(){
        if(this.currentOption)this.$emit('change',this.currentOption)
        this.beginClose()
      }
    }
  }
</script>

<style lang=less>
.LikeSelect{
    .select-box{
        .header{
            line-height: 0.2rem;
            padding: 0.17rem 0.1rem;
            font-size: 15px;
            color:#333;
            border-bottom:solid 1px #ccc;
            display: flex;
            justify-content: space-between;
            &>.select-btn{
                font-size: 13px;
                color:#999;
            }
        }

        .picker-item{
            font-size: 13px;
            &.picker-selected{
                font-size: 15px;
            }
        }
    }
}
</style>
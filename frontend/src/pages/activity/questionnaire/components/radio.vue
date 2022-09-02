<template>
    <div class="Radio question-item">

        <div class="title">
            <span class="index">{{index+1}}、</span>
            {{data.name}}
            <span class="require" v-if="data.require">*</span>
        </div>

        <div class="options">
            <template v-for="item in data.radios">
                <div class="radio"  :key="item.id" @click="handleClick(item)">
                    <div class="icon" :class="{active:value===item.id}"></div>
                    <div class="label">{{item.label}}</div>
                </div>

                <div class="area-con" v-if="item.needInput && item.id===value">
                    <textarea class="area" rows="3" maxlength="200" v-model="desc" @input="onInput"></textarea>
                    <div class="count">{{data.desc.length}}/200</div>
                </div>
            </template>

        </div>
    </div>
</template>

<script>
  export default {
    name: "radio",
    props:['data','index','value'],
    data(){
      return {
        desc:this.data.desc
      }
    },
    methods:{
      handleClick(item){
        this.$emit('input',item.id)
      },
      onInput(){
        this.$emit('inputDesc',this.desc)
      }
    }
  }
</script>

<style lang=less scoped>
    @import "../css/question";
.Radio{
    .options{
        font-size: 14px;
        color:#333;
        .radio{
            margin:0.15rem 0;
            display: flex;
        }
        .icon{
            border:solid 1px #999;
            box-sizing: border-box;
            border-radius: 50%;
            width: 14px;
            height: 14px;
            position: relative;
            margin-right:6px;

            &::after{
                content: '';
                background-color: #333;
                border-radius: 50%;
                width: 8px;
                height: 8px;
                position: absolute;
                top:50%;
                left:50%;
                margin-left:-4px;
                margin-top:-4px;
                transform: scale(0);
                transition: transform 200ms ease-in-out;
            }
            &.active::after{
                transform: scale(1);
            }
        }
        .label{
            line-height: 1;
        }

        .area-con{
            margin: 0.1rem 0 0.1rem 0;
            border: 1px solid #92B3CE;
            border-radius: 2px;
            position: relative;
            padding: 0.12rem 0 0.24rem;
            .area{
                display: block;
                font-size: 14px;
                color:#555;
                padding: 0 0.12rem;
                width: 100%;
                box-sizing: border-box;
                resize:none;
                border:none;
                outline: none;
            }
            .count{
                color: #96B5CF;
                font-size: 13px;
                position: absolute;
                right:0.08rem;
                bottom:0.06rem;
            }
        }
    }
}
</style>

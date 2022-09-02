<template>
    <div class="InputBox">
        <input class="input"
               ref="input_elem"
               :value="value"
               :type="type"
               :placeholder="placeholder"
               v-model="inputText"
               @focus="()=>{this.focus=true}"
               @blur="onBlur"
        />
        <div class="clear" v-if="clear && value" @click="clearValue"></div>
        <div class="results" v-if="optionsResult.length > 0 && focus">
            <div class="result-item" v-for="item in optionsResult" :key="item" @click="pickResult(item)">{{item}}</div>
        </div>
    </div>
</template>

<script>
  export default {
    name: "likeInput",
    props:{
      clear:{
        default:1
      },
      value:{
        default:''
      },
      type:{
        default:'text'
      },
      placeholder:{
        default:''
      },
      options:{
        default:()=>{return []}
      }
    },
    data(){
      return {
        focus:false
      }
    },
    computed:{
      inputText:{
        get(){
          return this.value
        },
        set(value){
          this.$emit('input',value)
        }
      },
        optionsResult(){
          if(this.value === ''){
            return this.options
          }else{
            let reg = new RegExp(this.value,'i')
            return this.options.filter(item=>reg.test(item))
          }
        }
    },
    methods:{
      onBlur(){
        this.focus = false
      },
      pickResult(value){
        this.$emit('pick',value)
        this.$emit('input',value)
      },
      clearValue(){
        this.$emit('clear')
        this.$emit('input','')
      }
    },
    mounted(){
      this.input_elem = this.$refs.input_elem
    }
  }
</script>

<style lang=less scoped>
.InputBox{
    position: relative;;
    .input{
        font-size: 14px;
        display: block;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        padding: 0;
        border:none;
        outline: none;
        color:#333;
        &::-webkit-input-placeholder{
            font-size: 14px;
            color:#999;
        }
    }

    .clear{
        position: absolute;
        top:50%;
        margin-top:-0.1rem;
        right:0.1rem;
        width: 0.2rem;
        height: 0.2rem;
        background: url('../images/icon_clear.png') no-repeat center;
        background-size: 100%;
    }

    .results{
        position: absolute;
        z-index: 10;
        background-color: #fff;
        border-radius: 0 0 4px 4px;
        width: 100%;
        max-height: 2.6rem;
        overflow: scroll;
        box-shadow: 0 2px 4px 2px #EEEEEE;
        .result-item{
            padding: 0.1rem;
            border-top:solid 1px #f2f2f2
        }
    }


}
</style>
<template>
  <div class="Code">
    <div class="loading_layer" v-loading="loading">
      <div class="cli" >
        <p class="line" v-for="item in stdout">{{item}}</p>
      </div>
    </div>
    <el-button @click="pullConfirm" class="float-right btn" type="primary" :disabled="!couldPull">git pull</el-button>
    <el-button @click="clear" class="float-right btn">清屏</el-button>
  </div>
</template>

<script>
  import myAjax from '../../other_modules/like-request/withAxiosV2'
  import {API} from '../common/apiAddress'

  export default {
    name: "devCode",
    data(){
      return {
        loading:false,
        pulling:false,
        stdout:[]
      }
    },
    computed:{
      couldPull(){
        return !this.loading && !this.pulling
      }
    },
    methods:{
      typeAnimate(command){
        let that = this
        let length = command.length

        return new Promise(resolve => {
          command.split('').forEach((item,index)=>{
            setTimeout(function(){
              let last_line = that.stdout.pop()
              last_line+=item
              that.stdout.push(last_line)
              if(index === length-1){
                that.stdout.push(' ')
                resolve();
              }
            },60*index)
          })
        })
      },
      addLastLine(){
        this.stdout.push('[root@liketest likechuxing-html]#')
      },
      getStatus(){
        this.typeAnimate('git status').then(()=>{
          this.loading = true
          return myAjax.get(API.code.status)
        }).then(res=>{
          this.loading = false
          if(res.status === 0){
            this.stdout = this.stdout.concat(res.data.split('\n'))
            this.addLastLine()
          }else{
            this.$message.error(res.msg)
          }
        }).catch(err=>{
          this.loading = false
          console.log(err.msg)
        })
      },
      pullConfirm(){
        this.$prompt('请输入密码', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputType:'password'
        }).then(({ value }) => {
          if(value){
            this.pull(value)
          }else{
            this.$message.error({message:'输入不能为空'})
          }
        }).catch(err=> {
          console.warn(err)
        });
      },
      pull(psw){
        this.pulling = true
        this.typeAnimate('git pull origin test').then(()=>{
          this.loading = true
          return myAjax.get(API.code.pull,{psw:psw})
        }).then(res=>{
          this.loading = false
          this.pulling = false
          if(res.status === 0){
            this.stdout = this.stdout.concat(res.data.split('\n'))
          }else{
            this.$message.error(res.msg)
          }
          this.addLastLine()
        }).catch(err=>{
          this.loading = false
          this.pulling = false
          console.log(err.msg)
        })
      },
      clear(){
        this.stdout = []
        this.addLastLine()
      }
    },
    mounted(){
      this.addLastLine()

      this.getStatus()
    }
  }
</script>

<style lang=less>
.Code{
  .cli{
    height: 70vh;
    padding: 10px;
    background-color: #000;
    color:#fff;
    font-size: 14px;
    overflow-y: scroll;
    .line{
      line-height: 18px;
      height: 18px;
    }
    .line:nth-last-of-type(1)::after{
      content:'_';
    }
  }
  .btn{
    width: 100px;
    margin:10px 0 10px 10px
  }
}
</style>

<template>
    <div class="NewLost">
        <div class="input-box">
            <label class="label">物品名称：<input type="text" v-model="name" class="input" maxlength="15" placeholder="请输入物品名称，15字以内" /></label>
        </div>
        <div class="input-box">
            <span class="label">物品明细：</span>
            <div class="text-con">
                <textarea class="text" v-model="desc" rows="5" placeholder="请输入物品明细，200字以内" maxlength="200"></textarea>
            </div>
        </div>
        <div class="input-box">
            <UploadPhoto
                    title="照片"
                    max="1"
                    ref="photo"
                    :show_uploaded="false"
            />
        </div>
        <div class="tips">
            注：一个遗失单只能有一个遗失物品。
        </div>
        <div class="footerButton">
            <button class="btn" :class="{disabled:!couldSubmit}" @click="makeOrder">提交</button>
        </div>
    </div>
</template>

<script>
  import {getOspApiUrl} from '../js/getApiUrl'
  import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
  import userData from '../../../../../other_modules/like-manageOrder/UserData'
  import UploadPhoto from '../components/upLoadPhoto'

  export default {
    name: "new",
    data(){
      return {
        name:'',
        desc:'',
        car_id:0
      }
    },
    components:{
      UploadPhoto
    },
    computed:{
      couldSubmit:function(){
        return this.name && this.desc && this.$refs.photo.urls.length > 0
      }
    },
    methods:{
      makeOrder(){
        if(!this.couldSubmit){
          this.$_LIKE_toast('请填写完整')
          return
        }

        myAjax.post(getOspApiUrl('/lost-record/create'),{
          mobile:userData.state.mobile,
          lost:this.name,
          lost_detail:this.desc,
          photo_string:this.$refs.photo.urls[0],
          car_id:this.car_id
        }).then(res=>{
          if(res.status === 0){
            this.$_LIKE_toast('创建成功')
            this.$router.push({
              path:'/detail',
              query:{
                source:'new',
                order_id:res.data.id
              }
            })
          }else{
            this.$_LIKE_toast(res.msg)
          }
        }).catch(err=>{
          console.log(err)
        })
      }
    },
    created(){
      this.car_id = this.$route.query.car_id
    }
  }
</script>

<style lang=less scoped>
.NewLost{
    min-height: 100vh;
    background-color: #f2f2f2;
    .input-box{
        background-color: #fff;
        padding: 0.1rem;
        border-bottom:solid 1px #f6f6f6;
        .label{
            color:#999;
            vertical-align: top;
        }

        .input{
            width: 2.7rem;
            font-size: 14px;
            outline: none;
            border:none;
            padding: 0;
            margin:0;
        }
        .btn{
            width: 4em;
            font-size: 12px;
            background-color: #111;
            color:#fff;
            height: 0.2rem;
            border-radius: 3px;
            border:none;
        }
        .text-con{
            margin-left:5em;
            margin-top:-0.2rem;
            width: 2.7rem;
            .text{
                width: 100%;
                box-sizing: border-box;
                border:solid 2px #ddd;
                background-color: #f1f1f1;
                outline: none;
            }
        }
    }
    .tips{
        padding: 0.1rem;
        color:#999;
        font-size: 12px;
    }
    .footerButton{
        position: absolute;
        bottom:0;
        width: 100%;
        box-sizing: border-box;
        padding: 0.1rem;
        background-color: #fff;
        .btn{
            width: 100%;
            height: 0.4rem;
            background-color: #111;
            padding: 0;
            margin:0;
            color:#fff;
            border-radius: 3px;
            font-size: 15px;
            &.disabled{
                background-color: #888;
            }
        }
    }


}
</style>
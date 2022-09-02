<template>
    <div class="takePhotos">
        <div class="photo-list">
            <div class="photo-item"
                 v-for="(item,index) in list"
                 :key="item.id">
                <div class="title">{{item.name}}</div>
                <UploadPhoto
                        @change="url=>{onChange(index,url)}"
                        @view="onView"
                />
            </div>

        </div>

        <div class="btn-con">
            <LikeButton
                    text="下一步"
                    type="primary"
                    :disabled="btn_disabled"
                    @click="nextStep"
                    class="btn"
            />
        </div>
    </div>
</template>

<script>
  import dd from '../../../../../../other_modules/like-manageOrder/ddSDK'
  import LikeButton from '../../../../../../other_modules/like-manageOrder/component/Button'
  import UploadPhoto from '../../../../../../other_modules/like-manageOrder/component/uploadPhoto'
  import {getOspApiUrl} from '../../js/getApiUrl'
  import myAjax from '../../../../../../other_modules/like-request/withAxiosV3'
  import userData from '../../../../../../other_modules/like-manageOrder/UserData'

  export default {
    name: "takePhotos",
    components:{
      LikeButton,
      UploadPhoto
    },
    data(){
      return {
        list:[
          {id:0,name:'车辆左前照片',url:''},
          {id:1,name:'车辆右前照片',url:''},
          {id:2,name:'车辆左后照片',url:''},
          {id:3,name:'车辆右后照片',url:''}
        ]
      }
    },
    computed:{
      url_list(){
        return this.list.filter(item=>item.url).map(item=>item.url)
      },
      btn_disabled(){
        return this.list.some(item=>item.url==='')
      }
    },
    methods:{
      onChange(index,url){
        this.list[index].url = url
      },
      onView(url){
        dd.previewImage({
          urls:this.url_list,
          current:url
        })
      },
      nextStep(){
        switch(Number(this.$route.query.order_type)){
          case 1:
            this.handleMaintainOrder()
            break;

        }
      },

      handleMaintainOrder(){
        myAjax.post(getOspApiUrl('/vehicle-maintain/operate'),{
          mobile:userData.state.mobile,
          order_id:this.$route.query.order_id,
          // type=0取车  1还车
          item_id:Number(this.$route.query.type)===0 ? 2 : 6,
          params:{
            key:this.$route.query.parts,
            photo_string:this.list.map(item=>item.url).join(',')
        }

        }).then(res=>{
          if(res.status!==0)throw res
          window.location.href = '/manage/manageOrderMaintenance/index.html#/edit?order_id='+this.$route.query.order_id
        }).catch(err=>{
          if(err.msg){
            this.$_LIKE_toast(err.msg)
          }else{
            this.$_LIKE_toast('出错了')
            console.log(err)
          }
        })
      }
    },
    created(){
      let type = this.$route.query.type
      if(type === '1'){
        this.list.push({id:4,name:'驾驶舱前排',url:''})
        this.list.push({id:5,name:'车辆后排',url:''})
      }

      let parts = this.$route.query.parts

    }
  }
</script>

<style lang=less scoped>
.takePhotos{
    .photo-list{
        padding: 0.2rem 0.36rem 0.6rem;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .photo-item{
            width: 45%;
            margin-bottom: 0.15rem;
            .title{
                color:#333;
                font-size: 12px;
                text-align: center;
                margin:0.1rem 0;
            }
        }
    }
    .btn-con{
        position: fixed;
        bottom:0;
        width: 100%;
        box-sizing: border-box;
        padding: 10px;
        background-color: #fff;
        box-shadow: 0 -2px 1px #eaeaea;
        .btn{
            width: 100%;
            margin:0
        }
    }
}
</style>
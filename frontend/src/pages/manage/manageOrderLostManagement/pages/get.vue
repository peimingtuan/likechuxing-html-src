<template>
    <div class="Get">
        <div class="content" v-if="item.plate_no">
            <div class="orderBox no-border">

                <div class="title">
                    <span>{{item.plate_no}}（</span>
                    <span class="gray">{{item.vin_front}}</span>
                    <span>{{item.vin_end}}）</span>
                    <span class="float-right status">{{item.statusDesc}}</span>
                </div>

                <div class="des ">
                    遗失物品：{{item.lost}}
                </div>

                <div class="des" v-if="item.owner_phone">
                    失主手机号：{{item.owner_phone}}
                </div>
                <div class="des" v-if="item.owner_idcard">
                    失主身份证号：{{item.owner_idcard_m}}
                </div>

                <div class="des">
                    时长：{{item.update_time_d}}
                </div>

            </div>

            <div class="options">

                <UploadPhoto
                        title="用户证件"
                        max="3"
                        ref="photo"
                        :show_uploaded="false"
                />

                <div class="desc">请上传身份证、驾驶证、订单信息等有效凭证，不多于三张</div>
                <div class="text-con">
                    <textarea class="text" v-model="remark" rows="5" placeholder="请输入备注信息，200字以内" maxlength="200"></textarea>
                </div>
            </div>
        </div>

        <div class="footerButton">
            <LikeButton
                    text="取消"
                    type="default"
                    @click="cancel"
                    class="btn"
            />
            <LikeButton
                    text="确认"
                    type="primary"
                    @click="get"
                    :disabled="!couldGet"
                    class="btn float-right"
            />
        </div>
    </div>
</template>

<script>
  import {getOspApiUrl} from '../js/getApiUrl'
  import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
  import userData from '../../../../../other_modules/like-manageOrder/UserData'
  import UploadPhoto from '../components/upLoadPhoto'
  import LikeButton from '../../../../../other_modules/like-manageOrder/component/Button'

  export default {
    name: "get",
    components:{
      UploadPhoto,
      LikeButton
    },
    data () {
      return {
        item: {},
        remark:''
      }
    },
    computed:{
      couldGet(){
        return this.remark && this.$refs.photo.urls.length > 0
      }
    },
    methods:{
      cancel(){
        this.$router.go(-1)
      },
      get(){
        if(!this.couldGet){
          return
        }

        myAjax.post(getOspApiUrl('/lost-record/claim'),{
          mobile:userData.state.mobile,
          order_id:this.item.id,
          owner_photo:this.$refs.photo.urls.join(','),
          remark:this.remark
        }).then(res=>{
          if(res.status===0){
            this.$router.go(-1)
            /*this.$router.push({
              path:'/detail',
              query:{
                order_id:this.item.id
              }
            })*/
          }else{
            this.$_LIKE_toast(res.msg)
          }
        }).catch(err=>{
          console.log(err)
        })
      }
    },
    created () {
      let query = window.lost_item
      if (!query) {
        this.$_LIKE_alert({
          msg: '未找到订单数据,可能该遗失单已失效，请返回重试',
          confirmButtonCallback:function(){
            window.history.back()
          }
        })
      } else {
        this.item = query
      }
    }
  }
</script>

<style lang=less scoped>
    .Get {
        min-height: 100vh;
        background-color: #f2f2f2;

        .content{
            padding-bottom: 0.8rem;
        }
        .orderBox {
            background-color: #fff;
            .status_text {
                color: #999;
                padding: 1rem 0;
                text-align: center;
            }
            .title {
                margin: 0.06rem 0;
            }
            .des {
                margin: 0;
            }
            &.no-border {
                border: none;
            }
        }

        .options{
            background-color: #fff;
            margin-top:0.1rem;
            padding: 0.1rem;
            .img-con{
                margin:0 -0.06rem;
                .pic{
                    background: #f2f2f2 no-repeat center;
                    background-size: contain;
                }
                .takePhoto,.pic{
                    margin:0.06rem;
                    width: 1.1rem;
                    height:1.1rem;
                    box-sizing: border-box;
                }
                .takePhoto{
                    text-align: center;
                    line-height: 1.8rem;
                    border:dashed 1px #dbdbdb;
                    background: url('../images/camera.png') no-repeat center;
                    background-size: 50%;
                }
            }
            .desc{
                font-size: 12px;
                color:#999;
                margin:0.1rem 0
            }
            .text-con{
                border-top:solid 1px #dbdbdb;
                padding: 0.15rem 0 0.05rem;
                .text{
                    width: 100%;
                    box-sizing: border-box;
                    border:solid 2px #ddd;
                    background-color: #f1f1f1;
                    outline: none;
                    margin:0;
                    padding: 0;
                }
            }
        }

        .footerButton {
            position: absolute;
            bottom: 0;
            width: 100%;
            box-sizing: border-box;
            padding: 0.1rem;
            background-color: #fff;
            .btn {
                width: 47%;
                margin:0
            }
        }
    }
</style>
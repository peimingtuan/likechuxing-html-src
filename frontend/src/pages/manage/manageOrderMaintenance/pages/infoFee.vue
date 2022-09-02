<template>
    <div class="infoFee">
        <div v-if="!view_mode">
            <div class="item flex">
                <span class="label" :class="{required:maintain_type===2}">保养金额：</span>
                <LikeInput
                        class="flex-1"
                        type="number"
                        placeholder="请输入保养金额"
                        v-model="fee"
                />
                <span class="label">元</span>
            </div>

            <div class="item">
                <span class="label required">保养结算备注：</span>
                <div class="textarea-con">
                    <LikeTextarea v-model="desc" />
                </div>
            </div>

            <div class="item">
                <span class="label" :class="{required:maintain_type===2}">请拍摄照片：</span>
                <div class="photo-con">
                    <UploadPhoto
                            @change="onPhoto"
                            @view="onView"
                    />
                    保养结算单照片
                </div>

            </div>

            <div>
                <div class="btn-con-height"></div>

                <div class="btn-con">
                    <LikeButton
                            text="保存"
                            type="primary"
                            :disabled="btn_disabled"
                            :disabled_msg="disabled_msg"
                            @click="onSubmit"
                            class="btn"
                    />
                </div>
            </div>
        </div>

        <div v-else>
            <div class="item flex">
                <span class="label">保养金额：</span>
                <span class="flex-1">{{fee}}</span>
                <span class="label">元</span>
            </div>

            <div class="item">
                <span class="label">保养结算备注：</span>
                <div class="textarea-con">
                    {{desc}}
                </div>
            </div>

            <div class="item">
                <span class="label">请拍摄照片：</span>
                <div class="photo-con">
                    <UploadPhoto
                            type="11"
                            :view_url="photo_url"
                            @view="onView"
                    />
                    保养结算单照片
                </div>

            </div>

            <div>
                <div class="btn-con-height"></div>
                <div class="btn-con">
                    <LikeButton
                            text="返回"
                            type="default"
                            @click="back"
                            class="btn"
                    />
                </div>
            </div>
        </div>

    </div>
</template>

<script>
  import {mapState} from 'vuex'
  import dd from '../../../../../other_modules/like-manageOrder/ddSDK'
  import LikeButton from '../../../../../other_modules/like-manageOrder/component/Button'
  import LikeInput from '../../../../../other_modules/like-manageOrder/component/Input'
  import UploadPhoto from '../../../../../other_modules/like-manageOrder/component/uploadPhoto'
  import LikeTextarea from '../../../../../other_modules/like-manageOrder/component/Textarea'

  export default {
    name: "infoFee",
    components: {
      UploadPhoto,
      LikeButton,
      LikeInput,
      LikeTextarea
    },
    data(){
      return {
        maintain_type:null,
        view_mode:false,
        fee:'',
        desc:'',
        photo_url: ''
      }
    },
    computed: {
      btn_disabled () {
        if(this.maintain_type===1){
          return this.desc===''
        }else if(this.maintain_type===2){
          return this.fee === '' || this.desc==='' ||this.photo_url === ''
        }else{
          return false
        }
      },
      disabled_msg () {
        if(this.maintain_type===1){
          return '请输入备注'
        }else if(this.maintain_type===2){
          if (this.fee === '') return '请输入保养金额'
          if (this.desc === '')return '请输入备注'
          if (this.photo_url === '') return '请上传照片'
        }else{
          return '未获取到保养类型'
        }
      }
    },
    created(){

      this.view_mode=Boolean(this.$route.query.view)

      if(this.view_mode){
        this.$store.dispatch('history/getItemHistory',{
          order_id:this.$route.query.order_id,
          item_id:5
        }).then(res=>{
          this.fee = res.data.maintain_fee
          this.desc = res.data.remark
          this.photo_url = res.data.photo
        }).catch(err=>{
          if(/code 500/.test(err.message)){
            this.$_LIKE_alert({
              msg:'服务器接口500错误，请联系开发'
            })
          }else if(err.msg){
            this.$_LIKE_toast(err.msg)
          }else{
            throw err
          }
        })
      }else{
        this.$store.dispatch('history/getItemHistory',{
          order_id:this.$route.query.order_id,
          item_id:3
        }).then(res=>{
          this.maintain_type = Number(res.data.maintain_mod)
        }).catch(err=>{
          if(/code 500/.test(err.message)){
            this.$_LIKE_alert({
              msg:'服务器接口500错误，请联系开发'
            })
          }else if(err.msg){
            this.$_LIKE_toast(err.msg)
          }else{
            throw err
          }
        })
      }
    },
    methods:{
      back(){
        this.$router.back()
      },

      onPhoto (url) {
        this.photo_url = url
      },
      onView (url) {
        dd.previewImage({
          urls: [this.photo_url],
          current: url
        })
      },
      onSubmit(){
        if(Number(this.fee)>100000){
          this.$_LIKE_toast('保养金额限制最多100,000')
          return
        }

        let data = {
          item_id:5,
          order_id:this.$route.query.order_id,
          params:{
            maintain_fee:this.fee,
            remark:this.desc,
            photo:this.photo_url
          }
        }

        this.$store.dispatch('maintain/submit',data).then(res=>{
          this.$_LIKE_toast('提交成功')
          this.$router.push({
            path:'/edit',
            query:{
              order_id:this.$route.query.order_id
            }
          })
        }).catch(err=>{
          if(err.msg)this.$_LIKE_toast(err.msg)
        })
      }
    }
  }
</script>

<style lang=less scoped>
    @import '../css/color';
    .infoFee{
        min-height: 100vh;
        background-color: #f6f6f6;
        .item{
            color:#333;
            border-top:solid 1px #f2f2f2;
            padding: 0.15rem 0.1rem;
            background-color: #fff;
            &:nth-of-type(1){
                border:none
            }
            &.flex{
                display: flex;
                justify-content: space-between;
            }

            .flex-1{
                flex:1;
            }

            .radio-com{
                display: inline-block;
            }

            .photo-con{
                padding: 0.1rem;
                width: 0.9rem;
                font-size: 12px;
                color:#333;
                text-align: center;
            }
        }

        .label.required::before{
            content: '*';
            color:@error;
        }

        .desc{
            padding: 0.1rem 0.1rem 0.7rem;
            .tips{
                font-size: 13px;
                color:#333;
            }
        }

        .textarea-con{
            margin-top: 0.05rem;
            background-color: #f7f7f7;
        }

        .btn-con-height{
            height: 0.7rem;
        }
        .btn-con{
            position: fixed;
            display: flex;
            justify-content: space-between;
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
            .btn-full{
                width: 100%;
                margin:0;
            }
        }
    }
</style>
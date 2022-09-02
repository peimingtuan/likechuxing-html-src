<template>
    <div class="UploadPhoto" ref="box">

        <!--可拍摄模式-->
        <div class="pic camera" v-if="Number(type)===1" :style="'height:'+height+'px'" @click="takePhoto">
            <div class="img-layer" v-if="url" @click.stop="view" :style="'background-image:url('+url+')'"></div>
            <div class="close" v-if="url" @click.stop="clear"></div>
        </div>

        <!--查看模式-->
        <div class="pic" v-if="Number(type)===11" :style="'height:'+height+'px'">
            <div class="img-layer" v-if="view_url" @click.stop="view" :style="'background-image:url('+view_url+')'"></div>
        </div>
    </div>
</template>

<script>
  import dd from '../ddSDK'

  export default {
    name: "upLoadPhoto",
    props: {
      type: {
        default: 1
      },
      view_url:{
        default:''
      }
    },
    data () {
      return {
        height: 0,
        url: ''
      }
    },

    methods: {
      view () {
        this.$emit('view',this.url)
      },
      change () {
        this.$emit('change', this.url)
      },
      clear () {
        this.url = ''
        this.change()
      },
      takePhoto () {
        dd.uploadImageFromCamera().then(res => {
          this.url = res[0]
          this.change()
        }).catch(err => {
          this.$_LIKE_toast('网络不稳定，图片上传失败，请重试')
          console.log(err)
        })
      },
    },
    mounted () {
      // 宽高1：1
      this.height = this.$refs.box.offsetWidth
    }
  }
</script>

<style lang=less scoped>
    .UploadPhoto {

        .pic {
            position: relative;
            width: 100%;
            height: 100%;
            border-radius: 2px;
            overflow: hidden;
            box-sizing: border-box;
            border:solid 1px #f4f4f4;
            background: #F4F4F4 no-repeat center;
            background-size: 30%;
            &.camera{
                background-image: url('../images/uploadPhoto/camera.png') ;
            }

            .img-layer {
                width: 100%;
                height: 100%;
                background: no-repeat center;
                background-size: cover;
            }

            .close {
                position: absolute;
                z-index: 3;
                top: 0;
                right: 0;
                width: 36px;
                height: 36px;
                background: url('../images/uploadPhoto/close.png') no-repeat top right;
                background-size: 100%;
            }
        }
    }


</style>
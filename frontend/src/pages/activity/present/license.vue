<template>
    <div class="License">
        <p class="header_desc">
            用车需要认证驾驶证、身份证正面照、手持身份证照<br/>
            立刻出行 承诺对信息进行严格保密
        </p>

        <div
                class="upload_box"
                v-for="(item, index) in list"
                :class="{after:item.photo_src!==''}">
            <img :src="item.photo_src !== '' ? item.photo_src : item.photo_default" class="img" />
            <div class="mask"></div>
            <div class="desc" >{{item.desc[0]}}<span>{{item.desc[1]}}</span></div>
            <img src="./images/license_camera.png" @click="(chooseImage)(index)" class="camera"/>
        </div>

        <div class="btn_con">
            <button class="btn btn-primary btn-block" :class="{disabled: !couldSubmit}" @click="takeSubmit">提交</button>
        </div>
    </div>
</template>

<script>
  import myAjax from '../../../component/myAjax/withAxiosV2'
  import {getActivityApiUrl} from "../../../../other_modules/url-constructor";
  import wxShare from './js/thisWxShare'
  require('./js/SDK')

  import parseURL from '../../../js/parseURL'
  let query = parseURL(window.location.href).query

  export default {
    data () {
      return {
        list:[
          {
            photo_default:require('./images/license_default_1.png'),
            photo_src:'',
            photo_id:'',
            desc:['驾驶证', '（正副本拍一起）']
          },
          {
            photo_default:require('./images/license_default_2.png'),
            photo_src:'',
            photo_id:'',
            desc:['身份证', '（正面照）']
          },
          {
            photo_default:require('./images/license_default_3.png'),
            photo_src:'',
            photo_id:'',
            desc:['手持身份证', '（不能挡脸）']
          },
        ],
        loading:null
      }
    },
    computed: {
      couldSubmit () {
        return this.list.every(item => item.photo_src !== '')
      }
    },
    methods: {

      chooseImage (index) {
        let that = this
        SDK.chooseImage(function(src){
          let list = that.list
          list[index].photo_src = src.localShow
          list[index].photo_id = src.localId
          that.list = list
        })
      },
      takeSubmit () {
        if (!this.couldSubmit) {
          return
        }

        this.loading = this.$_LIKE_loading('上传中...')
        this.upload([])

      },
      upload(list){
        let that = this
        wx.uploadImage({
          localId: this.list[list.length].photo_id, // 需要上传的图片的本地ID，由chooseImage接口获得
          isShowProgressTips: 0, // 默认为1，显示进度提示
          success: function (res) {
            list.push(res.serverId)
            if(list.length<3){
              that.upload(list)
            }else{
              that.submit(list)
            }
          }
        })
      },
      submit(list){
        let that = this
        myAjax.post(getActivityApiUrl('/license/wx-submit'),{
          uuid:query.uuid,
          sign:query.sign,
          file1:list[0],
          file2:list[1],
          file3:list[2]
        }).then(res=>{
          that.loading.destroy()
          if (res.status === 0) {
            that.$_LIKE_toast({
              msg:'上传成功',
              toastCallback: function () {
                window.location.replace('/activity/present/licenseInfo.html?uuid='+query.uuid+'&sign='+query.sign)
              }
            })
          }else{
            that.$_LIKE_toast(res.msg)
          }
        })
      }
    },
    mounted(){
      wxShare()
    }
  }
</script>

<style lang="less" scoped>
    @import '../../../css/buttons/button-v2';

    .License {
        background-color: #F7F7F7;
        padding:0.15rem;
        box-sizing: border-box;
        min-height: 100vh;
        position: relative;
    }

    .header_desc {
        font-size: 0.12rem;
        color: #999;
        text-align: left;
    }

    .status_desc {
        font-size: 0.12rem;
        text-align: left;
        padding: 0.06rem 0;
        &.red {
            color: #ED3800;
        }
        &.green {
            color: #00B400;
        }
        &.gray {
            color: #666;
        }
    }

    .upload_box {
        height: 1.28rem;
        background:#f1f1f1 no-repeat center;
        background-size: contain;
        margin: 0.15rem 0;
        position: relative;
        &.after{
            .mask{
                background: rgba(0,0,0,0.48);
            }
            .desc{
                color:#fff;
            }
        }
        .img{
            position: absolute;
            z-index: 0;
            width: 100%;
            height: 100%;
        }
        .mask{
            position: absolute;
            width: 100%;
            height: 100%;
        }
        .desc {
            position: relative;
            text-align: left;
            font-size: 0.13rem;
            padding: 0.5em;
            span {
                font-size: 0.12rem;
            }
        }
        .camera {
            position: absolute;
            right: 0.2rem;
            top: 50%;
            margin-top: -0.3rem;
            width: 0.6rem;
            height: 0.6rem;
            color: #333;
            float: right;
        }
    }

    .btn_con {
        width: 100%;
        box-sizing: border-box;
        background: #f7f7f7;
        //position: absolute;
        bottom:0.15rem;
        .btn{
            height: 0.46rem;
        }
    }
</style>
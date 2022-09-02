<template>
  <div class="License">
    <p class="header_desc">
      用车需要认证驾驶证、身份证正面照、手持身份证照<br/>
      立刻出行 承诺对信息进行严格保密
    </p>
    <div :class="['status_desc', descClass]">
      {{license_desc}}
      <p>{{license_reason}}</p>
    </div>

    <div
      class="upload_box"
      v-for="(item, index) in list"
      :style="'backgroundImage:url('+(item.photo_src !== '' ? item.photo_src : item.photo_default)+')'"
      :class="{after:item.photo_src!==''}">
      <div class="mask"></div>
      <div class="desc" >{{item.desc[0]}}<span>{{item.desc[1]}}</span></div>
      <img src="../../assets/images/license_camera.png" @click="(chooseImage)(index)" class="camera"/>
    </div>

    <div class="btn_con">
      <button :class="['sub_btn', {'active': couldSubmit}]" @click="takeSubmit">提交</button>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import API from '../../common/apiAddress'
  import myAjax from "../../common/myAjax";
  import {Loading,Toast} from '../../../other_modules/vue-plugins/like-base'

  export default {
    data () {
      return {
        list:[
          {
            photo_default:require('../../assets/images/license_default_1.png'),
            photo_src:'',
            desc:['驾驶证', '（正副本拍一起）']
          },
          {
            photo_default:require('../../assets/images/license_default_2.png'),
            photo_src:'',
            desc:['身份证', '（正面照）']
          },
          {
            photo_default:require('../../assets/images/license_default_3.png'),
            photo_src:'',
            desc:['手持身份证', '（不能挡脸）']
          },
        ]
      }
    },
    computed: {
      descClass () {
        if (this.license_status === 0) {
          return 'green'
        }
        if (this.license_status === 1) {
          return 'gray'
        }
        return 'red'
      },
      couldSubmit () {
      	return this.list.every(item => item.photo_src !== '')
      },
      ...mapState('user',[
        'license_status',
        'license_desc',
        'license_reason'
      ])
    },
    methods: {
      chooseImage (index) {
        let that = this
        SDK.chooseImage().then(src=>{
          let list = that.list
          list[index].photo_src = src
          that.list = list
        })
      },
      takeSubmit () {
      	if (!this.couldSubmit) {
      		return
        }

        let that = this
        let loading = Loading('上传中...')
        myAjax.post(API.license.submit,{
          from:2,
          base64_first:this.list[0].photo_src,
          base64_second:this.list[1].photo_src,
          base64_third:this.list[2].photo_src
        }).then(res=>{
          loading.close()
          if (res.status === 0) {
            that.$store.commit('user/set', {
              license_status: 1
            })
            Toast({
              msg:'上传成功',
              toastCallback: function () {
                that.$router.push({
                  path:'/user/licenseInfo',
                  query:{
                    from:'license'
                  }
                })
              }
            })
          }
        })
      }
    },
    mounted(){
      if(this.$route.query.from === 'pay'){
        let href = window.location.href
        history.replaceState({},'index','/index')
        history.pushState({},'this',href)
      }
    },
    beforeRouteLeave(to,from,next){
      let allow = [
        '/user/licenseInfo'
      ]
      if(from.query.from === 'login' && !allow.includes(to.path) && to.path!=='/index'){
        // 从登录页来的，且返回目标不是首页的话，去首页
        next({
          path:'/index'
        })
      }else{
        next()
      }
    }
  }
</script>

<style lang="less" scoped>
  .License {
    background-color: #F7F7F7;
    padding: 0 0.15rem;
    box-sizing: border-box;
  }

  .header_desc {
    padding-top: 0.15rem;
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
    padding-bottom: 0.15rem;
    background: #f7f7f7;
    .sub_btn {
      width: 100%;
      height: 0.46rem;
      font-size: 0.15rem;
      color: #fff;
      &.active{
        background-color: #111;
      }
    }
  }
</style>

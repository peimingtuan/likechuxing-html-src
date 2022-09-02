<template>
    <div class="LicenseInfo">
        <div class="info-box">
            <img :src="info.icon" class="icon-img"/>
            <p>{{info.title}}</p>
            <p class="msg">{{info.msg}}</p>
        </div>
        <div class="act">
            <div v-if="license_status=0">
                打开「立刻出行」APP<br />
                领取其它活动奖励
            </div>
            <div v-else>
                下载「立刻出行」APP<br />
                领取其它活动奖励
            </div>
            <button class="btn btn-primary" @click="toDownload">点击下载</button>
        </div>
    </div>
</template>

<script>
  import parseURL from '../../../js/parseURL'
  import myAjax from '../../../component/myAjax/withAxiosV2'
  import {getActivityApiUrl} from "../../../../other_modules/url-constructor";
  import ENV from '../../../../other_modules/like-env'
  import wxShare from './js/thisWxShare'

  let query = parseURL(window.location.href).query

  export default {
    data(){
      return{
        show_main:false,
        uuid:'',
        sign:'',
        license_status:3,
        info:{
          icon: require('./images/审核中copy@3x.png'),
          title: '查询中...',
          msg: ''
        }
      }
    },
    methods: {
      toDownload() {
        if (ENV.isIos) {
          window.open('https://itunes.apple.com/cn/app/id1245529926?mt=8')
        } else {
          window.open('http://a.app.qq.com/o/simple.jsp?pkgname=com.like.car')
        }
      }
    },
    created() {
      wxShare()
      myAjax.post(getActivityApiUrl('/user/information'),{
        uuid:query.uuid,
        sign:query.sign,
        auth:0
      }).then(res=>{
        if(res.status === 0){
          this.license_status = Number(res.data.license.status)
          this.info =  [
            {
              icon: require('./images/认证通过@3x.png'),
              title: '您为已认证用户',
              msg: '无法参与该活动'
            },
            {
              icon: require('./images/审核中copy@3x.png'),
              title: '审核中...',
              msg: '请耐心等待'
            },
            {
              icon: require('./images/未通过审核@3x.png'),
              title: '认证未通过审核',
              msg: ''
            },
            {
              icon: require('./images/未通过审核@3x.png'),
              title: '未上传',
              msg: '请返回活动首页重新进入'
            }
          ][this.license_status]
        }else{
          this.$_LIKE_toast(res.msg)
        }
      })
    }
  }
</script>

<style lang="less" scoped>
    .LicenseInfo {
        text-align: center;
        background-color: #fff;
        min-height: 100vh;
        .info-box{
            padding:0.6rem 0 0.8rem;
            font-size: 0.18rem;
            color:#111;
            .icon-img{
                display: block;
                margin:0 auto 0.15rem;
                width: 0.6rem;
                height: 0.6rem;
            }
            .msg{
                font-size: 0.14rem;
                color:#999;
            }
        }
        .act{
            padding: 0 0.25rem;
            .btn{
                margin-top: 0.4rem;
                height: 0.46rem;
                font-size: 0.16rem;
                width: 100%;
                border-color:transparent;
                background-color: #f81131;
                border-radius: 0.23rem;
            }
        }
    }
</style>

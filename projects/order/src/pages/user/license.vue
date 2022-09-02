<template>
  <div class="License">
    <p class="header_desc">
      用车需要认证驾驶证、身份证正面照、手持身份证照<br/>
      立刻出行 承诺对信息进行严格保密
    </p>
    <div :class="['status_desc', descClass]">{{statusDesc}}<p>{{reason}}</p></div>
    <div class="upload_box photo_1" :style="photo[0]">
      <div class="desc">驾驶证<span>（正副本拍一起）</span></div>
      <img src="../../assets/images/license_camera.png" @click="(chooseImage)(0)" class="camera"/>
    </div>
    <div class="upload_box photo_2" :style="photo[1]">
      <div class="desc">身份证<span>（正面照）</span></div>
      <img src="../../assets/images/license_camera.png" @click="(chooseImage)(1)" class="camera"/>
    </div>
    <div class="upload_box photo_3" :style="photo[2]">
      <div class="desc">手持身份证<span>（不能挡脸）</span></div>
      <img src="../../assets/images/license_camera.png" @click="(chooseImage)(2)" class="camera"/>
    </div>
    <div class="btn_con">
      <button :class="['sub_btn', {'active': couldSubmit}]" @click="takeSubmit">提交</button>
    </div>
  </div>
</template>

<script>
  import myaxios from '../../common/myaxios'
  import API from '../../common/apiAddress'
  import {IsWeiXin, IsIos} from '../../common/UserAgent'
  const wx = window.wx

  export default {
    data () {
      return {
        status: null,
        reason: '',
        photo_0: '',
        photo_1: '',
        photo_2: '',
        serverId_0: false,
        serverId_1: false,
        serverId_2: false
      }
    },
    computed: {
      statusDesc () {
        const desc = ['审核通过', '待审核', '未通过', '未认证']
        return this.status === null ? '' : desc[this.status]
      },
      descClass () {
        if (this.status === 0) {
          return 'green'
        }
        if (this.status === 1) {
          return 'gray'
        }
        return 'red'
      },
      photo () {
        return ['photo_0', 'photo_1', 'photo_2'].map(item => this[item] === '' ? '' : 'background-image:url(\'' + this[item] + '\')')
      },
      couldSubmit () {
      	return this.serverId_0 && this.serverId_1 && this.serverId_2
      }
    },
    methods: {
      getLicense () {
        myaxios.post(API.user.information).then(function (res) {
        	this.$store.commit('Loading/hide')
          if (+res.data.status === 0) {
            let data = res.data.data
            this.status = +data.license.status
            if (this.status === 2) {
              this.reason = data.license.reason
              this.photo_0 = data.license.first
              this.photo_1 = data.license.second
              this.photo_2 = data.license.third
            }
          }
        }.bind(this))
      },
      chooseImage (index) {
      	let that = this
        wx.chooseImage({
          count: 1, // 默认9
          sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
          	if (IsIos()) {
              wx.getLocalImgData({
                localId: res.localIds[0],
                success: function (res_2) {
                  that['photo_' + index] = res_2.localData // localData是图片的base64数据，可以用img标签显示
                }
              })
            } else {
              that['photo_' + index] = res.localIds[0]
            }
            wx.uploadImage({
              localId: res.localIds[0].toString(), // 需要上传的图片的本地ID，由chooseImage接口获得
              isShowProgressTips: 0, // 默认为1，显示进度提示
              success: function (res) {
                that['serverId_' + index] = res.serverId
              }
            })
          }
        })
      },
      takeSubmit () {
      	if (!this.couldSubmit) {
      		return
        }

        let that = this
        this.$store.commit('Loading/show', {text: '上传中...', preventEvent: true})
        myaxios.post(API.license.wxSubmit, {
        	file1: this.serverId_0,
        	file2: this.serverId_1,
        	file3: this.serverId_2
        }).then(function (res) {
        	if (+res.data.status === 0) {
        		that.$store.commit('Loading/hide')
            that.$store.commit('sideBar/close')
            that.$store.commit('user/set', {
            	license: 1
            })
            that.$store.dispatch('Alert/show', {
            	mold: 'toast',
              msg: '上传成功',
              toastCallback: function () {
            		that.$store.dispatch('user/check')
              }
            })
          }
        })
      }
    },
    created () {
    	if (!IsWeiXin()) {
      } else {
        this.$store.commit('Loading/show', {
          text: '查询中...',
          preventEvent: true
        })
        this.getLicense()
      }
    }
  }
</script>

<style lang="less" scoped>
  .License {
    background-color: #F7F7F7;
    padding: 0 0.15rem;
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
    &.photo_1 {
      background-image: url('../../assets/images/license_default_1.png');
    }
    &.photo_2 {
      background-image: url('../../assets/images/license_default_2.png');
    }
    &.photo_3 {
      background-image: url('../../assets/images/license_default_3.png');
    }
    .desc {
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

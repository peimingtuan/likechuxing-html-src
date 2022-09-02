<template>
    <div class="UploadPhoto">
        <div class="title" v-if="title">{{title}}：</div>
        <div class="pic-con clearfix">

            <div v-if="show_uploaded">
                <div class="pic float-left" v-for="item,index in urls" :key="item">
                    <span class="close" @click="remove(index)" v-if="index < limit"></span>
                    <span class="pic-loading">请稍等</span>
                    <div class="img-layer" @click="view(item)" :style="{backgroundImage:'url('+item+')'}"></div>
                </div>
            </div>

            <div v-else>
                <div class="pic float-left" v-for="item,index in urls" :key="item">
                    <div class="pic-desc top">已上传</div>
                    <div class="pic-desc">
                        <span class="pic-action" @click="view(item)">查看</span>
                        <span class="pic-action" @click="remove(index)">重拍</span>
                    </div>
                </div>
            </div>


            <div class="take-photo float-left" v-if="urls.length < limit" @click="takePhoto">
                <span class="limit">{{urls.length}}/{{limit}}</span>
            </div>
        </div>
    </div>
</template>

<script>
  import dd from '../../../../../other_modules/like-manageOrder/ddSDK'
  import preview from '../../../../../other_modules/previewImg'

  export default {
    name: "upLoadPhoto",
    props: {
      title: {
        default: '上传照片'
      },
      show_uploaded: {
        default: true
      },
      max: {
        required: true
      },
      p_urls: {
        default: () => []
      }
    },
    data () {
      return {
        urls: []
      }
    },
    computed: {
      limit () {
        return Number(this.max)
      }
    },
    methods: {
      view (url) {
        preview({url})
      },

      remove (index) {
        this.urls.splice(index, 1)
      },
      takePhoto () {

        let _limit = this.limit - this.urls.length
        dd.uploadImage({
          multiple: _limit > 1,
          max: _limit,
        }).then(res => {
          this.urls = this.urls.concat(res)
        }).catch(err => {
          console.log(err)
        })
      },
    },
    created () {
      this.urls = this.p_urls.concat()
    }
  }
</script>

<style lang=less scoped>
    .UploadPhoto {
        .title {
            color: #333;
        }

        .pic-con {
            margin: 0 -0.06rem;
            .pic, .take-photo {
                margin: 0.06rem;
                width: 1.1rem;
                height: 1.1rem;
                box-sizing: border-box;
            }
            .pic {
                background-color: #f2f2f2;
                position: relative;
                .close {
                    position: absolute;
                    z-index: 3;
                    top: 0;
                    right: 0;
                    width: 0.3rem;
                    height: 0.3rem;
                    background: url('../images/close.png') no-repeat top right;
                    background-size: 100%;
                }
                .pic-loading {
                    position: absolute;
                    z-index: 1;
                    width: 100%;
                    top: 50%;
                    margin-top: -0.1rem;
                    color: #999;
                    text-align: center;
                }
                .img-layer {
                    position: relative;
                    z-index: 2;
                    width: 100%;
                    height: 100%;
                    background: no-repeat center;
                    background-size: cover;
                }

                .pic-desc {
                    text-align: center;
                    font-size: 13px;
                    margin: 0.1rem 0;
                    &.top {
                        margin-top: 0.3rem;
                    }
                    .pic-action {
                        color: #0a8cff;
                    }
                }
            }

            .take-photo {
                text-align: center;
                line-height: 1.8rem;
                border: dashed 1px #dbdbdb;
                background: url('../images/camera.png') no-repeat center;
                background-size: 50%;
            }
        }
    }


</style>
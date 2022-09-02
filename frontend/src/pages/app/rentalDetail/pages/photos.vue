<template>
    <div class="photos">
        <PhotosTab v-if="hideTab"/>

        <div class="photo-group" v-if="photo_fix.length>0">
            <div class="title">固定角度拍摄</div>
            <div class="photo-list">
                <div class="photo-item" v-for="(item,index) in photo_fix" @click="viewPhotos(photo_fix,index)"
                     :key="item.id">
                    <PhotoBox :data="item"/>
                </div>
            </div>
        </div>

        <div class="photo-group" v-if="photo_close.length>0">
            <div class="title">车辆损伤部位特写</div>
            <div class="photo-list">
                <div class="photo-item" v-for="(item,index) in photo_close" :key="item.id"
                     @click="viewPhotos(photo_close,index)">
                    <PhotoBox :data="item"/>
                </div>
            </div>
        </div>

        <div class="empty" v-if="desc">
            <div class="empty-img"></div>
            <div class="desc">{{desc}}</div>
        </div>

        <Preview v-if="preview_show" :list="preview_urls" :current="preview_current" @close="closeView"/>
    </div>
</template>


<script>
  import {mapState, mapGetters} from 'vuex'
  import PhotosTab from '../components/Photos-tab'
  import PhotoBox from '../components/Photos-photoBox'
  import Preview from '../../../../../other_modules/vue-preview'

  export default {
    name: "photos",
    components: {
      PhotosTab,
      PhotoBox,
      Preview
    },
    data () {
      return {
        from:'rental',
        preview_show: false,

        preview_urls: [],
        preview_current: 0
      }
    },
    computed: {
      ...mapState('photos', [
        'tab_id',
        'dataReady',
        'method_photo'
      ]),
      ...mapGetters('photos', [
        'photo_fix',
        'photo_close'
      ]),

      hideTab(){
        return this.method_photo === 2 && this.from !== 'rental'
      },

      desc () {
        if (!this.dataReady) {
          return "正在加载照片"
        } else {
          if (this.photo_fix.length === 0 && this.photo_close.length === 0) {
            return this.tab_id === 1 ? "您用车前没有拍照" : "您用车后没有拍照"
          } else {
            return null
          }
        }
      }
    },
    methods: {
      viewPhotos (list, index) {
        this.preview_urls = list
        this.preview_current = index

        this.preview_show = true
      },
      closeView () {
        this.preview_urls = []
        this.preview_current = 0

        this.preview_show = false
      }
    },
    created () {
      this.from = this.$route.query.from

      if (!this.dataReady) {
        this.$store.dispatch('photos/getPhotos',this.$route.query.rental_id).then(()=>{

        }).catch(err => {
          if (err.msg) {
            this.$_LIKE_toast(err.msg)
          } else {
            console.log(err)
          }
        })
      }

    }
  }
</script>

<style lang=less scoped>
    .photos {

        width: 100%;
        min-height: 100vh;
        background-color: #f2f2f2;

        .photo-group {
            background: #fff;
            padding: 0.15rem 0.2rem 0.05rem;

            .title {
                color: #111;
                font-size: 14px;
                margin-bottom: 0.15rem;
                line-height: 1;
            }

            .photo-list {
                display: flex;
                flex-wrap: wrap;
                //justify-content: space-between;

                .photo-item {
                    width: 31%;
                    margin-left:3.5%;
                    margin-bottom: 3.5%;
                    &:nth-of-type(3n+1){
                        margin-left:0;
                    }
                }
            }
        }

        .empty {
            padding-top: 1.4rem;
            text-align: center;
            font-size: 16px;
            color: #999;

            .empty-img {
                margin: 0.15rem auto;
                width: 1.2rem;
                height: 0.45rem;
                background: url('../images/photos_empty.png') no-repeat center;
                background-size: 100%;
            }
        }
    }
</style>

<template>
    <transition
            name="custom-classes-transition"
            enter-active-class="animated faster zoomIn"
            leave-active-class="animated faster zoomOut"
            @after-leave="_close"
    >
        <div class="Preview" v-if="show">
            <div class="swiper-container" ref="container">
                <div class="swiper-wrapper">
                    <div
                            class="swiper-slide"
                            v-for="item in list"
                            :key="item.url"
                    >
                        <div class="swiper-zoom-container"><img alt="car_photo" class="photo-img" :src="item.url"></div>
                    </div>
                </div>
            </div>
            <div class="footer">{{current_index+1}}/{{list.length}}</div>
        </div>
    </transition>
</template>

<script>
  import swiperControl from './swiperControl'

  require('../css-animate/animateBase.less')
  require('../css-animate/zoomInOut.less')

  let swiper

  export default {
    name: "Preview",
    props: {
      list: {required: true},
      current: {defualt: 0}
    },
    data () {
      return {
        swiper: null,
        show: false,
        current_index: 0
      }
    },
    mounted () {
      swiperControl.init(this.$refs.container, {
        zoom: true,
        initialSlide: this.current_index,
        loop: false, // 循环模式选项
      })
      swiperControl.on('slideChange',function(swiper){
        this.current_index=swiper.realIndex
      }.bind(this))
    },
    methods: {
      _close () {
        this.$emit('close')
      },

      _popStateCallback () {
        this.show = false
        window.removeEventListener("popstate", this.popStateCallback)
      }
    },
    created () {
      this.show = true
      // 向history压入当前，如此可借用设备返回按钮关闭预览
      history.pushState(null, null, document.URL);

      this.popStateCallback = this._popStateCallback.bind(this)
      window.addEventListener("popstate", this.popStateCallback, false);

      this.current_index = this.current
    }
  }
</script>

<style lang=less scoped>
    .Preview {
        position: fixed;
        top: 0;
        background-color: #fff;
        width: 100%;
        height: 100vh;
        display: flex;
        flex-direction: column;

        .footer {
            padding: 0.2rem 0;
            text-align: center;
            color: #333
        }

        .swiper-container {
            flex: 1;
            width: 100%;

            .swiper-slide {
                width: 100%;
                color: #fff;
                background-position: center;
                background-repeat: no-repeat;
                background-size: contain;
                .photo-img{
                    width: 100%;
                    height: auto;
                    max-height: inherit;
                    object-fit: fill;
                }
            }
        }
    }
</style>
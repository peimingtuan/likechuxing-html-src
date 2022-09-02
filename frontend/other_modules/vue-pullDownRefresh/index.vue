<template>
    <div class="PullDownRefresh" :style="'height:'+height+'px'" ref="container">
        <div class="container">
            <div class="text" v-if="usePullDown">{{textHeader}}</div>
            <div class="solt-con" :style="'min-height:'+height+'px'">
            <!--<div class="solt-con">-->
                <slot></slot>
            </div>
            <div class="text" v-if="usePullUp">{{textFooter}}</div>
        </div>
    </div>
</template>

<script>
  import BScroll from 'better-scroll'

  const STATUS_HEADER_TEXT = [
    '继续下拉',
    '松开刷新',
    '刷新中...',
    '刷新成功'
  ]

  const STATUS_FOOTER_TEXT = [
    '上拉加载更多',
    '松开加载',
    '加载中...',
    '没有更多数据了'
  ]

  export default {
    name: "pullDownRefresh",
    props: ['opt'],
    data () {
      return {
        header_height:40,
        height: this.opt.height || 300,
        // 默认上拉下拉都开启
        usePullDown: this.opt.hasOwnProperty('usePullDown') ? this.opt.usePullDown : true,
        usePullUp: this.opt.hasOwnProperty('usePullUp') ? this.opt.usePullUp : true,
        listenScroll: this.opt.hasOwnProperty('listenScroll') ? this.opt.listenScroll : false,

        scroll: null,

        statusHeader: 0,
        statusFooter: 0,
        // 当前触发的加载类型：0=可触发，1=下拉，2=上拉
        waitingType: 0
      }
    },
    computed: {
      textHeader () {
        return STATUS_HEADER_TEXT[this.statusHeader]
      },
      textFooter () {
        return STATUS_FOOTER_TEXT[this.statusFooter]
      }
    },
    methods: {
      update (data) {
        let that = this
        switch (this.waitingType) {
          case 1:
            // 下拉

            // 重置上拉加载状态
            this.statusFooter = 0
            this.statusHeader = 3
            setTimeout(function () {
              that.statusHeader = 0
            }, 1500)

            setTimeout(function () {
              that.scroll.scrollTo(0, -that.header_height, 950)
            }, 500)
            
            break;

          case 2:
            // 上拉
            if (data && data.noMore) {
              this.statusFooter = 3
            } else {
              this.statusFooter = 0
            }
            break;

          default:
            // 重置上拉加载状态
            this.statusFooter = 0
            this.statusHeader = 3
            setTimeout(function () {
              that.statusHeader = 0
            }, 1500)

            setTimeout(function () {
              that.scroll.scrollTo(0, -that.header_height, 950)
            }, 500)
        }
        this.waitingType = 0
        this.$nextTick(()=>{
          this.scroll.refresh()
        })

      },
      scrollTo (x,y,time){
        x = x || 0
        y = y || 0
        time = time || 600
        y = y - this.header_height
        this.scroll.scrollTo(x,y,time)
        this.$refs.container.scrollTo(0, 0)
      },
      _pullInit () {
        let that = this
        this.scroll = new BScroll(this.$refs.container, {
          startY: -this.header_height,
          probeType: 2,
          bounce: true,
          scrollbar: true,
          click: true
        })

        this.scroll.on('scroll', function (e) {
          // 下拉过一定距离，显示'松开刷新'
          if (that.statusHeader === 0 && e.y > 0) {
            that.statusHeader = 1
          }
          // 不松开手指上滑，文字显示回'继续下拉...'
          if (that.statusHeader === 1 && e.y <= 0) {
            that.statusHeader = 0
          }
          if (that.statusFooter === 0 && e.y < that.scroll.maxScrollY - 10) {
            that.statusFooter = 1
          }

          if(that.listenScroll){
            that.$emit('scroll',e.y+that.header_height)
          }
        })

        this.scroll.on('scrollEnd', function (e) {
          if (that.waitingType === 0 && that.statusHeader === 0 && e.y > -that.header_height) {
            that.scroll.scrollTo(0, -that.header_height, 400)
          }
        })

        this.scroll.on('touchEnd', function () {
          // 触发时不再触发
          if (that.waitingType !== 0) return

          if (that.usePullDown && that.statusHeader === 1) {
            that.statusHeader = 2
            that.waitingType = 1
            that.$emit('pullDown')
          }
          if (that.usePullUp && that.statusFooter === 1) {
            that.statusFooter = 2
            that.waitingType = 2
            that.$emit('pullUp')
          }
        })
      }
    },
    created(){
      if(!this.usePullDown)this.header_height = 0
    },
    updated(){
      if(this.opt.height !== this.height)this.height = this.opt.height
    },
    mounted () {
      this._pullInit()
    }
  }
</script>

<style lang=less>
    .PullDownRefresh {
        position: relative;
        overflow: hidden;
        width: 100%;
        .container {
            .text {
                text-align: center;
                line-height: 40px;
                color: #999;
                font-weight: lighter;
                font-size: 13px;
            }
        }

    }
</style>
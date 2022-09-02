<template>
    <div class="footer" ref="footer">
        <p class="app_explain fs12">最终解释权归立刻出行所有</p>
        <p class="ios_footer fs12" v-if="show_ios_footer">兑换项和活动皆与设备生产商Apple Inc.无关</p>
    </div>
</template>

<script>
  import env from '../../../../../other_modules/like-env/'

  export default {
    name: "footerLicense",
    data() {
      return {
        show_ios_footer: env.isIos
      }
    },
    methods: {
      moveFooter() {
        // 计算footer位置
        this.$refs.footer.style.marginTop = '0px'
        let windowHeight = window.innerHeight
        let contentHeight = document.body.offsetHeight
        if (windowHeight > contentHeight) {
          this.$refs.footer.style.marginTop = (windowHeight - contentHeight - 1) + 'px'
        }
      }
    },
    mounted() {
      this.moveFooter()
    }
  }
</script>

<style lang=less>
    .footer {
        color: #999;
        text-align: center;
        transform: scale(0.9);
        .app_explain {
            line-height: 0.3rem;
        }
        .ios_footer {
            line-height: 0.2rem;
            margin-top: -0.1rem;
        }
    }

</style>
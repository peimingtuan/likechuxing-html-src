<template>
    <transition
            name="custom-classes-transition"
            enter-active-class="animated fast fadeIn"
            leave-active-class="animated faster fadeOut">
        <div class='like-loading ' v-if="show" @touchmove="preventEvent">
            <div class="load" data-loader="circle-side"></div>
            <p>{{text}}</p>
        </div>
    </transition>
</template>

<script>
  require('../css-animate/animate.less')

  export default {
    name: 'loading',
    data() {
      return {
        show: false,
        text: '加载中...'
      }
    },
    methods: {
      preventEvent(e) {
        e.preventDefault()
        e.stopPropagation()
        return false
      },
      destroy() {
        this.$emit('popDestroy')
      },
      close() {
        this.show = false
        this.$emit('popConfirm')
      }
    },
    mounted() {
      this.show = true
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
    @import './css-loading.css';

    .like-loading {
        position: fixed;
        width: 100%;
        height: 100%;
        z-index: 90;
        background-color: rgba(0, 0, 0, 0.44);
        top: 0;
        left: 0;
        font-size: 0.13rem;
        text-align: center;
        color: #E3E3E3;
        [data-loader] {
            margin: 50% auto 3%;
            width: 2em;
            height: 2em;
        }
    }
</style>

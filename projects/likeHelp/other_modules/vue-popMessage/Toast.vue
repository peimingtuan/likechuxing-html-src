<template>
    <transition
            name="custom-classes-transition"
            enter-active-class="animated fast fadeIn"
            leave-active-class="animated faster fadeOut"
            @after-leave="destroy"
    >
        <div class='like-toast' v-show="show">
            <div class="toast">
                <span class="msg">{{msg}}</span>
            </div>
        </div>
    </transition>
</template>

<script>
  require('../css-animate/animate.less')

  export default {
    name: "toast",
    data() {
      return {
        show: false,
        msg: '',
        duration: 2500
      }
    },
    methods: {
      destroy() {
        this.$emit('popDestroy')
      },
      close() {
        this.show = false
      }
    },
    mounted() {
      this.show = true
      setTimeout(this.close.bind(this), this.duration)
    }
  }
</script>

<style lang="less">

    .like-toast {
        position: fixed;
        width: 100%;
        z-index: 100;
        top:35vh;
        text-align: center;
        .toast {
            //position: absolute;
            width: fit-content;
            margin:0 auto;
            background-color: rgba(0, 0, 0, 0.7);
            color: #FFF;
            border-radius: 3px;

            font-size: 0.13rem;
            .msg {
                text-align: left;
                display: inline-block;
                max-width: 2.8rem;
                box-sizing: border-box;
                padding: 0.1rem 0.2rem;

            }
        }
    }
</style>

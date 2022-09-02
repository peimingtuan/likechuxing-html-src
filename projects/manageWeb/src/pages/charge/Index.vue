<template>
  <div class="ChargeIndex">
    <StepShow :step="['待充电','充电中','待处理','已完成']" :stepNow="2"></StepShow>
    <div v-on:click='openSideBar'>我是{{pageName}}</div>

    <button v-on:click="showToast">显示toast</button>
    <button v-on:click="showAlert">显示Alert</button>
    <button v-on:click="showConfirm">显示confirm</button>
    <button v-on:click="showTips">显示tips</button>
    <br/>
    <button v-on:click="loading(1)">显示loading</button>
    <button v-on:click="loading(0)">隐藏loading</button>
    <br/>
    <button v-on:click="send">carStatus</button>
  </div>
</template>

<script>
  import PORT from '../../config/portAddress.js'
  import StepShow from '../../components/StepShow/index.vue'

  export default {
    data () {
      return {
        pageName: '充电单首页'
      }
    },
    methods: {
      openSideBar () {
        this.$store.dispatch({
          type: 'sideBar/toggleSideBarAsync'
        })
      },
      showToast () {
        this.$store.dispatch('YdAlert/show', {
          mold: 'toast',
          msg: '我是toast提示'
        })
      },
      showTips () {
        this.$store.dispatch('YdAlert/show', {
          mold: 'tips',
          msg: '我是tip提示'
        })
      },
      showAlert () {
        this.$store.dispatch('YdAlert/show', {
          mold: 'alert',
          title: 'alert标题',
          msg: 'msgbalabala'
        })
      },
      showConfirm () {
        this.$store.dispatch('YdAlert/show', {
          mold: 'confirm',
          msg: '超多文字超多文字超多文字超多文字超多文字超多文字超多文字超多文字超多文字超多文字超多文字',
          confirmButtonText: 'aaa',
          confirmButtonCallback: function () {
            console.log('confirm_btn_call')
          },
          cancelButtonText: 'bbb',
          cancelButtonCallback: function () {
            console.log('cancel')
          }
        })
      },
      send () {
        let data = {}

        /* eslint-disable */
        this.$http.post(PORT.common.getCarStatusList, data)
          .then(res => {
              console.log(res.body)
            }, err => {
              console.log(err)
            }
          )
        /* eslint-enable */
      },
      loading (type) {
        if (type === 1) {
          this.$store.commit('YdLoading/show', {
            text: '加载中...', // 选填，展示的文字，default: '加载中...'
            preventEvent: false // 选填，是否加载全屏fixed透明层,阻止点击滑动等事件，default: false
          })
        } else {
          this.$store.commit('YdLoading/hide')
        }
      }
    },
    components: {
      StepShow
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .ChargeIndex {
    background-color: #F7F7F8;
    height: 130vh;
  }
</style>

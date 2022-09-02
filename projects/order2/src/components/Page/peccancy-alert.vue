<template>
    <div class="peccancy-alert">
        <!--mask层-->
        <transition name="custom-classes-transition"
                    enter-active-class="animated faster fadeIn"
                    leave-active-class="animated faster fadeOut">
            <div class="mask" v-on:touchmove="preventEvent" v-if="show"></div>
        </transition>

        <!--对话框层-->
        <transition name="custom-classes-transition"
                    enter-active-class="animated faster zoomIn"
                    leave-active-class="animated faster zoomOut">
            <div class="alert" v-if="show">
                <div class="dialogBox">

                    <div class="msg">
                        <p>所有行程，我们会在订单结束后</p>
                        <p> 15 个工作日内完成违章查询。</p>
                        <p>如有违章，我们会短信通知你。</p>
                    </div>

                    <div class="opt" :class="{active:no_longer}" @click="toggleNoLonger">
                        <span>不再提醒</span>
                    </div>

                    <!--alert单按钮-->
                    <div class="alert_btn_container clearfix">
                        <button class="btn btn-primary" @click="close">知道了</button>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    props:[
      'local_name'
    ],
    data(){
      return {
        show:false,
        no_longer:false
      }
    },
    computed:{
      ...mapState('user',[
        'uuid'
      ])
    },
    methods: {
      preventEvent(e) {
        e.preventDefault()
        e.stopPropagation()
        return false
      },
      destroy() {
        this.$emit('destroy')
      },
      close() {
        this.show = false

        if(this.no_longer){
          let localData = localStorage.getItem(this.local_name+'_'+this.uuid)
          if(!localData){
            localData = []
          }else{
            localData = JSON.parse(localData)
          }
          let length = 3-localData.length
          for(let i=0;i<length;i++){
            localData.push('no-longer')
          }
          localStorage.setItem(this.local_name+'_'+this.uuid,JSON.stringify(localData))
        }
      },
      toggleNoLonger(){
        this.no_longer = !this.no_longer
      }
    },
    mounted(){
      this.show = true
    }
  }
</script>

<style lang="less">


    .peccancy-alert {
        position: absolute;
        z-index: 200;

        .alert, .mask {
            position: fixed;
            width: 100vw;
            height: 100vh;
            top: 0;
        }

        .mask {
            background-color: rgba(0, 0, 0, 0.3);
        }
        .dialogBox {
            text-align: center;
            background-color: #FFF;
            width: 3rem;
            margin-left: -1.5rem;
            position: absolute;
            top: 30%;
            left: 50%;
            padding-top: 0.15rem;
            border-radius: 3px;
            color: #666;

            .msg {
                font-size: 0.15rem;
                margin: 0.1rem 0.3rem;
            }
            .alert_btn_container {
                height: 0.4rem;
                margin: 0 0.3rem 0.1rem;
                padding: 0.15rem 0;
                .btn {
                    width: 100%;
                    height: 100%;
                    font-size: 16px;
                    border-radius: 3px;
                    border: none;
                    background-color: #494b51;
                }
            }
        }
        .opt{
            color:#999;
            &::before{
                content: '';
                display: inline-block;
                width: 0.2rem;
                height: 0.2rem;
                vertical-align: top;
                background: url(../../assets/images/rentalDetail/icon_unchosen.png) no-repeat center;
                background-size: 80%;
            }
            &.active::before{
                background-image: url(../../assets/images/rentalDetail/icon_chosen.png);
            }
        }
    }
</style>

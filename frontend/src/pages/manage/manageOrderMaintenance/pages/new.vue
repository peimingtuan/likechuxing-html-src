<template>
    <div class="new">
        <CarBoxMaintain :data="car_maintain"/>
        <div class="desc">
            <LikeTextarea v-model="desc"/>
            <div class="tips">注：提交后，该车的车辆状态将变为"保养"状态</div>
        </div>

        <div class="btn-con">
            <LikeButton
                    text="提交"
                    type="primary"
                    :disabled="!desc"
                    disabled_msg="请输入备注"
                    @click="nextStep"
                    class="btn"
            />
        </div>
    </div>
</template>

<script>
  import {mapState} from 'vuex'
  import { Indicator } from 'mint-ui';
  import CarBoxMaintain from "../components/CarBoxNewMaintain";
  import LikeTextarea from '../../../../../other_modules/like-manageOrder/component/Textarea'
  import LikeButton from '../../../../../other_modules/like-manageOrder/component/Button'

  export default {
    name: "new",
    components: {
      CarBoxMaintain,
      LikeTextarea,
      LikeButton
    },
    data () {
      return {
        desc: ''
      }
    },
    computed: {
      ...mapState('maintain', ['car_maintain'])
    },
    created () {
      this.$store.dispatch('maintain/getCarMaintainInfo', this.$route.query.car_id).catch(err=>{
        if(/code 500/.test(err.message)){
          this.$_LIKE_alert({
            msg:'服务器接口500错误，请联系开发'
          })
        }else if(err.msg){
          this.$_LIKE_toast(err.msg)
        }else{
          throw err
        }
        console.log(err)
      })
    },
    methods: {
      nextStep () {
        Indicator.open()
        this.$store.dispatch('maintain/create', {
          car_id: this.$route.query.car_id,
          desc: this.desc,
          last_maintain_km:this.car_maintain.custom_km
        }).then(order_id=>{
          Indicator.close()
          this.$router.replace({
            path:'/edit',
            query:{
              order_id:order_id
            }
          })
        }).catch(err=>{
          Indicator.close()
          if(err.msg){
            this.$_LIKE_toast(err.msg)
          }else{
            this.$_LIKE_toast('出错了')
            console.log(err)
          }
        })
      }
    }
  }
</script>

<style lang=less scoped>
    .new {
        .desc {
            padding: 0.1rem 0.1rem 0.7rem;

            .tips {
                margin: 0.1rem 0;
                font-size: 13px;
                color: #333;
            }
        }

        .btn-con {
            position: fixed;
            bottom: 0;
            width: 100%;
            box-sizing: border-box;
            padding: 10px;
            background-color: #fff;
            box-shadow: 0 -2px 1px #eaeaea;

            .btn {
                width: 100%;
                margin: 0
            }
        }
    }
</style>
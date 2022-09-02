<template>
    <div class="Insurance">
        <mt-navbar v-model="tabId">
            <mt-tab-item id="1">今年（当期）</mt-tab-item>
            <mt-tab-item id="2">明年（下期）</mt-tab-item>
        </mt-navbar>

        <mt-tab-container v-model="tabId">

            <mt-tab-container-item id="1">
                <div class="empty" v-if="data.length === 0">保险单加载中...</div>
                <InsuranceBox :data="data[0]" v-else/>
            </mt-tab-container-item>

            <mt-tab-container-item id="2">
                <div class="empty" v-if="data.length === 0">保险单加载中...</div>
                <InsuranceBox :data="data[1]" v-else/>
            </mt-tab-container-item>

        </mt-tab-container>
    </div>
</template>

<script>
  import InsuranceBox from '../../components/insuranceBox'
  import {getOspApiUrl} from '../../../../../../other_modules/url-constructor/'
  import myAjax from '../../../../../../other_modules/like-request/withAxiosV3'
  import userData from '../../../../../../other_modules/like-manageOrder/UserData'

  export default {
    name: "insurance",
    components: {
      InsuranceBox
    },
    data () {
      return {
        tabId: '1',
        data:[]
      }
    },
    created(){
      myAjax.post(getOspApiUrl('/car/insurance'), {
        mobile:userData.state.mobile,
        PhoneInfo:userData.state.phoneInfo,
        car_info:this.$route.query.plate_no
      }).then(res=>{
        if(res.status === 0){
          this.data = [
            {
              expire:res.data.this_expire,
              force:res.data.this_force,
              trade:res.data.this_trade
            },
            {
              expire:res.data.next_expire,
              force:res.data.next_force,
              trade:res.data.next_trade
            }
          ]
        }else{
          this.$_LIKE_toast(res.msg)
        }
        console.log(res)
      }).catch(err=>{
        console.log(err)
      })
    }
  }
</script>

<style lang=less scoped>
    .Insurance {
        min-height: 100vh;
        background-color: #f2f2f2;
        .empty{
            font-size: 12px;
            color:#999;
            text-align: center;
            margin:1rem 0;
        }
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
    }
</style>
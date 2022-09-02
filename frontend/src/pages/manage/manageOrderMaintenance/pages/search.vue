<template>
    <div class="SearchPage">
        <div class="header">
            <LikeInput
                    ref="input"
                    class="flex-1 input"
                    type="text"
                    placeholder="请输入车牌号或着VIN后六位"
                    v-model="query"
                    :options="car_name_list"
                    @input="kwChange"
                    @pick="chooseBranch"
                    @clear="clearBranch"
            />
            <div class="btn" @click="back">取消</div>
        </div>

        <div class="type-box" v-if="remind_list.length>0">
            <div class="title">保养提醒</div>
            <div class="list">
                <CarBoxRemind v-for="item in remind_list" :key="item.id" :data="item" @click.native="handleRemindClick(item)"/>
            </div>
        </div>

        <div class="type-box" v-if="maintain_list.length>0">
            <div class="title">保养工单</div>
            <div class="list">
                <CarBoxMaintain v-for="item in maintain_list" :key="item.id" :data="item" @click.native="handleMaintainClick(item)"/>
            </div>
        </div>


    </div>

</template>

<script>
  import { Indicator } from 'mint-ui';
  import waterMark from '../../../../../other_modules/like-manageOrder/waterMark'
  import userData from '../../../../../other_modules/like-manageOrder/UserData'
  import {getOspApiUrl} from '../../../../../other_modules/url-constructor/'
  import myAjax from '../../../../../other_modules/like-request/withAxiosV3'
  import LikeInput from '../../../../../other_modules/like-manageOrder/component/Input'
  import CarBoxRemind from '../components/CarBoxRemind'
  import CarBoxMaintain from '../components/CarBoxMaintain'
  import CarRemind from '../js/model/carRemind'
  import CarMaintain from '../js/model/carMaintain'

  export default {
    name: "search",
    components:{
      LikeInput,
      CarBoxMaintain,
      CarBoxRemind
    },
    data () {
      return {
        query: '',
        car_list:[],
        maintain_list:[],
        remind_list:[]
      }
    },
    computed:{
      car_name_list(){
        return this.car_list.map(item=>item.plate_no)
      }
    },
    methods: {
      kwChange () {
        if (this.next_search) clearTimeout(this.next_search)
        this.next_search = setTimeout(this.searchBranch, 400)
      },
      searchBranch () {
        if (this.query === '') {
          this.car_list = []
          return
        }

        myAjax.post(getOspApiUrl('/vehicle-problem/search'), {kw: this.query}).then(res => {
          if (res.data.car) {
            this.car_list = res.data.car
          }
        })
      },

      chooseBranch (item) {
        let car = this.car_list.find(car=>car.plate_no===item)
        console.log(car)

        Indicator.open()
        Promise.all([this.getMaintainList(car.id),this.getRemindList(car.id)]).then(()=>{
            Indicator.close()
          if(this.maintain_list.length === 0 && this.remind_list.length === 0){
            this.$_LIKE_toast('当前车辆未查询到 保养提醒 或 保养单')
          }
        }).catch(err=>{
          Indicator.close()
          if(/code 500/.test(err.message)){
            this.$_LIKE_alert({
              msg:'服务器接口500错误，请联系开发'
            })
          }else if(err.msg){
            this.$_LIKE_toast(err.msg)
          }else{
            throw err
          }
        })
      },

      getRemindList(car_id){
        return myAjax.post(getOspApiUrl('/vehicle-maintain/warning-list'),{
          mobile:userData.state.mobile,
          car_id,
          page:1,
          limit:10
        }).then(res=>{
          this.remind_list = res.data.map(item=>new CarRemind(item))
        })
      },
      getMaintainList(car_id){
        return myAjax.post(getOspApiUrl('/vehicle-maintain/order-list'),{
          mobile:userData.state.mobile,
          car_id,
          is_mine:this.$route.query.is_mine || 0,
          page:1,
          limit:10
        }).then(res=>{
          this.maintain_list = res.data.map(item=>new CarMaintain(item))
        })
      },
      clearBranch(){
        this.query = ''
        this.car_list = []
      },

      back(){
        this.$router.back()
      },
      handleMaintainClick(item){
        if(Number(item.status)===3){
          // 已完成
          this.$router.push({
            path:'/finishOrder',
            query:{
              order_id:item.id
            }
          })
        }else{
          this.$router.push({
            path:'/edit',
            query:{
              order_id:item.id
            }
          })
        }
      },
      handleRemindClick(item){
        this.$router.push({
          path:'/carRemind',
          query:{
            id:item.id
          }
        })
      }

    },
    beforeCreate () {
      userData.load()
    },
    created () {
      waterMark({watermark_txt: userData.state.nickName + '-' + userData.state.mobile});//水印
    },
    beforeRouteLeave (to, from, next) {
      // 返回上一页如果手机虚拟键盘没有收起，会导致webview高度被挤占，影响布局
      this.$refs.input.input_elem.blur()
      setTimeout(()=>{next()},300)
    }
  }
</script>

<style lang=less>
    .SearchPage {
        .header {
            font-size: 14px;
            padding: 0.1rem 0.2rem;
            background-color: #fff;
            width: 100%;
            box-sizing: border-box;
            border-bottom: solid 1px #dfdfdf;
            position: relative;
            display: flex;

            .flex-1{
                flex:1;
            }

            .input{
                background-color: #f0f0f0;
                height: 0.32rem;
                padding: 0 0.1rem;
                border-radius: 0.16rem;

            }

            .btn {
                width: 0.65rem;
                text-align: center;
                margin: 0;
                padding: 0;
                line-height: 0.32rem;
                color: #333;
                font-size: 14px;
            }



        }

        .type-box{
            padding-bottom: 0.1rem;
            .title{
                font-size: 13px;
                padding: 0 0.1rem;
            }
        }
    }


</style>
<template>
  <div class="Review">
    <p class="tip">系统检测到您现在位于</p>
    <div class="box arrow" @click="toEndBranchConfirm">
      <div class="title">{{check_end_branch_name}}</div>
      <div class="desc">{{check_end_branch_address}}</div>
    </div>

    <p class="tip">请输入您的准确停车位置</p>
    <div class="box arrow" @click="()=>{this.show_floorPicker=true}">
      <div class="title inline">楼层</div>
      <span class="light" v-if="floor===''">请选择楼层</span>
      <span v-else>{{floor}}</span>
    </div>
    <div class="box" v-if="!['','地面'].includes(floor)">
      <div class="title inline">车位号</div>
      <input v-model.trim="no" class="input" type="text" maxlength="10" placeholder="请输入车位号"/>
    </div>

    <p class="tip">请注意检查以下事项</p>
    <div class="box">
      <ul class="clearfix">
        <li class="item">
          <img :src="require('../../assets/images/check/携带好个人物品@3x.png')" class="img"/>
          携带好个人物品
        </li>
        <li class="item">
          <img :src="require('../../assets/images/check/车灯大灯是否关闭@3x.png')" class="img"/>
          车灯大灯是否关闭
        </li>
        <li class="item">
          <img :src="require('../../assets/images/check/如果取卡，停车卡请放在这@3x.png')" class="img"/>
          如果取卡，停车卡请放在这
        </li>
        <li class="item">
          <img :src="require('../../assets/images/check/车窗是否关严@3x.png')" class="img"/>
          车窗是否关严
        </li>
      </ul>
    </div>
    <p class="tip middle">以上事项如果没有问题，请站在车外锁车门</p>

    <div class="btn_con">
      <button class="btn btn-primary btn-block" :class="{disabled:!btnEnable}" @click="finishOrder">确定锁门还车</button>
    </div>

    <FloorPicker v-if="show_floorPicker" @changeFloor="setFloor" @hideMe="()=>{this.show_floorPicker=false}"/>
    <ReturnCarCheck :result="result" v-if="show_returnCarCheck" @hideMe="()=>{this.show_returnCarCheck=false}" @timeout="setChecked"/>
  </div>
</template>

<script>
  import myAjax from '../../common/myAjax'
  import API from '../../common/apiAddress'
  import {mapState} from 'vuex'
  import FloorPicker from '../../components/Widget/FloorPicker'
  import ReturnCarCheck from '../../components/Widget/ReturnCarCheck'
  import {Loading,Toast} from '../../../other_modules/vue-plugins/like-base'

  export default {
    name: "review",
    components: {
      FloorPicker,
      ReturnCarCheck
    },
    data() {
      return {
        floor: '',
        no: '',
        result: [0, 0, 0, 0],
        alreadyChecked: false,
        show_returnCarCheck:false,
        show_floorPicker:false
      }
    },
    computed: {
      ...mapState('rental', [
        'check_end_branch_id',
        'check_end_branch_name',
        'check_end_branch_address'
      ]),
      btnEnable() {
        return this.floor === '地面' || this.no !== ''
      },
      ...mapState("branch", [
        'end_branch'
      ])
    },
    methods: {
      setFloor(floor) {
        this.floor = floor
      },
      setChecked() {
        this.alreadyChecked = true
      },
      finishOrder() {

        if (this.floor === '') {
          Toast('请选择车辆停放楼层')
          return
        }

        if(!this.btnEnable){
          return
        }

        let that = this
        if (!this.alreadyChecked) {
          this.show_returnCarCheck = true
        }
        myAjax.postV2(API.rental.finishOrder, {
          parking_floor: this.floor,
          parking_no: this.no,
          end_branch_id: this.check_end_branch_id,
          is_check: this.alreadyChecked ? 0 : 1
        }, {errAgent: false}).then(res => {
          switch (res.status) {
            case 2001:
              // 检查失败
              that.result = [
                res.data.car_light+1,
                res.data.car_door+1,
                res.data.car_acc+1,
                res.data.car_trunk+1
              ]
              setTimeout(function () {
                that.$store.commit('Widget/hideReturnCarCheck')
              }, 3000)
              that.setChecked()
              break;
            case 1013:
              // 待确认订单
              that.result = [1,1,1,1]
              setTimeout(function () {
                that.$store.commit('pay/setRentalNo', res.data.rental_no)
                that.$router.push('/pay/confirm')
              }, 2000)
              break;
            default:
              Toast(res.msg)
          }
        })
      },
      toEndBranchConfirm() {
        this.$router.push({
          path: '/rental/endBranchConfirm'
        })
      }
    },
    created() {
      if(this.check_end_branch_id === 0){
        let that = this
        myAjax.postV2(API.rental.finishCheckBranch, {
          //branch_id: this.end_branch ? this.end_branch.id : 0
        }).then(res => {
          if (res.status === 0) {
            res.data.branch_address = res.data.branch_addr
            that.$store.commit('rental/setCheckEndBranch',res.data)
          } else {
            this.$_LIKE_toast(res.msg)
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .Review {
    background-color: #F7F7F7;
    .tip {
      padding: 0.1rem 0.2rem;
      font-size: 0.12rem;
      color: #999;
      text-align: left;
      &.middle {
        text-align: center;
        padding-bottom: 0.66rem;
      }
    }
    .box {
      background-color: #fff;
      padding: 0.15rem 0.2rem;
      position: relative;
      text-align: left;
      &.arrow::after {
        content: '';
        position: absolute;
        width: 0.2rem;
        height: 0.2rem;
        right: 0.15rem;
        top: 50%;
        margin-top: -0.1rem;
        background: url('../../assets/images/右copy3@3x.png') no-repeat right;
        background-size: auto 80%;
      }
      .title {
        &.inline {
          display: inline-block;
          width: 4em;
        }
      }
      .desc {
        color: #999;
        font-size: 0.12rem;
      }
      .light {
        color: #999;
      }
      .input {
        width: 2rem;
        height: 0.2rem;
        border: none;
        outline: none;
        padding: 0;
        margin: 0;
        font-size: 0.14rem;
      }
      .item {
        width: 50%;
        float: left;
        font-size: 12px;
        color: #999;
        line-height: 0.2rem;
        text-align: center;
        &:nth-of-type(1), &:nth-of-type(2) {
          margin-bottom: 0.1rem;
        }
        .img {
          width: 1.2rem;
          display: block;
          margin: 0 auto 0.05rem;
        }
      }
    }
    .btn_con {
      position: absolute;
      left: 0.1rem;
      right: 0.1rem;
      bottom: 0.1rem;
      .btn {
        height: 0.46rem;
        font-size: 0.16rem;
      }
    }
  }
</style>

<template>
  <div class="BottomBar shadow">
    <!--底部提示+按钮栏-->

    <div v-if="type==='index'">

      <!--未下单-->
        <div class="box" v-if="active_branch===null">请在地图上选择取车网点</div>
        <div class="box" v-else-if="car_list.length===0">当前网点暂无可用车辆</div>
        <div class="box" v-else>
          <button class="btn btn-primary btn-block" @click="orderCar">立刻用车</button>
        </div>
    </div>
    <div v-else-if="step===1||step===2">

      <!--下单未计费和下单已计费-->
      <div class="box clearfix">
        <div class="btn-3 float-left" @click="findCar">寻车</div>
        <div class="btn-3 float-left" @click="firstOpenDoor">开门</div>
        <div class="btn-3 float-left" @click="rentalCancel">取消</div>
      </div>

    </div>
    <div v-else>

      <!--已开门-->
      <div class="box clearfix">
        <div class="btn-5 float-left" @click="openDoor">开门</div>
        <div class="btn-5 float-left" @click="lockDoor">锁门</div>
        <div class="btn-5 float-left" @click="toReview">还车</div>
        <div class="btn-5 float-left" @click="findCar">寻车</div>
        <div class="btn-5 float-left" @click="toMoreFunction">更多</div>
      </div>

    </div>

  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import {Confirm, Toast, Loading} from '../../../other_modules/vue-plugins/like-base'

  export default {
    name: "bottom-bar",
    props: ['type'],
    computed: {
      ...mapState('rental', [
        'step',
        'rental'
      ]),
      ...mapState('branch', [
        'active_branch',
        'car_list',
        'chose_city_id'
      ]),
      ...mapState('user', [
        'remain_time',
        'city_id'
      ])
    },
    methods: {
      orderCar() {
        if (Number(this.chose_city_id) > 0 && Number(this.chose_city_id) !== Number(this.city_id)) {
          this.$_LIKE_toast('根据您当前的定位无法使用外地车辆')
          return
        }

        let that = this

        let loading = Loading({text: '检查中...'})
        this.$store.dispatch('user/getUserInformation').then(() => {
          return this.$store.dispatch('user/getDeposit')
        }).then(() => {
          return this.$store.dispatch('user/checkUserStatus')
        }).then(() => {
          loading.close()
          Confirm({
            icon: 'tips',
            msg: this.remain_time + '免费时长，请尽快取车',
            confirmButtonCallback: function () {
              that.$store.dispatch('rental/create').then(() => {
                that.$router.push('/rental')
              }).catch(() => {
              })
            }
          })
        }).catch(err => {
          loading.close()
          console.log('bottomBar的orderCar出错', err)
          if (err.msg && err.msg !== '') {
            Toast(err.msg)
          }
        })
      },
      rentalCancel() {
        this.$store.dispatch('rental/getRemainCancel').then(() => {
          this.$store.dispatch('Widget/toggle', 'cancelBox')
        })
      },
      findCar() {
        this.$store.dispatch('rental/findCar')
      },
      firstOpenDoor() {
        if (this.rental.need_photo) {
          this.$router.push('/car/damage')
        } else {
          this.openDoor()
        }
      },
      openDoor() {
        let loading = this.$_LIKE_loading({title: '开门中...'})
        this.$store.dispatch('rental/openDoor').then(() => {
          loading.close()
        }).catch(err => {
          loading.close()
          if (err.msg && err.msg !== '') {
            this.$_LIKE_toast(err.msg)
          }
        })
      },
      lockDoor() {
        let loading = this.$_LIKE_loading({title: '锁门中...'})
        this.$store.dispatch('rental/lockDoor').then(() => {
          loading.close()
        }).catch(err => {
          loading.close()
          if (err.msg && err.msg !== '') {
            this.$_LIKE_toast(err.msg)
          }
        })
      },
      toMoreFunction() {
        this.$router.push({path: '/rental/more'})
      },
      toReview() {
        this.$router.push({path: '/rental/review'})
      }
    },
    beforeDestroy() {
      // todo 忘记了为啥在这里destroy，先注释
      //mainMap.destroy()
    }
  }
</script>

<style lang="less" scoped>
  .BottomBar {
    text-align: center;
    margin-top: 0.06rem;
    position: relative;
    z-index: 2;
    width: 100%;
    background-color: #fff;
    .box {
      height: 0.46rem;
      line-height: 0.46rem;
      font-size: 0.16rem;
      .btn-block {
        height: 100%;
        font-size: 0.16rem;
      }
      .btn-3 {
        width: 33.3%;
        box-sizing: border-box;
        color: #444;
        font-size: 0.14rem;
        &:nth-of-type(2) {
          font-size: 0.16rem;
          color: #111;
          border-left: solid 1px #f2f2f2;
          border-right: solid 1px #f2f2f2;
        }
      }
      .btn-5 {
        width: 20%;
        box-sizing: border-box;
        color: #444;
        font-size: 0.14rem;
        &:nth-of-type(2n) {
          border-left: solid 1px #f2f2f2;
          border-right: solid 1px #f2f2f2;
        }
        &:nth-of-type(3) {
          font-size: 0.16rem;
          color: #111;
        }
      }
    }
  }
</style>

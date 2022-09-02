<template>
    <div>
        <div class="padDis">
            <div class="weui-cell">
                <input ref="searchBox" type="text" class="weui-input" v-model.trim="searchString"
                       placeholder="请输入车牌号或车的vin后六位">
                <select v-if="cityList.length > 0" class="city_select" v-model="city_id" @change="setCity">
                    <option value="0">全部(城市)</option>
                    <option v-for="item in cityList" :key="item.city_id" :value="item.city_id">{{item.city_name}}
                    </option>
                </select>
            </div>
        </div>
        <div class="btn_list" v-if="menu.length > 0">
            <button class="btn" v-for="item in menu" :key="item.id" @click="()=>handleBtnClick(item.id)">{{item.name}}
            </button>
        </div>
        <div class="bottom-btn-box">
            <button @click="logout" type="button" id="logout" class="bottom-btn">退出登录</button>
        </div>
        <CarInfo :data="carInfo" v-if="carInfo" @destroy="clearCarInfo"/>
    </div>
</template>

<script>
  import {mapState} from 'vuex'
  import CarInfo from '../components/carInfo'
  import appArguments from '../../../../../other_modules/app-arguments'

  export default {
    name: "mainPage",
    components: {
      CarInfo
    },
    data () {
      return {
        searchString: '',
        city_id: 0,
        carInfo: null
      }
    },
    computed: {
      city_id_store () {
        return this.$store.state.menu.city_id || 0
      },
      ...mapState('menu', [
        'cityList',
        'menu'
      ])
    },
    methods: {
      setCity () {
        this.$store.commit('menu/setCity', this.city_id)
      },
      handleBtnClick (type) {

        switch (type) {

          // 查询
          case 'search':
            if (!this.searchString) {
              this.$refs.searchBox.focus()
              return
            }

            let loading = this.$_LIKE_loading()
            this.$store.dispatch('menu/getCarInfo', this.searchString).then(res => {
              loading.close()
              if (res.status === 0) {
                this.carInfo = res.data.info
              } else {
                this.$_LIKE_toast(res.msg)
              }
            }).catch(err => {
              loading.close()
              this.$_LIKE_toast('网络错误')
            })

            break;

          // 网点查询
          case 'latticePoint':
            if (!this.searchString) {
              this.$refs.searchBox.focus()
              return
            }

            window.location.href = 'latticePoint.html?name=' + this.searchString;

            break;

          // 鸣笛
          case 'whistle':
            if (!this.searchString) {
              this.$refs.searchBox.focus()
              return
            }

            let loading2 = this.$_LIKE_loading()
            this.$store.dispatch('menu/carAlarm', this.searchString).then(res => {
              loading2.close()
              if (res.status === 0) {
                this.$_LIKE_toast('操作成功')
              } else {
                this.$_LIKE_toast(res.msg)
              }
            }).catch(err => {
              loading2.close()
              this.$_LIKE_toast('网络错误')
            })

            break;

          // 闪灯
          case 'flashLight':
            if (!this.searchString) {
              this.$refs.searchBox.focus()
              return
            }

            let loading3 = this.$_LIKE_loading()
            this.$store.dispatch('menu/carFlash', this.searchString).then(res => {
              loading3.close()
              if (res.status === 0) {
                this.$_LIKE_toast('操作成功')
              } else {
                this.$_LIKE_toast(res.msg)
              }
            }).catch(err => {
              loading3.close()
              this.$_LIKE_toast('网络错误')
            })

            break;

          // 开门
          case 'openDoor':
            if (!this.searchString) {
              this.$refs.searchBox.focus()
              return
            }

            let loading4 = this.$_LIKE_loading()
            this.$store.dispatch('menu/carOpen', this.searchString).then(res => {
              loading4.close()
              if (res.status === 0) {
                this.$_LIKE_toast('操作成功')
              } else {
                this.$_LIKE_toast(res.msg)
              }
            }).catch(err => {
              loading4.close()
              this.$_LIKE_toast('网络错误')
            })

            break;

          // 锁门
          case 'closeDoor':
            if (!this.searchString) {
              this.$refs.searchBox.focus()
              return
            }

            let loading5 = this.$_LIKE_loading()
            this.$store.dispatch('menu/carLock', this.searchString).then(res => {
              loading5.close()
              if (res.status === 0) {
                this.$_LIKE_toast('操作成功')
              } else {
                this.$_LIKE_toast(res.msg)
              }
            }).catch(err => {
              loading5.close()
              this.$_LIKE_toast('网络错误')
            })

            break;

          // 电量同步
          case 'synSoc':
            if (!this.searchString) {
              this.$refs.searchBox.focus()
              return
            }

            let loading6 = this.$_LIKE_loading()
            this.$store.dispatch('menu/carSynSoc', this.searchString).then(res => {
              loading6.close()
              if (res.status === 0) {
                this.$_LIKE_toast('操作成功')
              } else {
                this.$_LIKE_toast(res.msg)
              }
            }).catch(err => {
              loading6.close()
              this.$_LIKE_toast('网络错误')
            })

            break;

          // 更改状态
          case 'changeStatus':
            if (!this.searchString) {
              this.$refs.searchBox.focus()
              return
            }

            window.location.href = 'changeStatus.html?name=' + this.searchString

            break;

          // 查看定位
          case 'lookPosition':
            if (!this.searchString) {
              this.$refs.searchBox.focus()
              return
            }

            window.location.href = 'map.html?name=' + this.searchString

            break;

          // 车辆列表
          case 'carList':
            //window.location.href = 'carList.html';
            this.$router.push('/car/list')

            break;

          // 车辆状态历史
          case 'history':
            if (!this.searchString) {
              this.$refs.searchBox.focus()
              return
            }

            window.location.href = 'changeHistory.html?name=' + this.searchString

            break;

          // 行驶证
          case 'car_drivingLicense':
            if (!this.searchString) {
              this.$refs.searchBox.focus()
              return
            }

            window.location.href = 'drivingLicense.html?name=' + this.searchString

            break;

          // 保险单
          case 'car_insurance':
            if (!this.searchString) {
              this.$refs.searchBox.focus()
              return
            }

            window.location.href = 'insurance.html?name=' + this.searchString

            break;

          // 事故图片
          case 'accident_picture':
            window.location.href = 'Accident_details.html';

            break;

          // 用户上报车上列表
          case 'checkDamageOrder':
            window.location.href = 'checkDamageOrder/index.html';

            break;

          // 停车费列表
          case 'parkingFeeList':
            window.location.href = 'parkingFeeList/index.html';

            break;

          // 调度车辆数
          case 'dispatchCar':
            window.location.href = 'dispatchCar/index.html';

            break;

          // 2018长租
          case 'longRental_2018':
            window.location.href = 'longRental/index.html'

            break;
        }
      },
      logout () {
        this.$router.replace('/login')
      },
      clearCarInfo () {
        this.carInfo = null
      }
    },
    created () {
      if (appArguments.name) this.searchString = appArguments.name
      if(this.$route.query.plate_no) this.searchString = this.$route.query.plate_no
      this.city_id = this.city_id_store

      let loading = this.$_LIKE_loading('加载中...')
      this.$store.dispatch('menu/getList').then(() => {
        loading.close()
      }).catch(err => {
        loading.close()
        if (err && err.msg) {
          this.$_LIKE_toast(err.msg)
        }
      })
    }
  }
</script>

<style lang=less scoped>
    .padDis {
        padding: 0 15px;
    }

    input {
        -webkit-appearance: none;
    }

    .weui-input {
        padding: 0 5px;
        width: 70%;
        line-height: 2.5em;
        border: 1px solid #D9D9D9;

    }

    .city_select {
        text-align: center;
        padding: 0;
        width: 25%;
        height: 2.5em;
        border: 1px solid #D9D9D9;
    }

    .weui-input:focus {
        border: 1px solid orange;
    }

    .weui-cell {
        padding: 15px 0;
    }

    .weui-cell:before {
        display: none;
    }

    .searchToast {
        display: none;
        padding: 10px;
        background-color: #fff;
        line-height: 2;
    }

    .btn_list {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        padding: 0 15px;
        overflow: hidden;
        .btn {
            outline: none;
            width: 45%;
            height: 3em;
            border: none;
            background-color: deepskyblue;
            color: #fff;
            font-size: 13px;
            margin: 5px 0;
            border-radius: 4px;
            transition: transform 100ms;
            &:active {
                transform: scale(0.98);
            }
        }
    }

    input, select {
        font-size: 13px;
    }

    .bottom-btn-box {
        box-sizing: border-box;
        position: fixed;
        left: 0;
        bottom: 0;
        padding: 5px 15px;
        width: 100%;
        background-color: #fff;
    }

    .bottom-btn {
        width: 100%;
        line-height: 2.5em;
        background-color: deepskyblue;
        color: #fff;
        font-size: 16px;
        border: none;
    }
</style>
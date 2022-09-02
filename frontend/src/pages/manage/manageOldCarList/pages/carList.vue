<template>
    <div class="CarList">
        <div class="list">
            <PullDownRefresh
                    :opt="opt"
                    @pullDown="pullDown"
                    @pullUp="pullUp"
                    @scroll="listenScroll"
                    ref="pullUpDown"
            >
                <div class="header">
                    <div class="options clearfix" v-if="statusListEnable.length > 0">
                        <button
                                :data-status="item.status"
                                :data-type="item.type"
                                class="btn"
                                :class="{
                                    active:item.status===currentStatus && item.type===currentType
                                    }"
                                v-for="item in statusListEnable"
                                :key="item.status+'_'+item.type"
                                @click="()=>statusBtnClick(item)"
                        >{{item.des+'('+item.count+')'}}
                        </button>
                    </div>
                    <div class="options" v-else>正在加载车辆状态列表...</div>
                    <div class="options2" v-show="statusListEnable.length > 0">
                        <label>排序：<select @change="compareChange">
                            <option value="0">按时间</option>
                            <option value="1">按网点</option>
                        </select></label>
                    </div>
                </div>
                <CarBox
                        v-for="item,index in carList"
                        :key="item.plate+item.vin"
                        :car="item"
                        :index="(currentPage-1)*10+index"
                        :type="currentStatus"
                        @showCommentLog="commentLog"
                        @commentStatus="commentStatus"
                        @commentOk="commentOk"
                        @likeError="handleError"
                />
            </PullDownRefresh>
        </div>
        <div class="goTop" v-show="scrollTop<-200" @click="scrollToTop">回顶部</div>
        <footer class="footer">
            <button class="btn" @click="back">返回</button>
        </footer>
        <CommentLog :car="currentCar" v-if="show_commentLog" @destroyBox="()=>{this.show_commentLog=false}" @likeError="handleError"/>
    </div>
</template>

<script>
  import CarBox from '../components/carBoxOld'
  import CommentLog from '../components/commentLog.vue'
  import PullDownRefresh from '../../../../../other_modules/vue-pullDownRefresh'

  import {getManageUrl} from "../../../../../other_modules/url-constructor/index";
  import myAjax from "../../../../../other_modules/like-request/withAxiosV2";

  export default {
    name: "car-list",
    components: {
      CarBox,
      CommentLog,
      PullDownRefresh
    },
    data () {
      return {
        uuid: window.localStorage.getItem('uuid'),
        sign: window.localStorage.getItem('sign'),
        city_id: window.localStorage.getItem('city_id') || '',

        statusList: [],
        currentStatus: 0,
        currentType: 0,

        carList: [],

        currentPage: 1,
        scrollTop:0,

        opt: {
          height: 300,// 容器高度
          usePullDown: true,// 是否启用下拉
          usePullUp: true, // 是否启用上拉
          listenScroll:true
        },

        orderByBranch: false,
        show_commentLog: false,
        currentCar: null,

      }
    },
    computed: {
      // 去除前三个车辆状态
      statusListEnable () {
        let disabled_ids = [0, 1, 2]
        disabled_ids = [302,303]
        return this.statusList.filter(item => {
          return !disabled_ids.includes(item.status)
        })
      }
    },
    methods: {
      // 获取状态列表
      getStatusList () {
        return myAjax.post(getManageUrl('/car/status-list'), {
          uuid: this.uuid,
          sign: this.sign,
          city_id: this.city_id
        }).then(res => {
          if (res.status !== 0) {
            throw res
          } else {
            this.statusList = res.data
            this.$nextTick(()=>{
              this.opt.height = window.innerHeight - 57
            })
          }
        })
      },

      // 获取车辆列表
      getCarList () {
        return myAjax.post(getManageUrl('/car/list-new'), {
          uuid: this.uuid,
          sign: this.sign,
          city_id: this.city_id,
          status: this.currentStatus,
          type: this.currentType,
          page: this.currentPage,
          compare: this.orderByBranch ? 1 : 0
        }).then(res => {
          if (res.status !== 0) {
            throw res
          } else {
            if(this.currentPage === 1){
              this.carList = res.data.data
            }else{
              this.carList = this.carList.concat(res.data.data)
            }
            return res
          }
        }).catch(err => {
          throw err
        })
      },

      statusBtnClick (item) {
        this.currentStatus = item.status
        this.currentType = item.type
        this.currentPage = 1
        let loading = this.$_LIKE_loading()
        this.getCarList().then(res => {
          loading.close()
          if (res.data.data.length === 0) {
            this.$_LIKE_toast('当前状态列表为空')
          }else{
            this.scrollToTop()
            this.$refs.pullUpDown.statusHeader = 0
            this.$refs.pullUpDown.statusFooter = 0
            this.$refs.pullUpDown.scroll.refresh()
          }
        }).catch(err=>{
          loading.close()
          this.handleError(err)
        })
      },
      scrollToTop(){
        this.$nextTick(()=>{
          this.$refs.pullUpDown.scrollTo()
        })
      },
      pullDown(){
        this.currentPage = 1
        this.getCarList().then(res => {
          this.$refs.pullUpDown.update()
          if (res.data.length === 0) {
            this.$_LIKE_toast('当前状态列表为空')
          }
        }).catch(this.handleError)
      },
      pullUp(){
        this.currentPage++
        this.getCarList().then(res => {

          if (res.data.data.length === 0) {
            this.$refs.pullUpDown.update({
              noMore:true
            })
          }else{
            this.$refs.pullUpDown.update()
          }
        }).catch(this.handleError)
      },
      listenScroll(value){
        this.scrollTop = value
      },

      back () {
        window.history.back()
      },

      compareChange (value) {
        this.orderByBranch = Boolean(value)

        if (this.carList.length === 0) return

        this.currentPage = 1
        this.getCarList().then(res=>{
          this.scrollToTop()
        }).catch(this.handleError)
      },

      commentLog (car) {
        this.show_commentLog = true
        this.currentCar = car
      },

      commentStatus (car) {
        let loading = this.$_LIKE_loading('修改中...')

        myAjax.post(getManageUrl('/evaluate/handle-ok'),{
          uuid: this.uuid,
          sign: this.sign,
          city_id: this.city_id,
          car_id: car.car_id,
          from: '2'
        }).then(res=>{
          loading.close()
          if (res.status !== 0) {
            throw res
          } else {
            window.location.href = 'changeStatus.html?name=' + car.plate;
          }
        }).catch(err=>{
          loading.close()
          this.handleError(err)
        })

      },
      commentOk (car) {
        let loading = this.$_LIKE_loading('修改中...')

        myAjax.post(getManageUrl('/evaluate/handle-ok'),{
          uuid: this.uuid,
          sign: this.sign,
          city_id: this.city_id,
          car_id: car.car_id,
          from: '1'
        }).then(res=>{
          loading.close()
          if (res.status !== 0) {
            throw res
          } else {
            let index = this.carList.findIndex(item => item.car_id === car.car_id)
            this.carList = this.carList.splice(index,1)
          }
        }).catch(err=>{
          loading.close()
          this.handleError(err)
        })

      },
      handleError (err) {
        console.log(err)
        if (err && err.status) {
          if (err.status === 6001) {
            // 登录过期
            this.$_LIKE_toast('登录过期，请重新登录')
            window.location.href = 'login.html'
          } else {
            this.$_LIKE_toast(err.msg)
          }
        } else {
          this.$_LIKE_toast('出错了，请重试')
        }
      }
    },
    created () {
      this.getStatusList().catch(this.handleError)
    },
    beforeDestroy () {
      //this.$store.commit('carList/destroy')
    }
  }
</script>

<style lang=less scoped>
    .CarList {
        .header {
            padding: 5px;
            .options {

                .btn {
                    float: left;
                    outline: none;
                    background-color: #fff;
                    border: solid 1px #dfdfdf;
                    font-size: 13px;
                    height: 2em;
                    padding: 3px 6px;
                    margin: 3px;
                    &.active {
                        border-color: #0a8cff;
                        color: #fff;
                        background-color: #0a8cff;
                    }
                }
            }
            .options2 {
                margin: 3px 0;
            }
        }
        .list {
            padding-bottom: 56px;
            border-top: solid 1px #dbdbdb
        }
        .goTop{
            width: 50px;
            height: 50px;
            line-height: 50px;
            text-align: center;
            background-color: rgba(0,0,0,.5);
            color:#fff;
            border:1px solid #D9D9D9;
            border-radius: 50%;
            position: fixed;
            bottom: 70px;
            right: 30px;
        }
        .footer {
            position: fixed;
            bottom: 0;
            width: 100%;
            box-sizing: border-box;
            padding: 8px 15px;
            background-color: #fff;
            box-shadow: 0 -1px 2px 0 rgba(0, 0, 0, 0.2);
            .btn {
                width: 100%;
                height: 40px;
                border: none;
                padding: 0;
                font-size: 14px;
                color: #fff;
                background-color: #15BDF4;
            }
            .el-pagination {
                padding: 3px 0;
                display: flex;
                justify-content: space-around;
            }
        }
    }

</style>
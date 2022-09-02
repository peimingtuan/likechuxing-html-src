<template>
    <div class="CarList">
        <div class="header">
            <div class="options" v-if="statusListEnable.length > 0">
                <button
                        :data-status="item.status"
                        :data-type="item.type"
                        class="btn"
                        :class="{active:item.status===currentStatus && item.type===currentType}"
                        v-for="item in statusListEnable"
                        :key="item.status+'_'+item.type"
                        @click="()=>getCarList(item)"
                >{{item.des+'('+item.count+')'}}
                </button>
            </div>
            <div class="options" v-else>正在加载车辆状态列表...</div>
            <div class="options2" v-show="statusListEnable.length > 0">
                <el-switch
                        v-model="orderByBranch"
                        active-text="按网点排序"
                        inactive-text="按时间排序"
                        @change="compareChange"
                >
                </el-switch>
            </div>
        </div>
        <div class="list">
            <CarBox
                    v-for="item,index in carList"
                    :key="item.plate+item.vin"
                    :car="item"
                    :index="(currentPage-1)*10+index"
                    :type="currentStatus"
                    @showCommentLog="commentLog"
                    @commentStatus="commentStatus"
                    @commentOk="commentOk"
            />
        </div>
        <footer class="footer">
            <button class="btn" @click="back">返回</button>
                <el-pagination
                        v-if="total>10"
                        background
                        layout="prev, pager, next"
                        :page-size="10"
                        :pager-count="5"
                        :current-page="currentPage"
                        :total="total"
                        @current-change="pageChange"
                >
                </el-pagination>
        </footer>
        <CommentLog :car="currentCar" v-if="show_commentLog" @destroyBox="()=>{this.show_commentLog=false}"/>
    </div>
</template>

<script>
  import {mapState, mapGetters} from 'vuex'
  import CarBox from '../components/carBox'
  import CommentLog from '../components/commentLog.vue'

  export default {
    name: "car-list",
    components: {
      CarBox,
      CommentLog
    },
    data () {
      return {
        currentStatus: 0,
        currentType: 0,
        orderByBranch: false,
        show_commentLog: false,
        currentCar: null,

        currentPage:1
      }
    },
    computed: {
      ...mapState('carList', ['carList','total']),
      ...mapGetters('carList', ['statusListEnable'])
    },
    methods: {
      getCarList ({status, type, scrollTop}) {
        if(status !== this.currentStatus || type !== this.currentType){
          this.currentPage = 1
        }

        let loading = this.$_LIKE_loading()
        this.$store.dispatch('carList/getCarList', {
          status,
          type,
          page:this.currentPage,
          compare:this.orderByBranch?1:0
        }).then(res => {
          loading.close()
          this.currentStatus = status
          this.currentType = type
          if (res.data.length === 0) {
            this.$_LIKE_toast('当前状态列表为空')
          }else if(scrollTop){
            let posNow = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
            let step = posNow/25
            let scroll = function(target){
              window.scrollTo(0,target>=0?target:0)
              if(target>0){
                setTimeout(function(){
                  scroll(target-step)
                },17)
              }
            }
            scroll(posNow-step)
          }
        }).catch(err => {
          loading.close()
          if (err && err.msg) {
            this.$_LIKE_toast(err.msg)
          } else {
            this.$_LIKE_toast('网络错误，请重试')
          }
        })
      },

      pageChange (page){
        if(this.carList.length===0)return

        this.currentPage = page
        this.getCarList({
          status:this.currentStatus,
          type:this.currentType,
          scrollTop:true
        })
      },

      back(){
        this.$router.back()
      },

      compareChange (value){
        this.orderByBranch = value

        if(this.carList.length===0)return

        this.getCarList({
          status:this.currentStatus,
          type:this.currentType,
          scrollTop:true
        })
      },

      commentLog (car) {
        this.show_commentLog = true
        this.currentCar = car
      },

      commentStatus (car) {
        let loading = this.$_LIKE_loading('修改中...')
        this.$store.dispatch('carList/evaluateOk', {
          car_id: car.car_id,
          from: '2'
        }).then(res => {
          loading.close()
          window.location.href = 'changeStatus.html?name=' + car.plate;
        }).catch(err => {
          loading.close()
          if (err && err.msg) {
            this.$_LIKE_toast(err.msg)
          }
        })
      },
      commentOk (car) {
        let loading = this.$_LIKE_loading('修改中...')
        this.$store.dispatch('carList/evaluateOk', {
          car_id: car.car_id,
          from: '1'
        }).then(res => {
          loading.close()
          let index = this.carList.findIndex(item => item.car_id === car.car_id)
          this.$store.commit('deleteCarItem', index)
        }).catch(err => {
          loading.close()
          if (err && err.msg) {
            this.$_LIKE_toast(err.msg)
          }
        })
      },
    },
    created () {
      this.$store.dispatch('carList/getStatusList').catch(err => {
        if (err && err.msg) {
          this.$_LIKE_toast(err.msg)
        }
      })
    },
    beforeDestroy () {
      this.$store.commit('carList/destroy')
    }
  }
</script>

<style lang=less scoped>
    .CarList {
        .header {
            padding: 10px 15px 5px;
            .options {
                display: flex;
                flex-wrap: wrap;
                .btn {
                    flex: 1;
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
            padding-bottom: 90px;
            border-top: solid 1px #dbdbdb
        }
        .footer{
            position: fixed;
            bottom:0;
            width: 100%;
            box-sizing: border-box;
            padding: 0 15px;
            background-color: #fff;
            box-shadow:0 -1px 2px 0 rgba(0,0,0,0.2);
            .btn{
                position: absolute;
                top: -45px;
                border:none;
                width: 40px;
                height: 40px;
                padding: 0;
                font-size: 14px;
                color:#fff;
                background-color: #15BDF4;
                border-radius: 20px;
            }
            .el-pagination{
                padding: 3px 0;
                display: flex;
                justify-content: space-around;
            }
        }
    }

</style>
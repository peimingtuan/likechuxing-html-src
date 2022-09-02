<template>
    <div class="SearchPage">
        <div class="header">
            <input class="search" ref="search" v-model="query" type="text" placeholder="请输入车牌号或着VIN后六位"/>
            <button class="float-right btn" @click="search">确定</button>
            <span class="clear-icon iconfont" v-show="query!==''" @click="clearQuery">&#xe601;</span>
        </div>
        <div class="content" v-show="history.length > 0">
            <p class="title">历史搜索</p>
            <ul class="history">
                <li class="item" v-for="item in history" :key="item.id" @click="searchHistory(item)">{{item.contents}}
                </li>
            </ul>
        </div>

        <!--查询出多个vin号的时候弹出多个alert提示框-->
        <div class="alert_toastvin" v-if="results.length > 0">
            <div class="toast_contentvin">
                <p class="title">请选择车辆</p>
                <ul class="contentvin_list">
                    <li class="item" v-for="item in results" :key="item.vin" @click="chooseCar(item)">
                        {{item.plate_no}}（{{item.vin}}
                    </li>
                </ul>
            </div>
        </div>
    </div>

</template>

<script>
  import waterMark from '../../../../../other_modules/like-manageOrder/waterMark'
  import userData from '../../../../../other_modules/like-manageOrder/UserData'
  import {getOspApiUrl} from '../js/getApiUrl'
  import myAjax from '../../../../../other_modules/like-request/withAxiosV3'

  export default {
    name: "search",
    data () {
      return {
        query: '',
        history: [],
        results: []
      }
    },
    methods: {
      // 整备工单过来的
      _toPrepare (data) {
        myAjax.post(getOspApiUrl('/work-order-kerb/order-by-car'), {
          mobile: userData.state.mobile,
          car_id: data.car_id
        }).then(res => {
          if (res.status === 0) {
            sessionStorage.setItem("id", data.data.id);//存储整备工单id
            if (Number(res.data.status) === 2) {
              window.location.href = "../manageOrder/prepareWork/prepareend.html";
            } else {
              window.location.href = "../manageOrder/prepareWork/preparedetail.html";
            }
          } else {
            this.$_LIKE_toast(res.msg)
          }
        }).catch(err => {
          console.log(err)
        })
      },
      _toDetail (data) {
        if (this.$route.query.type === '2') {
          this._toPrepare(data)
          //prepare(resultData.car_id);//整备详情
        } else {
          sessionStorage.setItem("resultData", JSON.stringify(data));
          sessionStorage.setItem("carcity_id", data.city_id);
          window.location.href = '../manageOrderCardetail/index.html?plate_no=' + data.plate_no;
        }
        console.log(data)
      },
      chooseCar (item) {
        this.query = item.plate_no || item.vin
        this.results = []
      },
      clearQuery () {
        this.query = ''
      },
      getHistory () {
        myAjax.post(getOspApiUrl('/work-order/search-history'), {
          mobile: userData.state.mobile,
          PhoneInfo: userData.state.PhoneInfo || ''
        }).then(res => {
          if (res.status === 0) {
            this.history = res.data
          } else {
            this.$_LIKE_toast(res.msg)
          }
        }).catch(err => {
          console.log(err)
        })
      },
      search () {
        // todo 该接口的逻辑是查询出多条的话选一条重新查询，太浪费资源，日后优化
        if (this.query === "") {
          this.$_LIKE_toast('请输入查询关键字')
          return
        }

        let loading = this.$_LIKE_loading()
        myAjax.post(getOspApiUrl('/work-order/car-detail'), {
          mobile: userData.state.mobile,
          PhoneInfo: userData.state.PhoneInfo || '',
          content: this.query,
        }).then(res => {
          loading.close()
          if (res.status === 0) {
            if (res.data instanceof Array) {
              // 0条或>1条结果
              if (res.data.length === 0) {
                this.$_LIKE_toast('查询结果不存在')
              } else {
                this.results = res.data
              }
            } else {
                if(res.data.plate_no){
                    this._toDetail(res.data)
                }else{
                    this.$_LIKE_toast('此车牌不存在')
                }
            }
          } else {
            this.$_LIKE_toast(res.msg)
          }
        }).catch(err => {
          loading.close()
          console.log(err)
        })
      },
      searchHistory (history) {
        this.query = history.contents
        this.search()
      }
    },
    mounted () {
      this.$refs.search.focus()
    },
    beforeCreate () {
      userData.load()
    },
    created () {
      waterMark({watermark_txt: userData.state.nickName + '-' + userData.state.mobile});//水印

      this.getHistory()
    },
    beforeRouteLeave (to, from, next) {
      // 返回上一页如果手机虚拟键盘没有收起，会导致webview高度被挤占，影响布局
      this.$refs.search.blur()
      setTimeout(()=>{next()},300)
    }
  }
</script>

<style lang=less>
    .SearchPage {
        .header {
            font-size: 14px;
            padding: 0.15rem 0.2rem;
            background-color: #fff;
            width: 100%;
            box-sizing: border-box;
            border-bottom: solid 1px #dfdfdf;
            position: relative;
            .search {
                font-size: 13px;
                line-height: 0.34rem;
                border: none;
                width: 2.5rem;
                box-sizing: border-box;
                background-color: #f0f0f0;
                padding: 0 0.1rem;
                border-radius: 0.17rem;
            }

            .btn {
                width: 0.65rem;
                margin: 0;
                padding: 0;
                height: 0.34rem;
                color: #fff;
                background-color: #333;
                border: none;
                border-radius: 3px;
                font-size: 14px;
            }

            .clear-icon {
                width: 0.22rem;
                line-height: 0.22rem;
                font-size: 12px;
                text-align: center;
                border-radius: 50%;
                background: #d8d8d8;
                position: absolute;
                left: 2.4rem;
                top: 50%;
                margin-top: -0.11rem;
            }

        }

        .content {
            padding: 0.15rem 0.2rem;
            .title {
                color: #999;
            }
            .history {
                margin: 0 -0.05rem;
                .item {
                    display: inline-block;
                    margin: 0.05rem;
                    text-align: center;
                    line-height: 0.36rem;
                    padding: 0 0.15rem;
                    border: 1px solid #ebebeb;
                }
            }
        }
    }

    /*查询出多个vin号的时候弹出多个alert提示框*/
    .alert_toastvin {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 10;

        .toast_contentvin {
            position: absolute;
            top: 50%;
            left: 50%;
            margin-top: -2rem;
            margin-left: -1.2rem;
            width: 2.4rem;
            height: 3rem;
            background-color: #fff;
            border-radius: 5px;
            overflow-y: scroll;
            font-size: 14px;
            .title {
                text-align: center;
            }
            .contentvin_list {
                margin: 0.05rem 0.1rem;
                .item {
                    line-height: 0.3rem;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }
        }
    }

</style>

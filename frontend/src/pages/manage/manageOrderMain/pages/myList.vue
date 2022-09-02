<template>
    <div class="list-con">
        <ul class="order-list">
            <li class="item"
                v-for="item in orderList"
                :key="item.id"
                v-if="item.permission"
                @click="toItem(item)"
            >
                <span class="name">{{item.name}}({{item.num}})</span>
                <span class="arrow iconfont">&#xe623;</span>
            </li>
        </ul>
    </div>
</template>

<script>
  import waterMark from '../../../../../other_modules/like-manageOrder/waterMark'
  import userData from '../../../../../other_modules/like-manageOrder/UserData'
  import {getOspApiUrl} from '../js/getApiUrl'
  import myAjax from '../../../../../other_modules/like-request/withAxiosV3'

  export default {
    name: "my-list",
    data () {
      return {
        orderList: [
          {
            id: 1,
            name: '加油工单',
            num: 0,
            permission_name: 'oil_list',
            permission: 1,
            url: '../manageOrder/oilerSingle/oiler.html'
          },
          {
            id: 2,
            name: '调度工单',
            num: 0,
            permission_name: 'dispatch_list',
            permission: 1,
            url: '../manageOrder/schedulingJob/mywork.html'
          },
          {
            id: 3,
            name: '充电工单',
            num: 0,
            permission_name: 'charging_num',
            permission: 1,
            url: '../manageOrder/chargeWork/charge.html#/mychargelist'
          },
          {
            id: 4,
            name: '故障工单',
            num: 0,
            permission_name: 'fault_num',
            permission: 1,
            url: '../manageOrder/faultWork/myfaultlist.html'
          },
          {
            id: 5,
            name: '整备工单',
            num: 0,
            permission_name: 'kerb_num',
            permission: 1,
            url: '../manageOrder/prepareWork/mypreparelist.html'
          },
          {
            id: 26,
            name: '保养工单',
            num: 0,
            permission_name: 'vehicle_office',
            permission: 1,
            url: '../manageOrderMaintenance/index.html#/mine',
            icon: require('../images/icon26.png')
          },
          {
            id: 6,
            name: '预警工单',
            num: 0,
            permission_name: 'zombie_num',
            permission: 1,
            url: '../manageOrderWarning/index.html#/myWarn'
          },
          {
            id: 7,
            name: '事故保险工单',
            num: 0,
            permission_name: 'accident_num',
            permission: 1,
            url: '../accidentWorkList/index.html'
          },
          {
            id: 8,
            name: '洗车工单',
            num: 0,
            permission_name: 'wash_num',
            permission: 1,
            url: '../manageOrdercarwash/index.html#/mycarwashlist'
          },
          {
            id: 9,
            name: '办公用车',
            num: 0,
            permission_name: 'office_num',
            permission: 1,
            url: '../manageOrderOfficecar/index.html#/myList'
          },
          {
            id: 10,
            name: '年检工单',
            num: 0,
            permission_name: 'examine_num',
            permission: 1,
            url: '../annualReview/index.html#/myList'
          },
          {
                id:11,
                name: '挪车工单',
                num: 0,
                permission_name: 'move_num',
                permission: 1,
                url: '../manageOrderMovecar/index.html#/myList'
            },
          {
                id:12,
                name: '追车工单',
                num: 0,
                permission_name: 'abnormal_num',
                permission: 1,
                url: '../manageOrderNoOrder/index.html#/myOrder'
            },
            {
                id:13,
                name: '巡检工单',
                num: 0,
                permission_name: '',
                permission: 1,
                url: '../inspectionWork/index.html#/myworklist'
            }
        ],
      }
    },
    methods: {
      getMyList (mobile) {
        myAjax.post(getOspApiUrl('/work-order/mine-count'), {
          mobile
        }).then(res => {
          if (res.status === 0) {
            this.setNumById(1, res.data.oil_num)// 加油工单
            this.setNumById(2, res.data.dispatch_num)//调度
            this.setNumById(3, res.data.charging_num)// 充电
            this.setNumById(4, res.data.fault_num)// 故障
            this.setNumById(5, res.data.kerb_num)// 整备

            this.setNumById(6, res.data.zombie_num)// 预警
            this.setNumById(7, res.data.accident_num)// 事故保险
            this.setNumById(8, res.data.wash_num)// 洗车
            this.setNumById(9, res.data.office_num)// 办公用车
            this.setNumById(10, res.data.examine_num)// 年检工单
            this.setNumById(26,res.data.maintain_num)// 保养
            this.setNumById(11,res.data.move_num)// 挪车工单
            this.setNumById(12,res.data.abnormal_num)// 追车工单，无单启动
            this.setNumById(13,res.data.inspection_num)// 巡检工单
          } else {
            this.$_LIKE_toast(res.msg)
          }
        }).catch(err => {
          console.log(err)
        })

      },
      toItem (item) {
        window.location.href = item.url
      },
      setNumById (id, num) {
        this.orderList.forEach(item=>{
          if (item.id === id) item.num = num
        })
      },
    },
    beforeCreate () {
      userData.load()
    },
    created () {
      waterMark({watermark_txt: userData.state.nickName + '-' + userData.state.mobile});//水印

      this.getMyList(userData.state.mobile)
    }
  }
</script>

<style lang=less scoped>
    .list-con {
        box-sizing: border-box;
        border-top: solid 1px #dfdfdf;
        overflow: scroll;

        .order-list {
            width: 100%;
            padding-bottom: 0.8rem;

            .item {
                padding: 0.13rem 0.2rem;
                background-color: #fff;

                &:nth-of-type(2n) {
                    background-color: #f8f8f8;
                }

                &:nth-last-of-type(1) {
                    border-bottom: solid 1px #dfdfdf;
                }

                .arrow {
                    float: right;
                }
            }
        }
    }

</style>

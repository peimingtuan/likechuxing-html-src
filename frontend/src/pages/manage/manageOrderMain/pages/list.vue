<template>
    <div class="container">
        <div class="header" ref="header" v-if="dataReady">
            <div class="search" @click="toSearch">
                <span class="iconfont">&#xe605;</span>
                <span class="placeholder">请输入车牌号或网点名称</span>
            </div>
            <span class="rightIcon" @click="openFilter"></span>
        </div>
        <div class="msg" v-if="!dataReady">{{msg}}</div>
        <div v-else>
            <!-- <div class="section1" v-show="!statisticsIsShow">
                <div class="item" v-show="orderList[0].permission" @click="goCarList">
                    <div class="label">
                        <div>非租赁车辆</div>

                    </div>
                    <div class="icon-btn big" :style="'background-image: url('+orderList[0].icon+')'"></div>
                </div>
                <div class="item" @click="toMyList">
                    <div class="label">我的工单</div>
                    <div class="icon-btn big" :style="'background-image: url('+orderList[20].icon+')'"></div>
                </div>
            </div> -->
            <div class="section">
                <div class="list">
                    <div class="list-item" v-for="(item,index) in sectionData" :key="index" v-show="item.permission">
                        <ListItem :label="item.name" :num="item.num" @press="toItem(item)" :maxsize="true">
                            <div slot="icon" class="icon-btn big" :style="'background-image: url('+item.icon+')'"></div>
                        </ListItem>
                    </div>
                </div>
            </div>
            <div class="section2">
                <div class="title-box">
                    <div class="title">运维工单</div>
                </div>
                <div class="list">
                    <div class="list-item" v-for="(item,index) in section2Data" :key="index" v-show="item.permission">
                        <ListItem :label="item.name" :num="item.num" @press="toItem(item)">
                            <div slot="icon" class="icon-btn" :style="'background-image: url('+item.icon+')'"></div>
                        </ListItem>
                    </div>
                </div>
            </div>
            <div class="section3">
                <div class="title-box">
                    <div class="title">预警列表</div>
                </div>
                <div class="list">
                    <div class="list-item" v-for="(item,index) in section3Data" :key="index"
                         v-show="section3Data[0].permission">
                        <ListItem :label="item.name" :num="item.num" @press="toItem(item)">
                            <div slot="icon" class="icon-btn" :style="'background-image: url('+item.icon+')'"></div>
                        </ListItem>
                    </div>
                    <!--解决permission为其他字段-->
                    <div class="list-item" v-for="(item,index) in section5Data" :key="index"
                         v-show="item.permission">
                        <ListItem :label="item.name" :num="item.num" @press="toItem(item)">
                            <div slot="icon" class="icon-btn" :style="'background-image: url('+item.icon+')'"></div>
                        </ListItem>
                    </div>
                </div>
            </div>
            <div class="section4">
                <div class="title-box">
                    <div class="title">运维列表</div>
                </div>
                <div class="list">
                    <div class="list-item" v-for="(item,index) in section4Data" :key="index" v-show="item.permission">
                        <ListItem :label="item.name" :num="item.num" @press="toItem(item)">
                            <div slot="icon" class="icon-btn" :style="'background-image: url('+item.icon+')'"></div>
                        </ListItem>
                    </div>
                </div>
            </div>
        </div>


        <SlideUpBox v-if="filter_show" title="筛选" ref="slideUpBox" @close="()=>this.filter_show=false">
            <FilterMultiple
                    title="城市定位"
                    :options="cityList"
                    :preselect="city_ids"
                    :min="1"
                    :max="3"
                    ref="filter"
            />

            <div class="box-footer">
                <LikeButton
                        text="重置"
                        type="gray"
                        @click="filterReset"
                        class="btn"
                />
                <LikeButton
                        text="确定"
                        type="primary"
                        @click="filterSearch"
                        class="btn float-right"
                />
            </div>
        </SlideUpBox>
    </div>
</template>
<script>

  import SlideUpBox from '../../../../../other_modules/like-manageOrder/component/SlideUpBox'
  import FilterMultiple from '../../../../../other_modules/like-manageOrder/component/FilterMultiple'
  import LikeButton from '../../../../../other_modules/like-manageOrder/component/Button'

  import waterMark from '../../../../../other_modules/like-manageOrder/waterMark'
  import userData from '../../../../../other_modules/like-manageOrder/UserData'
  import appArguments from '../../../../../other_modules/app-arguments'
  import {getOspApi3Url as api} from '../../../../../other_modules/url-constructor/'
  import http from '../../../../../other_modules/like-request/withAxiosV3'
  import dd from '../../../../../other_modules/like-manageOrder/ddSDK'

  import {Toast,Indicator} from 'mint-ui'
  import ListItem from '../components/listItem'

  const setCookie = function (c_name, value, expiredays) {
    let exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
  }

  export default {
    name: 'menuList',
    components: {
      ListItem,
      SlideUpBox,
      FilterMultiple,
      LikeButton
    },
    data () {
      return {
        dataReady: false,
        msg: '正在获取登录信息',
        orderList: [
          {
            id: 0,
            // 显示出来的名字
            name: '非租赁车辆',
            // 数量
            num: -1,
            // 权限名称，用于请求权限
            permission_name: 'not_use_car_list',
            // 当前账号是否拥有此项权限，默认0
            permission: 0,
            // 当前功能的主页url，相对地址
            url: '../manageOrderCardetail/rentcarlist.html',
            icon: require('../images/icon1.png')
          },
          {
            id: 1,
            name: '加油工单',
            num: -1,
            permission_name: 'oil_list',
            permission: 0,
            url: '../manageOrder/oilerSingle/alloiler.html',
            icon: require('../images/icon3.png')
          },
          {
            id: 2,
            name: '充电工单',
            num: -1,
            permission_name: 'vehicle_charging',
            permission: 0,
            url: '../manageOrder/chargeWork/charge.html#/chargelist',
            icon: require('../images/icon4.png')
          },
          {
            id: 3,
            name: '调度工单',
            num: -1,
            permission_name: 'dispatch_list',
            permission: 0,
            url: '../manageOrder/schedulingJob/alldispatch.html',
            icon: require('../images/icon5.png')
          },
          {
            id: 4,
            name: '故障工单',
            num: -1,
            permission_name: 'vehicle_list',
            permission: 0,
            url: '../manageOrder/faultWork/faultlist.html',
            icon: require('../images/icon6.png')
          },
          // {
          //   id: 5,
          //   name: 'B+停车列表',
          //   num: -1,
          //   permission_name: 'vehicle_list',
          //   permission: 0,
          //   url: '../manageOrderNeedpaynet/index.html#/list'
          // },
          {
            id: 6,
            name: '整备工单',
            num: -1,
            permission_name: 'kerb_list',
            permission: 0,
            url: '../manageOrder/prepareWork/preparelist.html',
            icon: require('../images/icon8.png')
          },
          {
            id: 7,
            name: '车辆库存',
            num: -1,
            permission_name: 'branch_car_stock_number',
            permission: 0,
            url: '../manageOrder/carNetstock/carstocklist.html',
            icon: require('../images/icon15.png')
          },
          {
            id: 8,
            name: '调度列表',
            num: -1,
            permission_name: 'branch_car_stock_list',
            permission: 0,
            url: '../manageOrder/dispatch/controllist.html',
            icon: require('../images/icon17.png')
          },
          {
            id: 9,
            name: '车辆问题',
            num: -1,
            permission_name: 'branch_car_follow_list',
            permission: 0,
            url: '../manageOrder/carProblemsList/proOrder.html#/proList',
            icon: require('../images/icon16.png')
          },
          {
            id: 10,
            name: '事故专员打卡',
            num: -1,
            permission_name: 'duty_list',
            permission: 0,
            url: '../manageOrder/staffOffice/officeIndex.html#/office',
            icon: require('../images/icon21.png')
          },
          // {
          //   id: 11,
          //   name: '车辆预定列表',
          //   num: -1,
          //   permission_name: 'booking_list',
          //   permission: 0,
          //   url: '../manageOrder/destineCar/destinelist.html',
          //   icon:require('../images/icon18.png')
          // },
          {
            id: 12,
            name: '开四停四',
            num: -1,
            permission_name: 'transfer_list',
            permission: 0,
            url: '../manageOrder/fourDriveOrPark/fourList.html#/fourIndex',
            icon: require('../images/icon20.png')
          },
          {
            id: 13,
            name: '成都限行',
            num: -1,
            permission_name: 'chengdu_limit',
            permission: 0,
            url: '../manageOrder/CDLimit/CDList.html#/limitIndex',
            icon: require('../images/icon19.png')
          },
          {
            id: 14,
            name: '遗失物品',
            num: -1,
            permission_name: 'list_lost_record',
            permission: 0,
            url: '../manageOrderLostManagement/index.html',
            icon: require('../images/icon9.png')
          },
          {//@xurr 0911 添加
            id: 15,
            name: '智能调度',
            num: 0,
            permission_name: 'algorithm',
            permission: 0,
            url: '../manageOrderDispatchTask/index.html#/list',
            icon: require('../images/icon14.png')
          },
          {//@xurr 0911 添加 始终放在最后
            id: 16,
            name: '统计报表',
            num: -1,
            permission_name: 'list_statistics',
            permission: 0,
            url: '../manageOrderStatisticalForm/index.html#/formList',
            icon: require('../images/icon22.png')
          },
          {//@xurr 0911 添加
            id: 17,
            name: '维修工单',
            num: -1,
            permission_name: 'vehicle_repair',
            permission: 0,
            url: '../manageOrderService/index.html#/list',
            icon: require('../images/icon7.png')
          },
          {
            id: 18,
            name: '事故保险',
            num: -1,
            permission_name: 'accident',
            permission: 0,
            url: '../accidentWorkList/index.html',
            icon: require('../images/icon10.png')
          },
          {
            id: 19,
            name: '24小时追车',
            num: -1,
            permission_name: 'car_catch_list',
            permission: 0,
            url: '../manageOrder/chasingCars/earlywarning.html',
            icon: require('../images/icon11.png')
          },
          {
            id: 20,
            name: '24小时未动',
            num: -1,
            permission_name: 'car_catch_list',
            permission: 0,
            url: '../manageOrderWarning/index.html#/notMove',
            icon: require('../images/icon12.png')
          },
          {
            id: 21,
            name: '远距离车辆',
            num: -1,
            permission_name: 'car_catch_list',
            permission: 0,
            url: '../manageOrder/chasingCars/warnIndex.html#/longDistance',
            icon: require('../images/icon13.png')
          },
          {
            id: 22,
            name: '我的工单',
            num: -1,
            permission_name: '',
            permission: 1,
            handleClick: this.toMyList,
            icon: require('../images/icon2.png')
          },
          {
            id: 23,
            name: '洗车工单',
            num: -1,
            permission_name: 'vehicle_wash',
            permission: 0,
            url: '../manageOrdercarwash/index.html#/carwashlist',
            icon: require('../images/icon23.png')
          },
          {
            id: 24,
            name: '待检查列表',//洗车
            num: -1,
            permission_name: 'cancel_vehicle_wash',
            permission: 0,
            url: '../manageOrdercarwash/index.html#/checkedcarwashlist',
            icon: require('../images/icon24.png')
          },
          {
            id: 25,
            name: '办公用车',
            num: -1,
            permission_name: 'vehicle_office',
            permission: 0,
            url: '../manageOrderOfficecar/index.html#/list',
            icon: require('../images/icon25.png')
          },
          {
            id: 26,
            name: '保养工单',
            num: -1,
            permission_name: 'vehicle_maintain',
            permission: 1,
            url: '../manageOrderMaintenance/index.html#/list',
            icon: require('../images/icon26.png')
          },
          {
            id: 27,
            name: '年检工单',
            num: -1,
            permission_name: 'vehicle_examine',
            permission: 0,
            url: '../annualReview/index.html',
            icon:require('../images/icon27.png')
          },
          {
            id: 28,
            name: '挪车工单',
            num: -1,
            permission_name: 'vehicle_move',
            permission: 0,
            url: '../manageOrderMovecar/index.html#/list',
            icon:require('../images/icon28.png')
          },

          {
            id: 29,
            name: '长租列表',
            num: -1,
            permission_name: 'long_rental',
            permission: 0,
            url: '../longRentList/index.html',
            icon:require('../images/icon29.png')
          },
          {
            id: 30,
            name: '无单启动',
            num: -1,
            permission_name: 'vehicle_abnormal',
            permission: 0,
            url: '../manageOrderNoOrder/index.html',
            icon:require('../images/icon30.png')
          },
            {
                id: 31,
                name: '巡检工单',
                num: -1,
                permission_name: 'vehicle_abnormal',
                permission: 1,
                url: '../inspectionWork/index.html#/list',
                icon:require('../images/icon31.png')
            }
        ],
        cityList: [],
        city_ids: [],
        filter_show: false,
        filter_options: this.cityList,
        // 额外需要查询的权限
        otherPermissionList: [
          'on_duty',
          'off_duty'
        ]
      }
    },
    computed: {
      allPermission () {
        let str =  this.orderList.map(item => item.permission_name).concat(this.otherPermissionList).join(',')
        return str + ',long_rental_stat'
      },
      city_ids_str () {
        return this.city_ids.join(',')
      },
      // 头部
      sectionData () {
        let ids = [0, 22, 16]
        return ids.map(id => this.orderList.find(item => item.id === id))
      },
      // 工单
      section2Data () {
        let ids = [1, 2, 3, 4, 17, 6, 14, 18, 23, 25, 26,27, 28,31]
        return ids.map(id => this.orderList.find(item => item.id === id))
      },
      // 预警
      section3Data () {
        let ids = [19, 20, 21]
        return ids.map(id => this.orderList.find(item => item.id === id))
      },
      section5Data () {//解决19/20/21为同一个权限字段页面问题
        let ids = [30]
        return ids.map(id => this.orderList.find(item => item.id === id))
      },
      // 运维
      section4Data () {
        let ids = [15, 7, 9, 8, 13, 12, 10, 24, 29]
        return ids.map(id => this.orderList.find(item => item.id === id))
      },
      statisticsIsShow () {
        let arr = this.orderList.slice()
        let i = {}
        arr.map(item => {
          if (item.id == 16) {
            i = item
          }
        })
        if (i.permission > 0) {
          return true
        } else {
          return false
        }
      }
    },
    beforeCreate () {
      userData.load()
    },
    created () {
      //this.$showLoading('enterLoading')
      this.checkInfo()
    },
  mounted()
  {
      let _this = this,
              runFlag = true,
              touchStart = 0,
              touchFlag = false;
      document.getElementsByClassName("container")[0].addEventListener('touchstart', function (e) {
          touchFlag = true;
          touchStart = e.targetTouches[0].pageY;
      }, false);
      document.getElementsByClassName("container")[0].addEventListener('touchmove', function (e) {
          if (touchFlag) {
              //e.preventDefault();//组织浏览器默认事件
              if (touchStart < e.targetTouches[0].pageY - 160) {
                  touchStart = 0;
                  prevPage()
              }
          }
      }, false);
      document.getElementsByClassName("container")[0].addEventListener('touchend', function (e) {
          touchFlag = false;
      }, false);
      //向上刷新
      function prevPage() {
          if(runFlag){
              runFlag=false;
              Indicator.open({
                  text: '页面刷新中...',
                  spinnerType: 'fading-circle'
              });
              _this.getNumList({
                  mobile: userData.state.mobile,
                  city_id: _this.city_ids_str
              }).then(res => {
                  Indicator.close();//去除loading
                  runFlag=true;
              }).catch(err => {
                  console.log(err)
              })
          }
      }
  }
  ,
    methods: {
      checkInfo () {
        if (userData.state.city_ids && userData.state.cityList) {
          this.cityList = userData.state.cityList
          this.city_ids = userData.state.city_ids
        }
        let _this = this
        if (dd.inDDApp) {
          if (userData.state.permission) {
            // 实际权限替换默认权限
            let obj = userData.state.permission
            for (let key in obj) {
              if (obj.hasOwnProperty(key)) {
                let index = this.orderList.findIndex(item => item.permission_name === key)
                if (index > -1) this.orderList[index].permission = obj[key]
              }
            }
            this.getNumList({
              mobile: userData.state.mobile,
              city_id: this.city_ids_str
            }).then(res => {
              _this.saveCity(res)
              this.$hideLoading('enterLoading')
              this.dataReady = true
            }).catch(err => {
              console.log(err)
            })
          } else {
            // 获取设备信息
            dd.getPhoneInfo().then(res => {
              userData.save({
                phoneInfo: res
              })
              // 兼容旧版，日后删除 todo
              sessionStorage.setItem("PhoneInfo", JSON.stringify(res));
            }).catch(err => {
              Toast('获取设备信息失败')
            })

            // 获取用户信息
            dd.getUser().then(res => {
              userData.save({
                nickName: res.nickName,
                avatar: res.avatar
              })
              // 兼容旧版，日后删除 todo
              sessionStorage.setItem('userName', res.nickName);
              sessionStorage.setItem('avatar', res.avatar);//存储用户头像地址

              this.getNumList({
                userid: res.emplId,
                access_token: dd.signObj.access_token,
                city_id: ''
              }).then(res => {

                userData.save({
                  mobile: res.data.mobile
                })
                sessionStorage.setItem("mobile", res.data.mobile);//H5存储用户手机号
                setCookie("mobile", res.data.mobile, 10);//cookie存储用户手机号,兼容老版本 todo 日后删除

                waterMark({watermark_txt: userData.state.nickName + '-' + userData.state.mobile});//水印

                this.saveCity(res)

                Promise.all([
                  this.getPermissionList(res.data.mobile)
                ]).then(() => {
                  userData.save({
                    menuPage: {
                      orderList: this.orderList
                    }
                  })

                })

              })
            }).catch(err => {
              alert(JSON.stringify(err))
              Toast('获取用户信息失败')
            })
          }
        } else {
          //URL手动添加mobile参数方便测试
          if (appArguments.mobile) {
            this.saveMobile(appArguments.mobile)

            //获取待办数
            this.getNumList({
              mobile: appArguments.mobile
            }).then(res => {

              waterMark({watermark_txt: res.data.mobile})
              _this.saveCity(res)
            })

            //获取权限列表
            this.getPermissionList(appArguments.mobile)
            this.$hideLoading('enterLoading')
          } else {
            console.error('请在url输入参数以便于调试')
          }
        }
      },
      getPermissionList (mobile) {
        http.post(api('/permission/list'), {
          mobile,
          items: this.allPermission
        }).then(res => {
          if (res.status === 0) {

            // 实际权限替换默认权限
            let obj = res.data
            for (let key in obj) {
              if (obj.hasOwnProperty(key)) {
                let index = this.orderList.findIndex(item => item.permission_name === key)
                if (index > -1) this.orderList[index].permission = obj[key]
              }
            }
            userData.save({
              permission: obj
            })
            sessionStorage.setItem("on_duty", res.data.on_duty);//存储事故专员上班
            sessionStorage.setItem("off_duty", res.data.off_duty);//存储事故专员下班

            if(res.data.hasOwnProperty('long_rental_stat')){//长租统计
              sessionStorage.setItem('long_rental_stat',res.data.long_rental_stat)
            }

            if (this.orderList.every(item => Number(item.permission) === 0)) {
              this.msg = '当前账号没有任何权限，请联系管理员'
            } else {
              this.dataReady = true
            }
            userData.save({
              menuPage: {
                orderList: this.orderList
              }
            })
            this.$hideLoading('enterLoading')

          } else {
            Toast(res.msg)
          }
        }).catch(err => {
          console.log(err)
        })
      },
      getNumList (data) {
        this.msg = "正在加载功能列表"
        return http.post(api('/work-order/index'), data).then(res => {

          if (res.status == 0) {
            this.setNumById(0, res.data.car_num)//非租赁车辆数量
            this.setNumById(1, res.data.oil_num)//加油工单数量
            // this.setNumById(2,)//充电工单数量
            this.setNumById(3, res.data.dispatch_num)//调度工单数量
            this.setNumById(4, res.data.fault_num)//故障工单数量
            // this.setNumById(5,)//B+停车列表数量
            this.setNumById(6, res.data.kerb_num)//整备工单数量
            this.setNumById(7, res.data.stock_num)//车辆库存数量
            this.setNumById(8, res.data.dispatch)//调度列表数量
            this.setNumById(9, res.data.problem_num)//车辆问题记录数量
            this.setNumById(10, res.data.user_num)//事故管理
            // this.setNumById(11,res.data.due_num)//车辆预定数量
            this.setNumById(12, res.data.move_num)//开四停四调度车辆数
            this.setNumById(13, res.data.chengdu_limit_num)//成都限行
            // this.setNumById(14, )//遗失物品
            this.setNumById(15, res.data.algorithm)//智能调度
            this.setNumById(16, res.data.statistics)//统计报表
            this.setNumById(17, res.data.repair_num)//维修工单
            this.setNumById(19, res.data.catch)//24小时待追车
            this.setNumById(20, res.data.two_four)//24小时未动
            this.setNumById(21, res.data.distance)//远距离车辆
            this.setNumById(30, res.data.abnormal)//无单启动
            this.setNumById(26, res.data.maintain_num)//保养
//          this.setNumById(25,res.data.distance)//办公用车
            return res
          } else {
            Toast(res.msg)
          }
        }).catch(err => {
          console.log(err)
        })
      },
      saveMobile (v) {
        userData.save({
          mobile: v
        })
        sessionStorage.setItem("mobile", v);
        setCookie("mobile", v, 10);
      },
      saveCity (res) {
        let city_ids = res.data.city_id.split(',')
        let city_names = res.data.city_name.split(',')

        let list = city_ids.map((id, index) => {
          return {
            id: Number(id),
            name: city_names[index]
          }
        })
        sessionStorage.setItem('cityList',JSON.stringify(list))
        if (this.cityList.length < list.length) {
          this.cityList = list
          userData.save({
            cityList: this.cityList
          })
          sessionStorage.setItem('city_id', city_ids);
          setCookie("city_id", city_ids, 10);
        }
      },
      toItem (item) {
        switch (item.id) {
          case 12:
            // 开四停四
            sessionStorage.setItem('fourStatus', 1);
            sessionStorage.removeItem('check_biz_type');
            sessionStorage.removeItem('loca_check');
            sessionStorage.removeItem('type');
            window.location.href = item.url
            break;
          // case 12://车辆预订
          //   sessionStorage.setItem('fourStatus', '1,102,103');
          //   sessionStorage.removeItem('check_biz_type');
          //   sessionStorage.removeItem('loca_check');
          //   sessionStorage.removeItem('type');
          //   window.location.href = item.url
          //   break;
          case 22:
            this.toMyList();
            break;
          default:
            window.location.href = item.url
        }
      },
      toSearch () {
            window.location.href="../endwork/index.html#/rentlistsearch"
      },
      openFilter () {
        this.filter_show = true
      },
      filterReset () {

        this.$refs.filter.reset()
      },
      filterSearch () {
        this.filter_show = false
        this.$showLoading('searchLoading')
        this.city_ids = this.$refs.filter.getResult()
        userData.save({
          city_ids: this.city_ids
        })
        sessionStorage.setItem('city_id', this.city_ids_str);//存储选择的权限城市id todo 日后删除
        setCookie("city_id", this.city_ids_str, 10);//cookie存储权限城市id,兼容老版本 todo 日后删除

        this.getNumList({
          mobile: userData.state.mobile,
          city_id: this.city_ids_str
        }).then(res => {
          this.$hideLoading('searchLoading')
        }).catch(err => {

        })
      },
      goCarList () {
        window.location.href = this.orderList[0].url
      },
      toMyList () {
        this.$router.push('/myList')
      },
      setNumById (id, num) {
        this.orderList.forEach(item=>{
          if (item.id === id) item.num = num
        })
      }
    }
  }
</script>
<style lang="less" scoped>
    .container {
        width: 100%;
        min-height: 100vh;
        font-size: .14rem;
        background: #F5F5F5;
        padding-bottom: .5rem;

        .header {
            padding: 0.12rem 0.16rem;
            background-color: #fff;
            width: 100%;
            box-sizing: border-box;
            border-bottom: solid 1px #dfdfdf;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .search {
                width: 2.96rem;
                box-sizing: border-box;
                background-color: #f0f0f0;
                padding: 0.05rem 0.1rem;
                border-radius: 0.15rem;

                .placeholder {
                    color: #999;
                    font-size: 12px;
                }
            }

            .rightIcon {
                margin-left: 0.15rem;
                width: .23rem;
                height: .22rem;
                background: url('../images/icon_filter.png') no-repeat;
                background-size: 100% 100%;
            }
        }

        .msg {
            padding: 1.8rem 0;
            font-size: 12px;
            color: #888;
            text-align: center;
        }

        .section .list-item {
            position: relative;

            &::after {
                content: '';
                position: absolute;
                right: 0;
                top: .15rem;
                width: 1px;
                height: .57rem;
                background: #ddd;
                transform: scaleX(.5);
            }
        }

        .section1 {
            height: .9rem;
            background: #fff;
            margin-bottom: .1rem;
            display: flex;
            padding: .05rem 0;

            .item {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;

                .label {
                    font-family: PingFang-SC-Medium;
                    font-size: .16rem;
                    color: #333333;
                    margin-right: .3rem;

                    .desc {
                        font-size: .12rem;
                    }
                }

                &:first-child {
                    border-right: 1px solid #ddd
                }
            }
        }

        .section, .section2, .section3, .section4 {
            margin-bottom: .1rem;
            background: #fff;
        }

        .title-box {
            padding-left: .16rem;
            padding-top: .13rem;
            margin-bottom: .1rem;

            .title {
                height: .18rem;
                border-left: 3px solid #007BFF;
                padding-left: .12rem;
                font-size: .14rem;
            }
        }

        .list {
            display: flex;
            flex-wrap: wrap;
        }

        .list-item {
            width: .9375rem
        }

        .section {
            .list {
                .list-item {
                    flex: 1
                }
            }
        }

        .icon-btn {
            width: 0.3rem;
            height: 0.3rem;
            background: no-repeat center;
            background-size: 100% 100%;

            &.big {
                width: 0.36rem;
                height: 0.36rem;
            }
        }

        .refure-operation {
            position: fixed;
            bottom: 0.3rem;
            right: 0.3rem;

            img {
                width: 0.6rem;
            }
        }
    }
</style>

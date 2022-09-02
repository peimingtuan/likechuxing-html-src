<!--@xurr on 180612 车辆问题列表详情页面      
	1、显示车牌号/vin号，地址，车辆问题，上传时间；地址可点击，点击后打开地图，显示车辆位置（同非租赁状态车辆列表）
	2、车辆问题标签样式同“故障工单--车辆记录”里的标签，数字表示多渠道提交次数累加；红色标签表示需立即处理的问题，红色优先显示
	3、便签默认只显示前三个，其他的需要点开下拉箭头查看，展开后可收起
	4、列表分页，每10项一页，上滑加载
-->
<template>
    <div class="proDetails">

        <HeaderTab
                :module="headerTabModule"
                @tabSearch="toSearch"
                @tabFilter="filterShow"
                @tabRefresh="refresh"
        />

        <div class="noSearch" v-if="dataReady&&listData.length===0">
            <img class="icon_nosearch" src="../images/icon_nosearch.png"/>
            <p>无筛选结果</p>
        </div>
        <div v-else>
            <PullDownRefresh
                    :opt="opt"
                    @pullDown="pullDown"
                    @pullUp="pullUp"
                    ref="pullUpDown"
            >
                <div class="search_result" v-show="isSearch">搜索“{{resultName}}”，结果如下：</div>
                <div class="detail_item" v-for="(items,index) in listData">
                    <div @click="goCarpro(items.plate_no,items.vin,items.update_time,items.car_id,items.branch_name,items.biz_type)">
                        <p class="car_card">
                            <span class="fc33">{{items.plate_no}} </span>
                            (<span class="fc99" v-if="items.vin"> {{items.vin.substring(0, 11)}}</span>
                            <span class="fc33" v-if="items.vin">{{items.vin.substring(11, 17)}}) </span>)
                        </p>
                        <p class="detail_addr fc66">
								<span class="icon_addr">
									<img src="../images/mapb.png" alt="" v-if='items.biz_type==0'/>
									<img src="../images/map-B.png" alt="" v-else/>
								</span>
                            <span>{{items.branch_name}}</span>
                            <span class="go_guide" @click="gotMap(items.plate_no,$event)">
									<span class="icon_guide">
										<img src="../images/daohang.png"/>
									</span>
									导航
								</span>

                        </p>
                        <p class="detail_date fc99">上传时间：<span class="fc33">{{items.update_time}}</span></p>
                        <div class="details_all show_content" data-num="'list'+index" :class="'list'+index">
                                    <span v-for="pro_item in items.part_info"
                                          :class='pro_item.broken_level==1?"red_detail":"black_detail"'
                                          class="pro_item">{{pro_item.desc}}<span>({{pro_item.report_cnt}})</span></span>
                        </div>
                    </div>
                    <div class="click_btn" v-show="items.part_info.length>3">
								<span class="show_btn" @click="showHide('list'+index,$event)">
									<img src="../images/icon_show.png"/>
								</span>
                    </div>
                </div>
            </PullDownRefresh>
        </div>

        <SlideUpBox v-if="filter_show" title="筛选" ref="slideUpBox" @close="filterClose">
            <div class="filter-all">
                <div class="filter-box">
                    <p class="filter-title">车辆状态</p>
                    <div class="filter-list">
                            <span class="filter-item"
                                  v-for="item in filterCheckList1"
                                  :key="item.type"
                                  :class="{active:filterCheckList1_result.includes(item.type)}"
                                  @click="filterMore(1,item.type)">{{item.name}}</span>
                    </div>
                </div>
                <div class="filter-box">
                    <p class="filter-title">部位</p>
                    <div class="filter-list">
                            <span class="filter-item"
                                  v-for="item in filterCheckList2"
                                  :key="item.type"
                                  :class="{active:filterCheckList2_result.includes(item.type)}"
                                  @click="filterMore(2,item.type)">{{item.name}}</span>
                    </div>
                </div>
                <div class="filter-box">
                    <p class="filter-title">车伤量</p>
                    <div class="filter-list">
                        <label :for="'damage'+index" v-for="(item,index) in filterCheckList3" class="filter-radio">
                            <input class="only_check"
                                   :id="'damage'+index"
                                   type="radio"
                                   name="damage"
                                   :checked="filterCheckList3_result === item.type"
                                   @click="filterOnly(3,item.type)"
                            >
                            {{item.name}}
                        </label>
                    </div>
                </div>
                <div class="filter-box">
                    <p class="filter-title">来源</p>
                    <div class="filter-list">
                        <label :for="'source'+index" v-for="(item,index) in filterCheckList4" class="filter-radio">
                            <input class="only_check"
                                   :id="'source'+index"
                                   type="radio"
                                   name="source"
                                   :checked="filterCheckList4_result === item.type"
                                   @click="filterOnly(4,item.type)"
                            >
                            {{item.name}}
                        </label>
                    </div>
                </div>
            </div>
            <div class="box-footer">
                <button class="confirm-reset btn" @click="filterReset">重置</button>
                <button class="confirm-sure btn float-right" @click="filterSearch">确定</button>
            </div>
        </SlideUpBox>

    </div>
</template>

<script>
  import HeaderTab from '../../../../../other_modules/like-manageOrder/component/HeaderTab'
  import SlideUpBox from '../../../../../other_modules/like-manageOrder/component/SlideUpBox'
  import PullDownRefresh from '../../../../../other_modules/vue-pullDownRefresh'
  import {getOspApiUrl} from '../../../../../other_modules/url-constructor/'
  import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
  import appArguments from '../../../../../other_modules/app-arguments'
  import dd from '../../../../../other_modules/like-manageOrder/ddSDK'
  import userData from '../../../../../other_modules/like-manageOrder/UserData'
  import carProblemData from '../js/carProblemData'

  import $ from "jquery"
  //import myAjax from '../common/myAjax/withJq.js'
  import vscroll from '../../../../component/VUEpullDownRefresh/index'


  export default {
    components: {
      HeaderTab,
      SlideUpBox,
      PullDownRefresh,
      vscroll
    },
    data () {
      return {
        dataReady:false,

        headerTabModule: [
          'search',
          'filter',
          'refresh'
        ],
        filter_show: false,//筛选弹层
        opt: {
          height: 300, // 容器高度
          usePullDown: true,// 是否启用下拉
          usePullUp: true // 是否启用上拉
        },
        // 主要列表数据
        listData: [],
        //入口类型 1:后视镜立即处理，2：轮胎立即处理，3：其它立即处理，4：all，8：搜索
        type: this.$route.query.type || '',
        istype: this.$route.query.type,
        // 页码
        nums: 1,

        //筛选弹层数据
        // 车辆状态
        filterCheckList1: [
          {"name": "全部状态", "type": 0},
          {"name": "空闲", "type": 1},
          {"name": "维修", "type": 31},
          {"name": "调度", "type": 30}
        ],
        filterCheckList1_result: [0],
        // 部位
        filterCheckList2: [
          {"name": "全部部位", "type": 0},
          {"name": "爆胎", "type": 25},
          {"name": "趴窝", "type": 26},
          {"name": "车机", "type": 24},
          {"name": "雷达", "type": 21},
          {"name": "仪盘表", "type": 22},
          {"name": "无法启动", "type": 27},
          {"name": "车胎没气", "type": 23}
        ],
        filterCheckList2_result: [0],
        // 车伤量
        filterCheckList3: [
          {"name": "全部有伤", "type": 0},
          {"name": "1处伤", "type": 1},
          {"name": "2处伤", "type": 2},
          {"name": "3处伤", "type": 3},
          {"name": "4处及以上", "type": 4}
        ],
        filterCheckList3_result: 0,
        // 来源
        filterCheckList4: [
          {"name": "全部来源", "type": 0},
          {"name": "客服上报", "type": 2},
          {"name": "运维上报", "type": 4},
          {"name": "用户上报", "type": 1}
        ],
        filterCheckList4_result: 0,

        status:carProblemData.state.status || '',
        car_parts:carProblemData.state.car_parts || [],
        num:carProblemData.state.num || '',
        source:carProblemData.state.source || '',

        resultName: carProblemData.state.name,//搜索关键字
        branchId: carProblemData.state.resId || '',


        show: true,


        isno: false,





        isload: false,//是否改变了筛选条件
        //组件
        refreshing: false,
        //地图
        lng: '',
        lat: '',
        noData: false,


        isAll: '',
        noFilter: false,//是否为筛选结果
        counter: 1, //当前页
        pages: 10, // 一页显示多少条
        pageStart: 0, // 开始页数
        pageEnd: 0, // 结束页数
        listdata: [], // 下拉更新数据存放数组
        scrollData: {
          noFlag: false //暂无更多数据显示
        },
        rest: false,//重置
      }

    },
    computed: {
      isSearch () {
        return this.type === 8
      }
    },
    created () {
      // 计算列表容器高度
      this.opt.height = window.innerHeight - window.REM * 0.4 - 1
    },
    mounted () {
      this.init().then(()=>{
        this.dataReady = true
      })
    },
    methods: {
      init(){
        if (this.isSearch) {
          //判断入口
          return this.getCarList()
        } else {
          return this.getProblemList()
        }
      },

      getCarList (data) {
        if(!data) data = {}

        let loading = this.$_LIKE_loading()
        return myAjax.post(getOspApiUrl('/vehicle-problem/branch-car'), Object.assign({
          mobile: userData.state.mobile,
          //city_id: userData.state.city_ids,
          //lng: userData.state.lng || '116.29870',
          //lat: userData.state.lat || '40.04426'

          branch_id: this.branchId
        },data)).then(res => {
          loading.close()
          if (res.status === 0) {
            if(this.nums === 1){
              this.listData = res.data
            }else{
              this.listData = this.listData.concat(res.data)
            }
          } else {
            this.$_LIKE_toast(res.msg)
          }
        }).catch(err => {
          loading.close()
        })
      },
      getProblemList (data) {
        if(!data) data = {}

        let loading = this.$_LIKE_loading()
        return myAjax.post(getOspApiUrl('/vehicle-problem/list'), Object.assign({

          mobile: userData.state.mobile,
          city_id: userData.state.city_ids,
          lng: userData.state.lng || '116.896',
          lat: userData.state.lat || '39.589',

          car_parts: this.car_parts.length>0?this.car_parts:'',
          source: this.source,
          group: [1,2,3].includes(this.type) ? this.type : '',
          status: this.status,
          num: this.num,
          page: this.nums

        },data)).then(res => {
          loading.close()
          if (res.status === 0) {
            if(this.nums === 1){
              this.listData = res.data
            }else{
              this.listData = this.listData.concat(res.data)
            }
          } else {
            this.$_LIKE_toast(res.msg)
          }
          return res
        }).catch(err => {
          loading.close()
        })
      },

      filterMore (group, type) {
        // 多选
        let result = group === 1 ? this.filterCheckList1_result : this.filterCheckList2_result
        if (type === 0) {
          result.splice(0, result.length)
          result.push(type)
        } else {
          if (result[0] === 0) result.splice(0, 1)
          let index = result.indexOf(type)
          if (index > -1) {
            result.splice(index, 1)
          } else {
            result.push(type)
          }
        }
      },
      filterOnly (group, type) {
        //单选
        if(group === 3){
          this.filterCheckList3_result = type
        }else{
          this.filterCheckList4_result = type
        }

        return

        this.isload = true;
        this.rest = false;
        if (type == 's3') {
          all.type != 0 ? this.num = all.type : this.num = '';//车伤量
        } else {
          all.type != 0 ? this.source = all.type : this.source = '';//来源
        }

      },
      filterReset(){
        this.filterCheckList1_result = [0]
        this.filterCheckList2_result = [0]
        this.filterCheckList3_result = 0
        this.filterCheckList4_result = 0
      },
      filterClose(){
        this.filter_show = false
      },
      filterShow () {
        // 从状态值转换到filter-box的值
        if(this.status === ''){
          this.filterCheckList1_result = [0]
        }else{
          this.filterCheckList1_result = this.status.split(',')
        }

        if(this.car_parts.length === 0){
          this.filterCheckList2_result = [0]
        }else{
          this.filterCheckList2_result = this.car_parts.map(item=>item)
        }

        if([1,2,3].includes(this.num)){
          this.filterCheckList3_result = this.num
        }else{
          this.filterCheckList3_result = 0
        }

        if([1,2,4].includes(this.source)){
          this.filterCheckList4_result = this.num
        }else{
          this.filterCheckList4_result = 0
        }

        //点击筛选按钮
        this.filter_show = true
      },
      filterSearch(){
        // 从filter-box值转换到状态值
        this.status = this.filterCheckList1_result.filter(item=>item!==0).join(',')
        this.car_parts = this.filterCheckList2_result.filter(item=>item!==0)
        this.num = [1,2,3].includes(this.filterCheckList3_result) ? this.filterCheckList3_result : ''
        this.source = [1,2,4].includes(this.filterCheckList4_result) ? this.filterCheckList4_result : ''

        carProblemData.save({
          status:this.status,
          car_parts:this.car_parts,
          num:this.num,
          source:this.source
        })

        this.$refs.slideUpBox.close()
        // 分页器恢复第一页
        this.nums = 1
        this.getProblemList().then(res=>{
          this.$refs.pullUpDown.update()
        })
      },

      pullDown(){
        this.refresh()
      },
      pullUp(){
        if(this.listData.length >=10 && !this.isSearch){
          this.nums++
          this.getProblemList().then(res=>{
            if(res.data.length === 0){
              this.$refs.pullUpDown.update({
                noMore: true
              })
            }else{
              this.$refs.pullUpDown.update()
            }
          })
        }else{
          this.$refs.pullUpDown.update({
            noMore: true
          })
        }

      },

      toSearch(){
        this.$router.push({
          path:'/searchPro',
          query:{
            enter:1
          }
        })
        //window.location.href = 'proOrder.html#/searchPro?enter=1';
      },
      refresh(){
        this.nums = 1

        this.init().then(()=>{
          this.$refs.pullUpDown.update()
        })
      },




      goCarpro (chepai, vin, date, id, branch_name, biz_type) {
        var listItem = {
          'plate_no': chepai,
          'vin': vin,
          'update_time': date,
          'car_id': id,
          'branch_name': branch_name,
          'biz_type': biz_type
        };
        sessionStorage.setItem('listItem', JSON.stringify(listItem));
        window.location.href = 'proOrder.html#/carProDetail';
      },
      showHide (listItem, e) {//控制展开与收起
        e.preventDefault();
        var _this = e.target
        if (this.show) {
          this.show = false;
          $('.' + listItem).removeClass("show_content").addClass("hide_content");
          $(e.target).attr('src', require('../images/icon_hide.png'))
        } else {
          this.show = true;
          $('.' + listItem).addClass("show_content").removeClass("hide_content");
          $(e.target).attr('src', require('../images/icon_show.png'))
        }

      },


      gotMap (plate_no, e) {//去地图页面
        e.stopPropagation();
        window.location.href = "../oilerSingle/carLocation.html?name=" + plate_no;
      }
    }
  }
</script>

<style lang=less scoped>
    .list_all {
        position: relative;
    }

    .box-footer {
        padding-top: 0.15rem;
        width: 100%;
        box-sizing: border-box;
        .btn {
            border: none;
            width: 47%;
            height: 0.4rem;
            font-size: 15px;
            border-radius: 3px;
            padding: 0;
            margin: 0;
            outline: none;
        }
    }

    .confirm-reset {
        background: #d8d8d8;
    }

    .confirm-sure {
        color: #fff;
        background: #333333;
    }

    .filter-all {
        .filter-box {
            .filter-title {
                color: #999;
            }
            .filter-list {
                margin: 0 -0.1rem;
                .filter-item {
                    display: inline-block;
                    padding: 0.08rem 0.1rem;
                    border: 1px solid #cdcdcd;
                    margin: 0.05rem 0.1rem;
                    &.active {
                        background: #333333;
                        color: #FFFFFF;
                    }
                }
                .filter-radio{
                    display: inline-block;
                    padding: 0 0.1rem;
                    margin: 0.05rem 0.1rem;
                    &:nth-of-type(1){
                        display: block;
                    }
                }
            }
        }
    }

    .filter_cont {
        /*min-height: 1rem;*/
        width: 100%;
        background: #FFFFFF;
        position: absolute;
        bottom: 0;
        left: 0;
        padding: 0.12rem 0.2rem 0.5rem 0.1rem;
        transform: translateX(0);
    }

    .filter_header {
        position: relative;
        text-align: center;
        font-size: .16rem;
        margin-bottom: 0.15rem;
    }

    .close_modal {
        position: absolute;
        left: 0.1rem;
    }

    .filter_footer {
        display: -webkit-box;
        display: flex;
        display: -webkit-flex;
        justify-content: space-around;
        -webkit-justify-content: space-around;
        align-items: center;
        -webkit-align-items: center;
        position: absolute;
        width: 95%;
        bottom: 0.07rem;
    }

    .fildec_title {
        margin-bottom: 0.14rem;
    }

    .filter_only .filter_dec {
        margin-bottom: 0.1rem;
    }

    .fildec_items {

    }

    .fildec_items:last-child {
        margin-right: 0;
    }

    .bg_black {
        background: #333333;
        color: #FFFFFF;
    }

    .bg_white {
        background: #FFFFFF;
        color: #333333;
    }

    .filonly_cont label:first-child {
        display: block;
        margin-bottom: 0.1rem;
    }

    .filonly_items {
        margin-right: .2rem;
    }
</style>